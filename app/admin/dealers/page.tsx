'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDealers } from '@/lib/data';

export default function AdminDealers() {
  const router = useRouter();
  const [dealers, setDealers] = useState<any[]>([]);
  const [filteredDealers, setFilteredDealers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    city: 'all',
    verified: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDealers(mockDealers);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = dealers.filter(dealer => {
      const matchesSearch = !searchTerm || 
        dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealer.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || dealer.status === filters.status;
      const matchesCity = filters.city === 'all' || dealer.city === filters.city;
      const matchesVerified = filters.verified === 'all' || 
        (filters.verified === 'verified' && dealer.verified) ||
        (filters.verified === 'unverified' && !dealer.verified);
      
      return matchesSearch && matchesStatus && matchesCity && matchesVerified;
    });

    setFilteredDealers(filtered);
  }, [dealers, filters, searchTerm]);

  const handleStatusChange = (dealerId: string, newStatus: string) => {
    setDealers(prev => prev.map(dealer => 
      dealer.id === dealerId ? { ...dealer, status: newStatus } : dealer
    ));
  };

  const handleVerificationToggle = (dealerId: string) => {
    setDealers(prev => prev.map(dealer => 
      dealer.id === dealerId ? { ...dealer, verified: !dealer.verified } : dealer
    ));
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const cities = ['all', ...Array.from(new Set(mockDealers.map(d => d.city)))];

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
          <h1 className="text-2xl font-bold text-gray-900">Dealer Management</h1>
          <p className="text-gray-600">Manage all dealers on the platform</p>
        </div>
        <Button onClick={() => router.push('/auth/register')}>
          Add New Dealer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {dealers.filter(d => d.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active Dealers</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {dealers.filter(d => d.verified).length}
              </div>
              <div className="text-sm text-gray-600">Verified Dealers</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {dealers.filter(d => d.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Approval</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {dealers.filter(d => d.status === 'suspended').length}
              </div>
              <div className="text-sm text-gray-600">Suspended Dealers</div>
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
              placeholder="Search dealers..."
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
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
            >
              {cities.map(city => (
                <option key={city} value={city}>
                  {city === 'all' ? 'All Cities' : city}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.verified}
              onChange={(e) => setFilters(prev => ({ ...prev, verified: e.target.value }))}
            >
              <option value="all">All Verification</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Dealers Table */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Dealer</th>
                  <th className="text-left p-4">Contact</th>
                  <th className="text-left p-4">Location</th>
                  <th className="text-left p-4">Rating</th>
                  <th className="text-left p-4">Vehicles</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Joined</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDealers.map((dealer) => (
                  <tr key={dealer.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {dealer.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{dealer.name}</div>
                          <div className="text-sm text-gray-500">
                            Est. {dealer.established}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="text-sm">{dealer.email}</div>
                        <div className="text-sm text-gray-500">{dealer.phone}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="text-sm">{dealer.city}, {dealer.state}</div>
                        <div className="text-sm text-gray-500">{dealer.zipCode}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {renderStars(dealer.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {dealer.rating} ({dealer.reviewCount})
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium">
                        {dealer.vehicles?.length || 0}
                      </div>
                      <div className="text-xs text-gray-500">Listings</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          dealer.status === 'active' ? 'bg-green-100 text-green-800' :
                          dealer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          dealer.status === 'suspended' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {dealer.status}
                        </span>
                        {dealer.verified && (
                          <div className="flex items-center text-green-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-500">
                        {dealer.createdAt.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/admin/dealers/${dealer.id}`)}
                        >
                          View
                        </Button>
                        {dealer.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(dealer.id, 'active')}
                          >
                            Approve
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVerificationToggle(dealer.id)}
                        >
                          {dealer.verified ? 'Unverify' : 'Verify'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDealers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">store</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No dealers found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
