'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/ProtectedRoute';
import { db } from '@/lib/database';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/database';

export default function DealerDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inventory' | 'listings' | 'bids' | 'messages' | 'analytics'>('inventory');
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeListings: 0,
    totalBids: 0,
    unreadMessages: 0
  });

  const loadDashboardData = async () => {
    const user = auth.getUser();
    if (!user) {
      router.push('/auth/login?redirect=/dealer/dashboard');
      return;
    }

    setLoading(true);
    try {
      // Load dealer's vehicles
      const vehiclesData = await db.vehicles.findMany({
        where: { dealerId: user.id }
      });
      setVehicles(vehiclesData);

      // Load dealer's listings
      const listingsData = await db.listings.findMany({
        where: { sellerId: user.id }
      });
      setListings(listingsData);

      // Load bids on dealer's vehicles
      const bidsData = await db.bids.findMany({
        where: {
          vehicle: {
            dealerId: user.id
          }
        }
      });
      setBids(bidsData);

      // Load messages for dealer
      const messagesData = await db.messages.findMany({
        where: {
          dealerId: user.id
        }
      });
      setMessages(messagesData);

      // Calculate stats
      setStats({
        totalVehicles: vehiclesData.length,
        activeListings: listingsData.filter((l: any) => l.status === 'ACTIVE').length,
        totalBids: bidsData.length,
        unreadMessages: messagesData.filter((m: any) => !m.isRead).length
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCreateListing = async (vehicleId: string) => {
    try {
      const vehicle = await db.vehicles.findById(vehicleId);

      if (!vehicle) return;

      await db.listings.create({
        data: {
          title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
          description: vehicle.description || `Excellent ${vehicle.make} ${vehicle.model}`,
          price: vehicle.price,
          status: 'ACTIVE',
          vehicleId: vehicle.id,
          sellerId: auth.getUser()?.id
        }
      });

      // Update vehicle status to listed
      await db.vehicles.update(vehicleId, { status: 'AVAILABLE' });

      // Reload data
      loadDashboardData();
    } catch (error) {
      console.error('Error creating listing:', error);
    }
  };

  const handleUpdateListing = async (listingId: string, updates: any) => {
    try {
      await db.listings.update(listingId, updates);
      loadDashboardData();
    } catch (error) {
      console.error('Error updating listing:', error);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      await db.listings.delete(listingId);
      loadDashboardData();
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const handleBidResponse = async (bidId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await db.bids.update(bidId, { status });
      loadDashboardData();
    } catch (error) {
      console.error('Error responding to bid:', error);
    }
  };

  const handleMessageRead = async (messageId: string) => {
    try {
      await db.messages.update(messageId, { isRead: true });
      loadDashboardData();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      await db.vehicles.delete(vehicleId);
      loadDashboardData();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  const handleUpdateVehicle = async (vehicleId: string, updates: any) => {
    try {
      await db.vehicles.update(vehicleId, updates);
      loadDashboardData();
    } catch (error) {
      console.error('Error updating vehicle:', error);
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
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-green-500 mb-2">Dealer Dashboard</h1>
            <p className="text-gray-300">Manage your inventory, listings, and communications</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-500">{stats.totalVehicles}</div>
                <div className="text-sm text-gray-400">Total Vehicles</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-500">{stats.activeListings}</div>
                <div className="text-sm text-gray-400">Active Listings</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-500">{stats.totalBids}</div>
                <div className="text-sm text-gray-400">Total Bids</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-500">{stats.unreadMessages}</div>
                <div className="text-sm text-gray-400">Unread Messages</div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {['inventory', 'listings', 'bids', 'messages', 'analytics'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? 'border-green-500 text-green-500'
                        : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <Card className="bg-gray-800 border-gray-700">
            {activeTab === 'inventory' && (
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Vehicle Inventory</h2>
                <div className="mb-4">
                  <Button
                    onClick={() => router.push('/dealer/add-vehicle')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Add New Vehicle
                  </Button>
                </div>
                {vehicles.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-6xl mb-4">car</div>
                    <h3 className="text-lg font-medium text-white mb-2">No vehicles in inventory</h3>
                    <p className="text-gray-400">Add your first vehicle to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                      <Card key={vehicle.id} className="bg-gray-800 border-gray-700">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                              </h3>
                              <p className="text-gray-400">{vehicle.mileage && vehicle.mileage.toLocaleString()} km</p>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-green-500">
                                KES {vehicle.price.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {vehicle.features?.slice(0, 3).map((feature: string, index: number) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full border border-gray-600"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateVehicle(vehicle.id, { status: 'AVAILABLE' })}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            )}

            {activeTab === 'listings' && (
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Active Listings</h2>
                <div className="mb-4">
                  <Button
                    onClick={() => router.push('/dealer/create-listing')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Create New Listing
                  </Button>
                </div>
                {listings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-6xl mb-4">list</div>
                    <h3 className="text-lg font-medium text-white mb-2">No active listings</h3>
                    <p className="text-gray-400">Create your first listing to reach more buyers</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {listings.map((listing) => (
                      <Card key={listing.id} className="bg-gray-800 border-gray-700">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                {listing.title}
                              </h3>
                              <p className="text-gray-400">
                                {listing.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-green-500">
                                KES {listing.price.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <span>Status: {listing.status}</span>
                            <span>•</span>
                            <span>Created: {new Date(listing.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex space-x-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateListing(listing.id, { status: listing.status === 'ACTIVE' ? 'EXPIRED' : 'ACTIVE' })}
                            >
                              {listing.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteListing(listing.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            )}

            {activeTab === 'bids' && (
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Bid Management</h2>
                {bids.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-6xl mb-4">gavel</div>
                    <h3 className="text-lg font-medium text-white mb-2">No bids received</h3>
                    <p className="text-gray-400">Bids on your vehicles will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bids.map((bid) => (
                      <Card key={bid.id} className="bg-gray-800 border-gray-700">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                Bid of KES {bid.amount.toLocaleString()}
                              </h3>
                              <p className="text-gray-400">
                                On: {bid.vehicle?.year} {bid.vehicle?.make} {bid.vehicle?.model}
                              </p>
                              <p className="text-sm text-gray-400">
                                By: {bid.bidder?.name}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-500">
                                {bid.status}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2 mt-4">
                            {bid.status === 'PENDING' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleBidResponse(bid.id, 'ACCEPTED')}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  Accept
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleBidResponse(bid.id, 'REJECTED')}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            )}

            {activeTab === 'messages' && (
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Messages</h2>
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-6xl mb-4">message</div>
                    <h3 className="text-lg font-medium text-white mb-2">No messages</h3>
                    <p className="text-gray-400">Your messages with buyers and sellers will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <Card key={message.id} className="bg-gray-800 border-gray-700">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                From: {message.sender?.name}
                              </h3>
                              <p className="text-gray-400 text-sm mb-2">
                                {new Date(message.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-gray-300">
                                {message.content}
                              </p>
                            </div>
                            {!message.isRead && (
                              <div className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMessageRead(message.id)}
                                >
                                  Mark as Read
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            )}

            {activeTab === 'analytics' && (
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-lg font-semibold text-white mb-2">Listing Performance</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Listings</span>
                          <span className="text-xl font-bold text-white">{listings.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Active Listings</span>
                          <span className="text-xl font-bold text-green-500">{stats.activeListings}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Sold This Month</span>
                          <span className="text-xl font-bold text-blue-500">0</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-lg font-semibold text-white mb-2">Bid Activity</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Bids</span>
                          <span className="text-xl font-bold text-white">{bids.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Accepted Bids</span>
                          <span className="text-xl font-bold text-green-500">0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Pending Bids</span>
                          <span className="text-xl font-bold text-yellow-500">{bids.filter(b => b.status === 'PENDING').length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-lg font-semibold text-white mb-2">Message Statistics</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Messages</span>
                          <span className="text-xl font-bold text-white">{messages.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Unread Messages</span>
                          <span className="text-xl font-bold text-purple-500">{stats.unreadMessages}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
