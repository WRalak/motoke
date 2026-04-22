import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rateLimiters, getClientIdentifier, rateLimitStore } from '@/lib/rate-limit';
import { validatePagination, validateSearchParams } from '@/lib/validation';
import { vehicleCache } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimit = rateLimiters.vehicles(clientId);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: rateLimit.message },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime?.toString() || ''
          }
        }
      );
    }

    // Validate and parse query parameters
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = validatePagination(
      searchParams.get('page') || undefined,
      searchParams.get('limit') || undefined
    );
    
    const validatedParams = validateSearchParams(searchParams);

    // Create cache key
    const cacheKey = `vehicles:${JSON.stringify(validatedParams)}:${page}:${limit}`;

    // Try to get from cache first
    const cached = vehicleCache.getList()(cacheKey, async () => {
      // Build database query
      const where: any = {
        status: validatedParams.status === 'all' ? undefined : validatedParams.status,
        make: validatedParams.make === 'all' ? undefined : validatedParams.make,
        county: validatedParams.county === 'all' ? undefined : validatedParams.county,
        price: validatedParams.minPrice !== undefined || validatedParams.maxPrice !== undefined ? {
          gte: validatedParams.minPrice,
          lte: validatedParams.maxPrice
        } : undefined,
        OR: validatedParams.search ? [
          { make: { contains: validatedParams.search, mode: 'insensitive' } },
          { model: { contains: validatedParams.search, mode: 'insensitive' } },
          { description: { contains: validatedParams.search, mode: 'insensitive' } }
        ] : undefined
      };

      // Remove undefined filters
      Object.keys(where).forEach(key => {
        if (where[key] === undefined) {
          delete where[key];
        }
      });

      // Execute database queries with timeout
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
                    email: true,
                    phoneVerified: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: Math.min(limit, 100) // Hard limit to prevent excessive data
        }),
        prisma.vehicle.count({ where })
      ]);

      return {
        vehicles,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    });

    return NextResponse.json(cached, {
      headers: {
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': Math.max(0, 100 - (rateLimitStore.get(clientId)?.count || 0)).toString(),
        'X-RateLimit-Reset': rateLimit.resetTime?.toString() || '',
        'Cache-Control': 'public, max-age=120' // 2 minutes cache
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
