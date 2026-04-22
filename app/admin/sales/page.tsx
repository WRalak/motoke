'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockSales, mockSalespeople } from '@/lib/admin-data';
import { mockVehicles } from '@/lib/data';

export default function AdminSales() {
  const [sales, setSales] = useState<any[]>([]);
  const [filteredSales, setFilteredSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    salesperson: 'all',
    saleType: 'all',
    dateRange: 'all'
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const salesWithDetails = mockSales.map(sale => ({
        ...sale,
        vehicle: mockVehicles.find(v => v.id === sale.vehicleId),
        salesperson: mockSalespeople.find(sp => sp.id === sale.salespersonId)
      }));
      setSales(salesWithDetails);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = sales.filter(sale => {
      const matchesStatus = filters.status === 'all' || sale.status === filters.status;
      const matchesSalesperson = filters.salesperson === 'all' || sale.salespersonId === filters.salesperson;
      const matchesType = filters.saleType === 'all' || sale.saleType === filters.saleType;
      
      let matchesDate = true;
      if (filters.dateRange !== 'all') {
        const saleDate = new Date(sale.saleDate);
        const now = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            matchesDate = saleDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = saleDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = saleDate >= monthAgo;
            break;
          case 'quarter':
            const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            matchesDate = saleDate >= quarterAgo;
            break;
        }
      }
      
      return matchesStatus && matchesSalesperson && matchesType && matchesDate;
    });

    setFilteredSales(filtered);
  }, [sales, filters]);

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateTotalRevenue = () => {
    return filteredSales
      .filter(sale => sale.status === 'completed')
      .reduce((total, sale) => total + sale.salePrice, 0);
  };

  const calculateTotalCommission = () => {
    return filteredSales
      .filter(sale => sale.status === 'completed')
      .reduce((total, sale) => total + sale.commission, 0);
  };

  const calculateTotalProfit = () => {
    return filteredSales
      .filter(sale => sale.status === 'completed')
      .reduce((total, sale) => total + sale.profit, 0);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales & Commission Tracking</h1>
          <p className="text-gray-600">Monitor sales performance and commissions</p>
        </div>
        <Button>
          Export Sales Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(calculateTotalRevenue())}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredSales.filter(s => s.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed Sales</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(calculateTotalCommission())}
              </div>
              <div className="text-sm text-gray-600">Total Commission</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(calculateTotalProfit())}
              </div>
              <div className="text-sm text-gray-600">Total Profit</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.salesperson}
              onChange={(e) => setFilters(prev => ({ ...prev, salesperson: e.target.value }))}
            >
              <option value="all">All Salespeople</option>
              {mockSalespeople.map(sp => (
                <option key={sp.id} value={sp.id}>{sp.name}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.saleType}
              onChange={(e) => setFilters(prev => ({ ...prev, saleType: e.target.value }))}
            >
              <option value="all">All Types</option>
              <option value="retail">Retail</option>
              <option value="auction">Auction</option>
              <option value="wholesale">Wholesale</option>
              <option value="fleet">Fleet</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Sale Details</th>
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Salesperson</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Commission</th>
                  <th className="text-left p-4">Profit</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">
                          {sale.vehicle?.year} {sale.vehicle?.make} {sale.vehicle?.model}
                        </div>
                        <div className="text-sm text-gray-500">VIN: {sale.vehicle?.vin}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">ID: {sale.customerId}</div>
                      <div className="text-sm text-gray-500">{sale.paymentMethod}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{sale.salesperson?.name}</div>
                      <div className="text-sm text-gray-500">{sale.salesperson?.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{formatCurrency(sale.salePrice)}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{formatCurrency(sale.commission)}</div>
                      <div className="text-xs text-gray-500">
                        {((sale.commission / sale.salePrice) * 100).toFixed(1)}%
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{formatCurrency(sale.profit)}</div>
                      <div className="text-xs text-gray-500">
                        {((sale.profit / sale.salePrice) * 100).toFixed(1)}%
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize">
                        {sale.saleType}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{sale.saleDate.toLocaleDateString()}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSales.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">dollar-sign</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sales found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sales Performance */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Salespeople</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSalespeople
                .map(sp => ({
                  ...sp,
                  totalSales: filteredSales.filter(s => s.salespersonId === sp.id && s.status === 'completed').length,
                  totalRevenue: filteredSales
                    .filter(s => s.salespersonId === sp.id && s.status === 'completed')
                    .reduce((total, s) => total + s.salePrice, 0),
                  totalCommission: filteredSales
                    .filter(s => s.salespersonId === sp.id && s.status === 'completed')
                    .reduce((total, s) => total + s.commission, 0)
                }))
                .sort((a, b) => b.totalRevenue - a.totalRevenue)
                .slice(0, 5)
                .map((sp, index) => (
                  <div key={sp.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium">{sp.name}</div>
                        <div className="text-sm text-gray-500">{sp.totalSales} sales</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(sp.totalRevenue)}</div>
                      <div className="text-sm text-gray-500">{formatCurrency(sp.totalCommission)} commission</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['retail', 'auction', 'wholesale', 'fleet'].map(type => {
                const typeSales = filteredSales.filter(s => s.saleType === type && s.status === 'completed');
                const revenue = typeSales.reduce((total, s) => total + s.salePrice, 0);
                const count = typeSales.length;
                
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium capitalize">{type}</div>
                      <div className="text-sm text-gray-500">{count} sales</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(revenue)}</div>
                      <div className="text-sm text-gray-500">
                        {count > 0 ? formatCurrency(revenue / count) : 'KES 0'} avg
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
