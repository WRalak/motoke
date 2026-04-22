'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Auction, mockAuctions, getActiveAuctions, getUpcomingAuctions } from '@/lib/auctions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';

export default function AuctionsPage() {
  const router = useRouter();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'ended'>('all');
  const [loading, setLoading] = useState(true);

  const handleAuctionAction = (action: string, auctionId: string) => {
    if (!auth.getToken() || !auth.getUser()) {
      router.push('/auth/login?redirect=/auctions');
      return;
    }
    // Handle auction action logic here
    console.log(`${action} for auction ${auctionId}`);
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAuctions(mockAuctions);
      setLoading(false);
    }, 500);
  }, []);

  const filteredAuctions = auctions.filter(auction => {
    switch (filter) {
      case 'active':
        return auction.status === 'active';
      case 'upcoming':
        return auction.status === 'upcoming';
      case 'ended':
        return auction.status === 'ended';
      default:
        return true;
    }
  });

  const getTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-900 text-green-300';
      case 'upcoming':
        return 'bg-blue-900 text-blue-300';
      case 'ended':
        return 'bg-gray-700 text-gray-300';
      case 'cancelled':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-500 mb-2">Vehicle Auctions</h1>
          <p className="text-gray-300">Browse and participate in live and upcoming vehicle auctions</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg border border-gray-700">
            {[
              { key: 'all', label: 'All Auctions' },
              { key: 'active', label: 'Live Now' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'ended', label: 'Ended' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-gray-700 text-green-500 shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Auction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <Card key={auction.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
              {/* Auction Image */}
              <div className="aspect-video bg-gray-700 relative">
                <img
                  src={auction.images[0] || '/images/placeholder-auction.jpg'}
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(auction.status)}`}>
                    {auction.status.toUpperCase()}
                  </span>
                </div>
                {auction.status === 'active' && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                      LIVE
                    </div>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                {/* Auction Title */}
                <CardTitle className="text-lg mb-2">{auction.title}</CardTitle>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{auction.description}</p>

                {/* Auction Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Type:</span>
                    <span className="text-sm font-medium capitalize">{auction.type.replace('_', ' ')}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Organizer:</span>
                    <span className="text-sm font-medium">{auction.organizer}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Buyer Premium:</span>
                    <span className="text-sm font-medium">{auction.fees.buyerPremium}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Registration:</span>
                    <span className="text-sm font-medium">KES {auction.fees.registrationFee.toLocaleString()}</span>
                  </div>

                  {auction.status === 'active' && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Time Remaining:</span>
                      <span className="text-sm font-medium text-red-600">
                        {getTimeRemaining(auction.endDate)}
                      </span>
                    </div>
                  )}

                  {auction.status === 'upcoming' && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Starts:</span>
                      <span className="text-sm font-medium">
                        {new Date(auction.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {auction.location && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Location:</span>
                      <span className="text-sm font-medium truncate ml-2">{auction.location}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {auction.status === 'active' && (
                    <>
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={() => handleAuctionAction('join', auction.id)}
                      >
                        Join Live Auction
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        size="sm"
                        onClick={() => handleAuctionAction('view-catalog', auction.id)}
                      >
                        View Catalog
                      </Button>
                    </>
                  )}
                  
                  {auction.status === 'upcoming' && (
                    <>
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={() => handleAuctionAction('register-bid', auction.id)}
                      >
                        Register to Bid
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        size="sm"
                        onClick={() => handleAuctionAction('view-catalog', auction.id)}
                      >
                        View Catalog
                      </Button>
                    </>
                  )}
                  
                  {auction.status === 'ended' && (
                    <Button variant="outline" className="w-full" size="sm">
                      View Results
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAuctions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">gavel</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No auctions found</h3>
            <p className="text-gray-600">Check back later for new auctions</p>
          </div>
        )}

        {/* How It Works Section */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-8">How Vehicle Auctions Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Register',
                description: 'Create an account and complete bidder verification'
              },
              {
                step: '2',
                title: 'Browse',
                description: 'View available vehicles and auction catalogs'
              },
              {
                step: '3',
                title: 'Bid',
                description: 'Place bids online or join live auctions'
              },
              {
                step: '4',
                title: 'Win',
                description: 'Complete payment and arrange vehicle delivery'
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
