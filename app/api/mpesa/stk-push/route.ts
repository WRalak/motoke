import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, amount, accountReference, transactionDesc } = body;

    // Validate input
    if (!phoneNumber || !amount || !accountReference) {
      return NextResponse.json(
        { error: 'Missing required fields: phoneNumber, amount, accountReference' },
        { status: 400 }
      );
    }

    // Generate timestamp and password for M-Pesa API
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, -3);
    const shortcode = process.env.MPESA_SHORTCODE || '174379';
    const passkey = process.env.MPESA_PASSKEY || 'bfb279c9769de9c5fd6e8cd5714f2b3d';
    const passwordString = shortcode + passkey + timestamp;
    const password = Buffer.from(passwordString).toString('base64');

    // M-Pesa STK Push request
    const mpesaRequest = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/callback`,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc || 'Payment',
    };

    // In production, make actual API call to Safaricom
    // For now, simulate the response
    const simulatedResponse = {
      CheckoutRequestID: `ws_CO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      MerchantRequestID: `merchant_${Date.now()}`,
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      CustomerMessage: 'Success. Request accepted for processing'
    };

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        type: 'AUCTION_DEPOSIT',
        amount: amount,
        currency: 'KES',
        status: 'PENDING',
        paymentMethod: 'MPESA',
        reference: simulatedResponse.CheckoutRequestID,
        metadata: {
          phoneNumber,
          accountReference,
          transactionDesc,
          mpesaRequest: mpesaRequest
        }
      }
    });

    return NextResponse.json({
      ...simulatedResponse,
      transactionId: transaction.id
    });
  } catch (error) {
    console.error('Error initiating M-Pesa payment:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
