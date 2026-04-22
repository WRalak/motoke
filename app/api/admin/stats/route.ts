import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Get basic stats
    const [
      totalVehicles,
      availableVehicles,
      pendingVehicles,
      totalDealers,
      activeDealers,
      pendingDealers,
      totalCustomers,
      activeAuctions,
      upcomingAuctions,
      totalSales,
      completedSales,
      totalRevenue,
      commissionRevenue
    ] = await Promise.all([
      // Vehicle stats
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: 'AVAILABLE' } }),
      prisma.vehicle.count({ where: { status: 'PENDING' } }),
      
      // Dealer stats
      prisma.dealerProfile.count(),
      prisma.dealerProfile.count({ 
        where: { 
          user: { status: 'ACTIVE' } 
        } 
      }),
      prisma.dealerProfile.count({ 
        where: { 
          user: { status: 'INACTIVE' } 
        } 
      }),
      
      // Customer stats
      prisma.customerProfile.count(),
      
      // Auction stats
      prisma.auction.count({ where: { status: 'ACTIVE' } }),
      prisma.auction.count({ where: { status: 'UPCOMING' } }),
      
      // Sales stats
      prisma.sale.count(),
      prisma.sale.count({ where: { status: 'COMPLETED' } }),
      prisma.sale.aggregate({
        where: { 
          status: 'COMPLETED',
          saleDate: { gte: startDate }
        },
        _sum: { salePrice: true }
      }),
      prisma.sale.aggregate({
        where: { 
          status: 'COMPLETED',
          saleDate: { gte: startDate }
        },
        _sum: { commission: true }
      })
    ]);

    // Get revenue breakdown by month for the last 6 months
    const monthlyRevenue = await prisma.$queryRaw`
      SELECT 
        strftime('%Y-%m', sale_date) as month,
        COUNT(*) as sales_count,
        SUM(sale_price) as total_revenue,
        SUM(commission) as commission_revenue,
        AVG(sale_price) as avg_sale_price
      FROM sales 
      WHERE status = 'COMPLETED' 
        AND sale_date >= date('now', '-6 months')
      GROUP BY strftime('%Y-%m', sale_date)
      ORDER BY month ASC
    `;

    // Get sales by type
    const salesByType = await prisma.sale.groupBy({
      by: ['saleType'],
      where: { 
        status: 'COMPLETED',
        saleDate: { gte: startDate }
      },
      _count: true,
      _sum: { salePrice: true }
    });

    // Get top dealers by sales volume
    const topDealers = await prisma.sale.groupBy({
      by: ['dealerId'],
      where: { 
        status: 'COMPLETED',
        saleDate: { gte: startDate }
      },
      _count: true,
      _sum: { salePrice: true, commission: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    });

    // Get recent activity
    const recentSales = await prisma.sale.findMany({
      take: 10,
      orderBy: { saleDate: 'desc' },
      include: {
        vehicle: {
          select: {
            make: true,
            model: true,
            year: true
          }
        },
        dealer: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        customer: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    // Format response
    const stats = {
      vehicles: {
        total: totalVehicles,
        available: availableVehicles,
        pending: pendingVehicles
      },
      dealers: {
        total: totalDealers,
        active: activeDealers,
        pending: pendingDealers
      },
      customers: {
        total: totalCustomers
      },
      auctions: {
        active: activeAuctions,
        upcoming: upcomingAuctions
      },
      sales: {
        total: totalSales,
        completed: completedSales,
        revenue: totalRevenue._sum.salePrice || 0,
        commission: commissionRevenue._sum.commission || 0
      },
      monthlyRevenue: monthlyRevenue,
      salesByType: salesByType,
      topDealers: topDealers,
      recentActivity: recentSales
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
