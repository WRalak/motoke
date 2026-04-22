import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const make = searchParams.get('make') || '';
    const status = searchParams.get('status') || 'available';
    const county = searchParams.get('county') || '';
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;

    const skip = (page - 1) * limit;

    const where: any = {
      status: status === 'all' ? undefined : status,
      make: make === 'all' ? undefined : make,
      county: county === 'all' ? undefined : county,
      price: minPrice !== undefined || maxPrice !== undefined ? {
        gte: minPrice,
        lte: maxPrice
      } : undefined,
      OR: search ? [
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ] : undefined
    };

    // Remove undefined filters
    Object.keys(where).forEach(key => {
      if (where[key] === undefined) {
        delete where[key];
      }
    });

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: {
          dealer: {
            include: {
              user: {
                select: {
                  name: true,
                  phone: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.vehicle.count({ where })
    ]);

    return NextResponse.json({
      vehicles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const vehicle = await prisma.vehicle.create({
      data: {
        ...body,
        images: JSON.stringify(body.images || []),
        features: JSON.stringify(body.features || []),
        dealer: {
          connect: {
            userId: body.dealerId
          }
        }
      },
      include: {
        dealer: {
          include: {
            user: {
              select: {
                name: true,
                phone: true,
                email: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    );
  }
}
