'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockVehicles, mockDealers } from '@/lib/data';

export default function AdminListings() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    make: 'all',
    dealer: 'all'
  });
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const vehiclesWithDealers = mockVehicles.map(vehicle => ({
        ...vehicle,
        dealer: mockDealers.find(d => d.id === vehicle.dealerId)
      }));
      setVehicles(vehiclesWithDealers);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = vehicles.filter(vehicle => {
      const matchesStatus = filters.status === 'all' || vehicle.status === filters.status;
      const matchesMake = filters.make === 'all' || vehicle.make === filters.make;
      const matchesDealer = filters.dealer === 'all' || vehicle.dealerId === filters.dealer;
      
      return matchesStatus && matchesMake && matchesDealer;
    });

    setFilteredVehicles(filtered);
  }, [vehicles, filters]);

  const handleStatusChange = (vehicleId: string, newStatus: string) => {
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === vehicleId ? { ...vehicle, status: newStatus } : vehicle
    ));
  };

  const handleBulkAction = (action: string) => {
    if (selectedVehicles.length === 0) return;

    switch (action) {
      case 'approve':
        setVehicles(prev => prev.map(vehicle => 
          selectedVehicles.includes(vehicle.id) ? { ...vehicle, status: 'available' } : vehicle
        ));
        break;
      case 'reject':
        setVehicles(prev => prev.map(vehicle => 
          selectedVehicles.includes(vehicle.id) ? { ...vehicle, status: 'rejected' } : vehicle
        ));
        break;
      case 'delete':
        setVehicles(prev => prev.filter(vehicle => !selectedVehicles.includes(vehicle.id)));
        break;
    }
    setSelectedVehicles([]);
  };

  const handleSelectAll = () => {
    if (selectedVehicles.length === filteredVehicles.length) {
      setSelectedVehicles([]);
    } else {
      setSelectedVehicles(filteredVehicles.map(v => v.id));
    }
  };

  const handleSelectVehicle = (vehicleId: string) => {
    setSelectedVehicles(prev => 
      prev.includes(vehicleId) 
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const makes = ['all', ...Array.from(new Set(mockVehicles.map(v => v.make)))];
  const dealers = ['all', ...mockDealers.map((d: any) => ({ value: d.id, label: d.name }))];

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
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Listings</h1>
          <p className="text-gray-600">Manage all vehicle listings on the platform</p>
        </div>
        <Button onClick={() => router.push('/sell')}>
          Add New Vehicle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {vehicles.filter(v => v.status === 'available').length}
              </div>
              <div className="text-sm text-gray-600">Active Listings</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {vehicles.filter(v => v.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Approval</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {vehicles.filter(v => v.status === 'sold').length}
              </div>
              <div className="text-sm text-gray-600">Sold Vehicles</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {vehicles.filter(v => v.status === 'rejected').length}
              </div>
              <div className="text-sm text-gray-600">Rejected Listings</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.make}
                onChange={(e) => setFilters(prev => ({ ...prev, make: e.target.value }))}
              >
                {makes.map(make => (
                  <option key={make} value={make}>
                    {make === 'all' ? 'All Makes' : make}
                  </option>
                ))}
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.dealer}
                onChange={(e) => setFilters(prev => ({ ...prev, dealer: e.target.value }))}
              >
                {dealers.map((dealer: any) => (
                  <option key={dealer.value || dealer} value={dealer.value || dealer}>
                    {dealer === 'all' ? 'All Dealers' : dealer.label}
                  </option>
                ))}
              </select>
            </div>

            {selectedVehicles.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedVehicles.length} selected
                </span>
                <Button size="sm" onClick={() => handleBulkAction('approve')}>
                  Approve
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('reject')}>
                  Reject
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Listings Table */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedVehicles.length === filteredVehicles.length && filteredVehicles.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left p-4">Vehicle</th>
                  <th className="text-left p-4">Dealer</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Mileage</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Listed</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedVehicles.includes(vehicle.id)}
                        onChange={() => handleSelectVehicle(vehicle.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={vehicle.images[0] || '/images/placeholder-car.jpg'}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </div>
                          <div className="text-sm text-gray-500">VIN: {vehicle.vin}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{vehicle.dealer?.name}</div>
                        <div className="text-sm text-gray-500">{vehicle.dealer?.city}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{formatCurrency(vehicle.price)}</div>
                    </td>
                    <td className="p-4">
                      {vehicle.mileage.toLocaleString()} km
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-500">
                        {vehicle.createdAt.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/vehicle/${vehicle.id}`)}
                        >
                          View
                        </Button>
                        {vehicle.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(vehicle.id, 'available')}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusChange(vehicle.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">car</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
