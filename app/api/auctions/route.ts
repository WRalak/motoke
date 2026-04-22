import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const type = searchParams.get('type') || 'all';

    const where: any = {
      status: status === 'all' ? undefined : status,
      type: type === 'all' ? undefined : type
    };

    // Remove undefined filters
    Object.keys(where).forEach(key => {
      if (where[key] === undefined) {
        delete where[key];
      }
    });

    const auctions = await prisma.auction.findMany({
      where,
      include: {
        auctionVehicles: {
          include: {
            vehicle: {
              include: {
                dealer: {
                  include: {
                    user: {
                      select: {
                        name: true,
                        phone: true
                      }
                    }
                  }
                }
              }
            },
            bids: {
              include: {
                bidder: {
                  select: {
                    name: true,
                    email: true
                  }
                }
              },
              orderBy: { amount: 'desc' },
              take: 1
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(auctions);
  } catch (error) {
    console.error('Error fetching auctions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch auctions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const auction = await prisma.auction.create({
      data: {
        ...body,
        images: JSON.stringify(body.images || []),
        fees: JSON.stringify(body.fees || {}),
        requirements: JSON.stringify(body.requirements || {})
      }
    });

    return NextResponse.json(auction, { status: 201 });
  } catch (error) {
    console.error('Error creating auction:', error);
    return NextResponse.json(
      { error: 'Failed to create auction' },
      { status: 500 }
    );
  }
}
