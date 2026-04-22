'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Dealer, mockDealers, mockVehicles } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProtectedRoute from '@/components/ProtectedRoute';

interface DealerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function DealerDetailPage({ params }: DealerDetailPageProps) {
  const router = useRouter();
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [dealerVehicles, setDealerVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inventory' | 'about' | 'reviews'>('inventory');

  const handleViewVehicle = (vehicleId: string) => {
    router.push(`/vehicle/${vehicleId}`);
  };

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      const foundDealer = mockDealers.find(d => d.id === resolvedParams.id);
      if (!foundDealer) {
        notFound();
      }
      
      setDealer(foundDealer);
      
      // Get vehicles for this dealer
      const vehicles = mockVehicles.filter(v => v.dealerId === foundDealer.id);
      setDealerVehicles(vehicles);
      setLoading(false);
    };

    unwrapParams();
  }, [params]);

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
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!dealer) {
    notFound();
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Dealer Info */}
              <div className="flex-1">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                          <span className="text-2xl font-bold text-green-500">
                            {dealer.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold text-white">{dealer.name}</h1>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center">
                              {renderStars(dealer.rating)}
                            </div>
                            <span className="text-sm text-gray-400">
                              ({dealer.reviewCount} reviews)
                            </span>
                          </div>
                          {dealer.verified && (
                            <div className="flex items-center space-x-1 text-green-400">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm font-medium">Verified Dealer</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-sm font-medium text-gray-300 mb-2">Contact Information</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2 text-gray-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>{dealer.address}, {dealer.city}, {dealer.state} {dealer.zipCode}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span>{dealer.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span>{dealer.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-sm font-medium text-gray-300 mb-2">Business Hours</h3>
                          <div className="text-sm text-gray-400">
                            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                            <p>Saturday: 9:00 AM - 4:00 PM</p>
                            <p>Sunday: Closed</p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-300 mb-2">Established</h3>
                          <p className="text-sm text-gray-400">{dealer.established}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700">
                      <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call Dealer
                      </Button>
                      <Button variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email Dealer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Stats */}
              <div className="lg:w-80">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-green-500">{dealerVehicles.length}</div>
                      <div className="text-sm text-gray-400">Total Vehicles</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-blue-500">{dealer.rating}</div>
                      <div className="text-sm text-gray-400">Average Rating</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-yellow-500">{dealer.reviewCount}</div>
                      <div className="text-sm text-gray-400">Customer Reviews</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {['inventory', 'about', 'reviews'].map((tab) => (
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
                <h2 className="text-xl font-bold text-white mb-6">Dealer Inventory</h2>
                {dealerVehicles.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-6xl mb-4">car</div>
                    <h3 className="text-lg font-medium text-white mb-2">No vehicles available</h3>
                    <p className="text-gray-400">This dealer currently has no vehicles listed</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dealerVehicles.map((vehicle) => (
                      <Card 
                        key={vehicle.id} 
                        className="overflow-hidden hover:shadow-lg transition-shadow bg-gray-800 border-gray-700 cursor-pointer"
                        onClick={() => handleViewVehicle(vehicle.id)}
                      >
                        <div className="aspect-video bg-gray-700">
                          <img
                            src={vehicle.images && vehicle.images[0] ? vehicle.images[0] : '/images/placeholder-car.jpg'}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
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
                          <Button 
                            className="w-full" 
                            variant="outline"
                            onClick={() => handleViewVehicle(vehicle.id)}
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            )}

            {activeTab === 'about' && (
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">About {dealer.name}</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed">
                    {dealer.name} is a trusted automotive dealership serving the {dealer.city} area. 
                    We specialize in {dealer.specialties.join(', ')} and are committed to providing 
                    exceptional customer service and quality vehicles. Our team of experienced professionals 
                    is here to help you find the perfect vehicle to meet your needs and budget.
                  </p>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Our Specialties</h3>
                      <ul className="space-y-2">
                        {dealer.specialties.map((specialty, index) => (
                          <li key={index} className="flex items-center text-gray-300">
                            <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {specialty}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Why Choose Us</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start text-gray-300">
                          <span className="text-green-500 mr-2">✓</span>
                          Verified and licensed dealership
                        </li>
                        <li className="flex items-start text-gray-300">
                          <span className="text-green-500 mr-2">✓</span>
                          Quality inspected vehicles
                        </li>
                        <li className="flex items-start text-gray-300">
                          <span className="text-green-500 mr-2">✓</span>
                          Competitive financing options
                        </li>
                        <li className="flex items-start text-gray-300">
                          <span className="text-green-500 mr-2">✓</span>
                          Excellent customer service
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}

            {activeTab === 'reviews' && (
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Customer Reviews</h2>
                <div className="space-y-4">
                  {/* Mock reviews */}
                  {[
                    { name: 'John M.', rating: 5, date: '2024-01-15', comment: 'Excellent service! Found the perfect car for my family.' },
                    { name: 'Sarah K.', rating: 4, date: '2024-01-10', comment: 'Great selection of vehicles and fair prices.' },
                    { name: 'Michael T.', rating: 5, date: '2024-01-05', comment: 'Professional staff and smooth buying process.' }
                  ].map((review, index) => (
                    <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-white">{review.name}</span>
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <span className="text-sm text-gray-400">{review.date}</span>
                      </div>
                      <p className="text-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
