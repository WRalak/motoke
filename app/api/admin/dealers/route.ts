import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {
      user: {
        status: status === 'all' ? undefined : status.toUpperCase()
      }
    };

    const skip = (page - 1) * limit;

    const [dealers, total] = await Promise.all([
      prisma.dealerProfile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              status: true,
              createdAt: true
            }
          },
          _count: {
            select: {
              vehicles: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.dealerProfile.count({ where })
    ]);

    // Format response
    const formattedDealers = dealers.map(dealer => ({
      id: dealer.id,
      name: dealer.businessName,
      email: dealer.email,
      phone: dealer.phone,
      county: dealer.county,
      city: dealer.city,
      rating: dealer.rating,
      reviewCount: dealer.reviewCount,
      verified: dealer.verified,
      subscriptionPlan: dealer.subscriptionPlan,
      established: dealer.established,
      status: dealer.user.status,
      vehiclesCount: dealer._count.vehicles,
      createdAt: dealer.createdAt,
      user: dealer.user
    }));

    return NextResponse.json({
      dealers: formattedDealers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching dealers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dealers' },
      { status: 500 }
    );
  }
}

