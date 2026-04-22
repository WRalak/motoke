'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/ProtectedRoute';
import { db } from '@/lib/database';
import { auth } from '@/lib/auth';

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    vehicleId: ''
  });

  useEffect(() => {
    const user = auth.getUser();
    if (!user) {
      router.push('/auth/login?redirect=/dealer/create-listing');
      return;
    }

    // Load dealer's available vehicles
    const loadVehicles = async () => {
      try {
        const vehiclesData = await db.vehicles.findMany({
          where: { 
            dealerId: user.id,
            status: 'AVAILABLE'
          }
        });
        setVehicles(vehiclesData);
      } catch (error) {
        console.error('Error loading vehicles:', error);
      }
    };

    loadVehicles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.getUser();
      if (!user) {
        router.push('/auth/login?redirect=/dealer/create-listing');
        return;
      }

      // Create listing
      await db.listings.create({
        data: {
          title: formData.title,
          description: formData.description,
          price: parseInt(formData.price),
          status: 'ACTIVE',
          vehicleId: formData.vehicleId,
          sellerId: user.id
        }
      });

      // Update vehicle status to listed
      await db.vehicles.update({
        where: { id: formData.vehicleId },
        data: { status: 'AVAILABLE' }
      });

      console.log('Listing created successfully');
      router.push('/dealer/dashboard');
    } catch (error) {
      console.error('Error creating listing:', error);
    } finally {
      setLoading(false);
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
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-green-500 mb-2">Create New Listing</h1>
            <p className="text-gray-300">Create a new listing for your vehicle</p>
          </div>

          {/* Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Listing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Listing Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                      rows={6}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Price (KES)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                      required
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Select Vehicle</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                      value={formData.vehicleId}
                      onChange={(e) => setFormData(prev => ({ ...prev, vehicleId: e.target.value }))}
                      required
                    >
                      <option value="">Select a vehicle</option>
                      {vehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.year} {vehicle.make} {vehicle.model} - KES {vehicle.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selected Vehicle Preview */}
                  {formData.vehicleId && (
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-2">Selected Vehicle</h3>
                      {vehicles.find(v => v.id === formData.vehicleId) && (
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="text-white font-medium">
                              {vehicles.find(v => v.id === formData.vehicleId)?.year} {vehicles.find(v => v.id === formData.vehicleId)?.make} {vehicles.find(v => v.id === formData.vehicleId)?.model}
                            </h4>
                            <p className="text-gray-400 text-sm">
                              {vehicles.find(v => v.id === formData.vehicleId)?.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-500">
                              KES {vehicles.find(v => v.id === formData.vehicleId)?.price?.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading || !formData.vehicleId}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                >
                  {loading ? 'Creating Listing...' : 'Create Listing'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
