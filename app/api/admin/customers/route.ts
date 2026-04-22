import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const customerType = searchParams.get('customerType') || 'all';
    const creditRange = searchParams.get('creditRange') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {
      user: {
        status: status === 'all' ? undefined : status.toUpperCase()
      },
      customerType: customerType === 'all' ? undefined : customerType.toUpperCase()
    };

    // Add credit score filter
    if (creditRange !== 'all') {
      const [min, max] = creditRange.split('-').map(Number);
      where.creditScore = {
        gte: min,
        lte: max === 0 ? undefined : max
      };
    }

    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      prisma.customerProfile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              status: true,
              createdAt: true,
              lastLoginAt: true
            }
          },
          _count: {
            select: {
              sales: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.customerProfile.count({ where })
    ]);

    // Format response
    const formattedCustomers = customers.map(customer => ({
      id: customer.id,
      name: `${customer.user.name}`,
      email: customer.user.email,
      phone: customer.user.phone,
      county: customer.county,
      city: customer.city,
      creditScore: customer.creditScore,
      income: customer.income,
      employmentStatus: customer.employmentStatus,
      employer: customer.employer,
      customerType: 'INDIVIDUAL', // Default value since field is not in schema
      status: customer.user.status,
      purchasesCount: customer._count.sales,
      registrationDate: customer.user.createdAt,
      lastActivity: customer.user.lastLoginAt,
      preferences: customer.preferences
    }));

    return NextResponse.json({
      customers: formattedCustomers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

