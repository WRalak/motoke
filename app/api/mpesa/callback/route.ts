import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('M-Pesa Callback received:', body);

    const {
      CheckoutRequestID,
      MerchantRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata
    } = body;

    // Find the transaction
    const transaction = await prisma.transaction.findFirst({
      where: {
        reference: CheckoutRequestID
      }
    });

    if (!transaction) {
      console.error('Transaction not found for CheckoutRequestID:', CheckoutRequestID);
      return NextResponse.json({ ResultCode: 1 });
    }

    // Update transaction status
    const status = ResultCode === 0 ? 'COMPLETED' : 'FAILED';
    
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status,
        metadata: {
          ...transaction.metadata as any,
          callbackData: body,
          processedAt: new Date().toISOString()
        }
      }
    });

    // If payment was successful, update related records
    if (ResultCode === 0 && CallbackMetadata) {
      const { Amount, MpesaReceiptNumber, PhoneNumber, TransactionDate } = CallbackMetadata.Item.reduce((acc: any, item: any) => {
        acc[item.Name] = item.Value;
        return acc;
      }, {});

      // Update auction deposit status if this was an auction deposit
      if (transaction.type === 'AUCTION_DEPOSIT') {
        const metadata = transaction.metadata as any;
        const auctionVehicleId = metadata.auctionVehicleId;
        const bidderId = metadata.bidderId;

        if (auctionVehicleId && bidderId) {
          // Update bid payment status
          await prisma.bid.updateMany({
            where: {
              auctionVehicleId,
              bidderId,
              status: 'PENDING'
            },
            data: {
              status: 'ACTIVE',
              paymentId: MpesaReceiptNumber
            }
          });

          // Create notification for bidder
          await prisma.notification.create({
            data: {
              userId: bidderId,
              type: 'payment_success',
              title: 'Payment Successful',
              message: `Your auction deposit of KES ${Amount} has been received successfully. You can now place bids.`,
              data: {
                transactionId: transaction.id,
                amount: Amount,
                receiptNumber: MpesaReceiptNumber
              }
            }
          });
        }
      }
    }

    // Always return success to M-Pesa
    return NextResponse.json({ ResultCode: 0 });
  } catch (error) {
    console.error('Error processing M-Pesa callback:', error);
    return NextResponse.json({ ResultCode: 1 });
  }
}
