'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Vehicle, Dealer, mockVehicles, mockDealers } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VehicleDetailPageProps {
  params: { id: string };
}

export default function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundVehicle = mockVehicles.find(v => v.id === params.id);
    if (!foundVehicle) {
      notFound();
    }
    
    const foundDealer = mockDealers.find(d => d.id === foundVehicle.dealerId);
    
    setVehicle(foundVehicle);
    setDealer(foundDealer || null);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!vehicle || !dealer) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="aspect-video bg-gray-200 relative">
                <img
                  src={vehicle.images[selectedImage]}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2 p-4">
                {vehicle.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${vehicle.make} ${vehicle.model} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </CardTitle>
                <div className="text-3xl font-bold text-blue-600">
                  KES {vehicle.price.toLocaleString()}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{vehicle.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {vehicle.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Vehicle Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500">Year:</span>
                      <span className="ml-2 font-medium">{vehicle.year}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Mileage:</span>
                      <span className="ml-2 font-medium">{vehicle.mileage.toLocaleString()} km</span>
                    </div>
                    <div>
                      <span className="text-gray-500">VIN:</span>
                      <span className="ml-2 font-medium">{vehicle.vin}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                        vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'sold' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vehicle.status}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact/Action Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Dealer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    KES {vehicle.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    {vehicle.status === 'available' ? 'Available for purchase' : 'Not available'}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button className="w-full" size="lg" disabled={vehicle.status !== 'available'}>
                    Make Offer
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    Schedule Test Drive
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    Contact Dealer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Dealer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Dealer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">{dealer.name}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{dealer.address}</p>
                    <p>{dealer.city}, {dealer.state} {dealer.zipCode}</p>
                    <p>{dealer.phone}</p>
                    <p>{dealer.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(dealer.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {dealer.rating} ({dealer.reviewCount} reviews)
                  </span>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Established:</span>
                  <span className="ml-2 text-sm font-medium">{dealer.established}</span>
                </div>

                {dealer.verified && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Verified Dealer</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financing Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>Financing Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Down Payment</label>
                    <input
                      type="number"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter down payment"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Loan Term (months)</label>
                    <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md">
                      <option>12</option>
                      <option>24</option>
                      <option>36</option>
                      <option>48</option>
                      <option>60</option>
                    </select>
                  </div>
                  <Button variant="outline" className="w-full">
                    Calculate Monthly Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
