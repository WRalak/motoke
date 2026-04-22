import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    const { bidderId, amount, type = 'MANUAL', paymentId } = body;

    // Get the auction vehicle
    const auctionVehicle = await prisma.auctionVehicle.findUnique({
      where: { id },
      include: {
        vehicle: true,
        auction: true,
        bids: {
          include: {
            bidder: {
              select: {
                name: true,
                email: true
              }
            }
          },
          orderBy: { amount: 'desc' }
        }
      }
    });

    if (!auctionVehicle) {
      return NextResponse.json(
        { error: 'Auction vehicle not found' },
        { status: 404 }
      );
    }

    // Check if auction is still active
    if (auctionVehicle.auction.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Auction is not active' },
        { status: 400 }
      );
    }

    // Check if auction has ended
    if (new Date() > new Date(auctionVehicle.auction.endDate)) {
      return NextResponse.json(
        { error: 'Auction has ended' },
        { status: 400 }
      );
    }

    // Get current highest bid
    const currentHighestBid = auctionVehicle.bids[0]?.amount || auctionVehicle.startingBid;

    // Check if bid is higher than current highest
    if (amount <= currentHighestBid) {
      return NextResponse.json(
        { error: `Bid must be higher than current highest bid of KES ${currentHighestBid}` },
        { status: 400 }
      );
    }

    // Check if bid meets minimum increment (KES 500)
    const minIncrement = 500;
    if (amount - currentHighestBid < minIncrement) {
      return NextResponse.json(
        { error: `Minimum bid increment is KES ${minIncrement}` },
        { status: 400 }
      );
    }

    // Create the bid
    const bid = await prisma.bid.create({
      data: {
        vehicleId: auctionVehicle.vehicleId,
        auctionVehicleId: auctionVehicle.id,
        bidderId,
        amount,
        type,
        paymentId,
        status: 'ACTIVE'
      },
      include: {
        bidder: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    // Update previous highest bid to OUTBID
    if (auctionVehicle.bids.length > 0) {
      await prisma.bid.updateMany({
        where: {
          id: auctionVehicle.bids[0].id
        },
        data: {
          status: 'OUTBID'
        }
      });
    }

    // Update auction vehicle
    await prisma.auctionVehicle.update({
      where: { id: auctionVehicle.id },
      data: {
        currentBid: amount,
        bidCount: auctionVehicle.bidCount + 1
      }
    });

    // Check if reserve price is met
    const reserveMet = auctionVehicle.reservePrice && amount >= auctionVehicle.reservePrice;

    // Create notifications
    // Notify outbid bidder if any
    if (auctionVehicle.bids.length > 0) {
      await prisma.notification.create({
        data: {
          userId: auctionVehicle.bids[0].bidderId,
          type: 'outbid',
          title: 'You have been outbid',
          message: `Your bid of KES ${currentHighestBid} has been outbid. New highest bid is KES ${amount}.`,
          data: {
            auctionVehicleId: auctionVehicle.id,
            previousBid: currentHighestBid,
            newBid: amount
          }
        }
      });
    }

    // Check for proxy bids that should trigger
    await processProxyBids(auctionVehicle.id, amount, bidderId);

    return NextResponse.json({
      bid,
      message: 'Bid placed successfully',
      reserveMet
    });
  } catch (error) {
    console.error('Error placing bid:', error);
    return NextResponse.json(
      { error: 'Failed to place bid' },
      { status: 500 }
    );
  }
}

async function processProxyBids(auctionVehicleId: string, newBidAmount: number, newBidderId: string) {
  try {
    // Get active proxy bids for this auction vehicle, excluding the new bidder
    const proxyBids = await prisma.proxyBid.findMany({
      where: {
        auctionVehicleId,
        isActive: true,
        bidderId: { not: newBidderId },
        maximumAmount: { gt: newBidAmount }
      },
      orderBy: { maximumAmount: 'desc' }
    });

    for (const proxyBid of proxyBids) {
      // Calculate next proxy bid
      const incrementAmount = proxyBid.incrementAmount || 500;
      const nextBidAmount = newBidAmount + incrementAmount;

      // Check if proxy bidder can still bid
      if (nextBidAmount <= proxyBid.maximumAmount) {
        // Place proxy bid
        await prisma.bid.create({
          data: {
            vehicleId: proxyBid.vehicleId,
            auctionVehicleId,
            bidderId: proxyBid.bidderId,
            amount: nextBidAmount,
            type: 'PROXY',
            status: 'WINNING'
          }
        });

        // Update proxy bid
        await prisma.proxyBid.update({
          where: { id: proxyBid.id },
          data: {
            currentBid: nextBidAmount,
            lastTriggeredAt: new Date()
          }
        });

        // Update auction vehicle
        await prisma.auctionVehicle.update({
          where: { id: auctionVehicleId },
          data: {
            currentBid: nextBidAmount,
            bidCount: { increment: 1 }
          }
        });

        // Notify new bidder about proxy bid
        await prisma.notification.create({
          data: {
            userId: newBidderId,
            type: 'proxy_bid',
            title: 'Automatic Bid Placed',
            message: `An automatic bid of KES ${nextBidAmount} has been placed. You are currently outbid.`,
            data: {
              auctionVehicleId,
              bidAmount: nextBidAmount
            }
          }
        });

        // Update previous winning bid to OUTBID
        await prisma.bid.updateMany({
          where: {
            auctionVehicleId,
            status: 'WINNING',
            bidderId: { not: proxyBid.bidderId }
          },
          data: {
            status: 'OUTBID'
          }
        });

        // Continue processing with the new proxy bid amount
        await processProxyBids(auctionVehicleId, nextBidAmount, proxyBid.bidderId);
      } else {
        // Proxy bidder has reached their maximum
        await prisma.proxyBid.update({
          where: { id: proxyBid.id },
          data: {
            isActive: false
          }
        });

        // Notify proxy bidder they've reached their maximum
        await prisma.notification.create({
          data: {
            userId: proxyBid.bidderId,
            type: 'max_reached',
            title: 'Maximum Bid Reached',
            message: `Your maximum bid of KES ${proxyBid.maximumAmount} has been reached. You are currently outbid.`,
            data: {
              auctionVehicleId,
              maximumAmount: proxyBid.maximumAmount
            }
          }
        });
      }
    }
  } catch (error) {
    console.error('Error processing proxy bids:', error);
  }
}
