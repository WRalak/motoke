'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/ProtectedRoute';
import { db } from '@/lib/database';
import { auth } from '@/lib/auth';

export default function AddVehiclePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: '',
    vin: '',
    price: '',
    description: '',
    engineSize: '',
    transmission: '',
    fuelType: '',
    driveType: '',
    colour: '',
    county: '',
    ntsaStatus: '',
    images: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.getUser();
      if (!user) {
        router.push('/auth/login?redirect=/dealer/add-vehicle');
        return;
      }

      // Create vehicle
      const vehicle = await db.vehicles.create({
        data: {
          make: formData.make,
          model: formData.model,
          year: formData.year,
          mileage: parseInt(formData.mileage),
          vin: formData.vin,
          price: parseInt(formData.price),
          description: formData.description,
          engineSize: formData.engineSize,
          transmission: formData.transmission,
          fuelType: formData.fuelType,
          driveType: formData.driveType,
          colour: formData.colour,
          county: formData.county,
          ntsaStatus: formData.ntsaStatus,
          images: formData.images,
          dealerId: user.id,
          status: 'AVAILABLE'
        }
      });

      console.log('Vehicle created successfully:', vehicle);
      router.push('/dealer/dashboard');
    } catch (error) {
      console.error('Error creating vehicle:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, images: [...prev.images, ...imageUrls] }));
    }
  };

  const makes = ['Toyota', 'Honda', 'Nissan', 'Mazda', 'Subaru', 'Mitsubishi', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen'];
  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());
  const counties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kisii', 'Homa Bay', 'Kilifi', 
    'Kakamega', 'Machakos', 'Kitui', 'Kwale', 'Uasin Gishu', 'Nyeri', 'Bungoma', 'Trans Nzoia', 'Taita Taveta', 'Lamu', 'Tana River', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Samburu', 'Turkana', 'West Pokot'
  ];

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
            <h1 className="text-3xl font-bold text-green-500 mb-2">Add New Vehicle</h1>
            <p className="text-gray-300">Add a new vehicle to your inventory</p>
          </div>

          {/* Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Make</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                      value={formData.make}
                      onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
                      required
                    >
                      <option value="">Select Make</option>
                      {makes.map(make => (
                        <option key={make} value={make}>{make}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                      value={formData.model}
                      onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      required
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mileage</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                      value={formData.mileage}
                      onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">VIN</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                      value={formData.vin}
                      onChange={(e) => setFormData(prev => ({ ...prev, vin: e.target.value }))}
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

                {/* Right Column - Additional Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Engine Size</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                      value={formData.engineSize}
                      onChange={(e) => setFormData(prev => ({ ...prev, engineSize: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Transmission</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                      value={formData.transmission}
                      onChange={(e) => setFormData(prev => ({ ...prev, transmission: e.target.value }))}
                    >
                      <option value="">Select Transmission</option>
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Fuel Type</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                      value={formData.fuelType}
                      onChange={(e) => setFormData(prev => ({ ...prev, fuelType: e.target.value }))}
                    >
                      <option value="">Select Fuel Type</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Drive Type</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                      value={formData.driveType}
                      onChange={(e) => setFormData(prev => ({ ...prev, driveType: e.target.value }))}
                    >
                      <option value="">Select Drive Type</option>
                      <option value="FWD">Front Wheel Drive</option>
                      <option value="RWD">Rear Wheel Drive</option>
                      <option value="4WD">Four Wheel Drive</option>
                      <option value="AWD">All Wheel Drive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Colour</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                      value={formData.colour}
                      onChange={(e) => setFormData(prev => ({ ...prev, colour: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">County</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                      value={formData.county}
                      onChange={(e) => setFormData(prev => ({ ...prev, county: e.target.value }))}
                    >
                      <option value="">Select County</option>
                      {counties.map(county => (
                        <option key={county} value={county}>{county}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">NTSA Status</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                      value={formData.ntsaStatus}
                      onChange={(e) => setFormData(prev => ({ ...prev, ntsaStatus: e.target.value }))}
                    >
                      <option value="">Select Status</option>
                      <option value="CLEARED">Cleared</option>
                      <option value="PENDING">Pending</option>
                      <option value="SUSPENDED">Suspended</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Images</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                >
                  {loading ? 'Adding Vehicle...' : 'Add Vehicle'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
