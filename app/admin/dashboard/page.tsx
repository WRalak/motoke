'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockRevenue, mockSales, mockCustomers } from '@/lib/admin-data';
import { mockVehicles, mockDealers } from '@/lib/data';
import { mockAuctions } from '@/lib/auctions';

interface DashboardStats {
  totalRevenue: number;
  totalSales: number;
  totalCustomers: number;
  totalDealers: number;
  activeListings: number;
  activeAuctions: number;
  avgSalePrice: number;
  profitMargin: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalSales: 0,
    totalCustomers: 0,
    totalDealers: 0,
    activeListings: 0,
    activeAuctions: 0,
    avgSalePrice: 0,
    profitMargin: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Calculate dashboard stats
    const currentMonthRevenue = mockRevenue[0];
    const previousMonthRevenue = mockRevenue[1];
    
    const calculatedStats: DashboardStats = {
      totalRevenue: currentMonthRevenue.totalRevenue,
      totalSales: currentMonthRevenue.unitsSold,
      totalCustomers: mockCustomers.length,
      totalDealers: mockDealers.length,
      activeListings: mockVehicles.filter(v => v.status === 'available').length,
      activeAuctions: mockAuctions.filter(a => a.status === 'active').length,
      avgSalePrice: currentMonthRevenue.averageSalePrice,
      profitMargin: currentMonthRevenue.profitMargin
    };

    setStats(calculatedStats);
    setLoading(false);
  }, []);

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getGrowthIndicator = (current: number, previous: number) => {
    const growth = ((current - previous) / previous) * 100;
    return {
      value: growth,
      positive: growth >= 0,
      text: `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`
    };
  };

  const revenueGrowth = getGrowthIndicator(mockRevenue[0].totalRevenue, mockRevenue[1].totalRevenue);
  const salesGrowth = getGrowthIndicator(mockRevenue[0].unitsSold, mockRevenue[1].unitsSold);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your platform performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    revenueGrowth.positive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {revenueGrowth.text}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSales}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    salesGrowth.positive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {salesGrowth.text}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Listings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeListings}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm font-medium text-gray-600">Total vehicles</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm font-medium text-gray-600">Registered users</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRevenue.slice(0, 6).reverse().map((revenue, index) => (
                <div key={revenue.period} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-600">{revenue.period}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(revenue.totalRevenue)}</div>
                    <div className="text-xs text-gray-500">{revenue.unitsSold} units</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Vehicle Sale</div>
                    <div className="text-sm text-gray-600">
                      {mockVehicles.find(v => v.id === sale.vehicleId)?.make} {mockVehicles.find(v => v.id === sale.vehicleId)?.model}
                    </div>
                    <div className="text-xs text-gray-500">{sale.saleDate.toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(sale.salePrice)}</div>
                    <div className="text-xs text-gray-500">{sale.saleType}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="w-full">
              Approve Listings
            </Button>
            <Button variant="outline" className="w-full">
              Manage Dealers
            </Button>
            <Button variant="outline" className="w-full">
              Create Auction
            </Button>
            <Button variant="outline" className="w-full">
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </ProtectedRoute>
  );
}
