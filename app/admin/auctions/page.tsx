'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockAuctions, getActiveAuctions, getUpcomingAuctions } from '@/lib/auctions';

export default function AdminAuctions() {
  const router = useRouter();
  const [auctions, setAuctions] = useState<any[]>([]);
  const [filteredAuctions, setFilteredAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAuctions(mockAuctions);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = auctions.filter(auction => {
      const matchesSearch = !searchTerm || 
        auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auction.organizer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || auction.status === filters.status;
      const matchesType = filters.type === 'all' || auction.type === filters.type;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    setFilteredAuctions(filtered);
  }, [auctions, filters, searchTerm]);

  const handleStatusChange = (auctionId: string, newStatus: string) => {
    setAuctions(prev => prev.map(auction => 
      auction.id === auctionId ? { ...auction, status: newStatus } : auction
    ));
  };

  const getTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ended':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
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
          <h1 className="text-2xl font-bold text-gray-900">Auction Management</h1>
          <p className="text-gray-600">Manage all vehicle auctions on the platform</p>
        </div>
        <Button onClick={() => router.push('/admin/auctions/create')}>
          Create New Auction
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {getActiveAuctions().length}
              </div>
              <div className="text-sm text-gray-600">Live Auctions</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {getUpcomingAuctions().length}
              </div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {auctions.filter(a => a.status === 'ended').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {auctions.filter(a => a.status === 'cancelled').length}
              </div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search auctions..."
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
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="ended">Ended</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="all">All Types</option>
              <option value="live">Live</option>
              <option value="online">Online</option>
              <option value="sealed_bid">Sealed Bid</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Auctions Table */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Auction</th>
                  <th className="text-left p-4">Organizer</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Schedule</th>
                  <th className="text-left p-4">Fees</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Time Remaining</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuctions.map((auction) => (
                  <tr key={auction.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{auction.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {auction.description}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{auction.organizer}</div>
                      {auction.location && (
                        <div className="text-sm text-gray-500">{auction.location}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize">
                        {auction.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>Start: {new Date(auction.startDate).toLocaleDateString()}</div>
                        <div>End: {new Date(auction.endDate).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>Premium: {auction.fees.buyerPremium}%</div>
                        <div>Reg: {formatCurrency(auction.fees.registrationFee)}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(auction.status)}`}>
                        {auction.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {auction.status === 'active' && (
                        <div className="text-sm font-medium text-red-600">
                          {getTimeRemaining(auction.endDate)}
                        </div>
                      )}
                      {auction.status === 'upcoming' && (
                        <div className="text-sm text-gray-600">
                          Starts {new Date(auction.startDate).toLocaleDateString()}
                        </div>
                      )}
                      {auction.status === 'ended' && (
                        <div className="text-sm text-gray-600">
                          {new Date(auction.endDate).toLocaleDateString()}
                        </div>
                      )}
                      {auction.status === 'cancelled' && (
                        <div className="text-sm text-gray-600">
                          Cancelled
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/auctions`)}
                        >
                          View
                        </Button>
                        {auction.status === 'upcoming' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(auction.id, 'active')}
                          >
                            Start
                          </Button>
                        )}
                        {auction.status === 'active' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusChange(auction.id, 'ended')}
                          >
                            End
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/admin/auctions/${auction.id}/edit`)}
                        >
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAuctions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">gavel</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No auctions found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
