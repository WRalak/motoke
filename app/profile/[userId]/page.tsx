'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'USER' | 'DEALER' | 'ADMIN';
  verified: boolean;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

interface UserStats {
  totalVehicles: number;
  totalListings: number;
  totalBids: number;
  joinDate: string;
}

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'vehicles' | 'listings' | 'bids'>('about');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const resolvedParams = await params;
        
        // Fetch user profile
        const userResponse = await fetch(`/api/users/${resolvedParams.userId}`);
        if (!userResponse.ok) {
          notFound();
        }
        const userData = await userResponse.json();
        setUser(userData);

        // Fetch user stats
        const statsResponse = await fetch(`/api/users/${resolvedParams.userId}/stats`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">User Not Found</h2>
          <p className="text-gray-400">The user profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-green-500"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-700 border-4 border-green-500 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                {user.verified && (
                  <Badge variant="secondary" className="bg-green-600 text-white">
                    ✓ Verified
                  </Badge>
                )}
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {user.role}
                </Badge>
              </div>
              
              <div className="space-y-1 text-gray-300">
                <p>📧 {user.email}</p>
                {user.phone && <p>📱 {user.phone}</p>}
                {user.bio && <p className="mt-2">{user.bio}</p>}
                <p className="text-sm text-gray-400">
                  📅 Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-500">{stats.totalVehicles}</div>
                <div className="text-gray-400">Vehicles</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-500">{stats.totalListings}</div>
                <div className="text-gray-400">Listings</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-500">{stats.totalBids}</div>
                <div className="text-gray-400">Bids</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-lg font-bold text-purple-500">{stats.joinDate}</div>
                <div className="text-gray-400">Member Since</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="flex space-x-8">
            {['about', 'vehicles', 'listings', 'bids'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-green-500 text-green-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800 rounded-lg p-6">
          {activeTab === 'about' && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">About</h3>
              {user.bio ? (
                <p className="text-gray-300">{user.bio}</p>
              ) : (
                <p className="text-gray-400 italic">No bio provided.</p>
              )}
            </div>
          )}

          {activeTab === 'vehicles' && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Vehicles</h3>
              <p className="text-gray-400">User's vehicles will appear here...</p>
            </div>
          )}

          {activeTab === 'listings' && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Listings</h3>
              <p className="text-gray-400">User's listings will appear here...</p>
            </div>
          )}

          {activeTab === 'bids' && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Bids</h3>
              <p className="text-gray-400">User's bids will appear here...</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            📧 Send Message
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            📱 Call
          </Button>
        </div>
      </div>
    </div>
  );
}
