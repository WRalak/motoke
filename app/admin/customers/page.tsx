'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCustomers } from '@/lib/admin-data';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    customerType: 'all',
    creditRange: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCustomers(mockCustomers);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = customers.filter(customer => {
      const matchesSearch = !searchTerm || 
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || customer.status === filters.status;
      const matchesType = filters.customerType === 'all' || customer.customerType === filters.customerType;
      
      let matchesCredit = true;
      if (filters.creditRange !== 'all') {
        const [min, max] = filters.creditRange.split('-').map(Number);
        matchesCredit = customer.creditScore >= min && (max === 0 || customer.creditScore <= max);
      }
      
      return matchesSearch && matchesStatus && matchesType && matchesCredit;
    });

    setFilteredCustomers(filtered);
  }, [customers, filters, searchTerm]);

  const handleStatusChange = (customerId: string, newStatus: string) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId ? { ...customer, status: newStatus } : customer
    ));
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 700) return 'text-blue-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'blacklisted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const creditRanges = [
    { value: 'all', label: 'All Credit Scores' },
    { value: '0-650', label: 'Poor (Below 650)' },
    { value: '650-700', label: 'Fair (650-700)' },
    { value: '700-750', label: 'Good (700-750)' },
    { value: '750-900', label: 'Excellent (750+)' }
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage all customers and their purchase history</p>
        </div>
        <Button>
          Export Customer List
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {customers.filter(c => c.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active Customers</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {customers.filter(c => c.customerType === 'individual').length}
              </div>
              <div className="text-sm text-gray-600">Individual Buyers</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {customers.filter(c => c.customerType === 'business').length}
              </div>
              <div className="text-sm text-gray-600">Business Buyers</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {customers.filter(c => c.creditScore >= 700).length}
              </div>
              <div className="text-sm text-gray-600">Good Credit (700+)</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search customers..."
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blacklisted">Blacklisted</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.customerType}
              onChange={(e) => setFilters(prev => ({ ...prev, customerType: e.target.value }))}
            >
              <option value="all">All Types</option>
              <option value="individual">Individual</option>
              <option value="business">Business</option>
              <option value="fleet">Fleet</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.creditRange}
              onChange={(e) => setFilters(prev => ({ ...prev, creditRange: e.target.value }))}
            >
              {creditRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Contact</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Credit Score</th>
                  <th className="text-left p-4">Income</th>
                  <th className="text-left p-4">Purchases</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Joined</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">
                            {customer.firstName} {customer.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {customer.employmentStatus}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="text-sm">{customer.email}</div>
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize">
                        {customer.customerType}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className={`font-medium ${getCreditScoreColor(customer.creditScore)}`}>
                        {customer.creditScore}
                      </div>
                      <div className="text-xs text-gray-500">FICO Score</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{formatCurrency(customer.income)}</div>
                      <div className="text-xs text-gray-500">Annual</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{customer.purchaseHistory.length}</div>
                      <div className="text-xs text-gray-500">Vehicles</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-500">
                        {customer.registrationDate.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View Profile
                        </Button>
                        <Button size="sm" variant="outline">
                          Contact
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">users</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Segments */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>High Value Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customers
                .filter(c => c.income >= 100000 && c.creditScore >= 700)
                .slice(0, 3)
                .map(customer => (
                  <div key={customer.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {customer.firstName} {customer.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(customer.income)} income
                      </div>
                    </div>
                    <div className={`font-medium ${getCreditScoreColor(customer.creditScore)}`}>
                      {customer.creditScore}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customers
                .filter(c => c.status === 'active')
                .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
                .slice(0, 3)
                .map(customer => (
                  <div key={customer.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {customer.firstName} {customer.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Last active {customer.lastActivity.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {customer.purchaseHistory.length} purchases
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customers Needing Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customers
                .filter(c => c.creditScore < 650 || c.status === 'inactive')
                .slice(0, 3)
                .map(customer => (
                  <div key={customer.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {customer.firstName} {customer.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {customer.creditScore < 650 ? 'Low credit score' : 'Inactive'}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Follow Up
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
