'use client';

import { useState, useEffect } from 'react';
import { vehicles } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BrowsePage() {
  const [vehiclesData, setVehiclesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    make: 'all',
    year: 'all',
    priceRange: 'all',
    mileage: 'all',
    status: 'available'
  });
  const [sortBy, setSortBy] = useState('price-low');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await vehicles.getAll({
          search: filters.search,
          make: filters.make,
          status: filters.status,
          minPrice: filters.priceRange !== 'all' ? parseInt(filters.priceRange.split('-')[0]) : undefined,
          maxPrice: filters.priceRange !== 'all' && filters.priceRange.split('-')[1] !== '0' ? parseInt(filters.priceRange.split('-')[1]) : undefined
        });
        setVehiclesData(data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.search, filters.make, filters.status, filters.priceRange]);

  useEffect(() => {
    if (!vehiclesData) return;

    let filtered = vehiclesData.vehicles.filter((vehicle: any) => {
      const matchesSearch = !filters.search || 
        vehicle.make?.toLowerCase().includes(filters.search.toLowerCase()) ||
        vehicle.model?.toLowerCase().includes(filters.search.toLowerCase()) ||
        vehicle.description?.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesMake = filters.make === 'all' || vehicle.make === filters.make;
      const matchesYear = filters.year === 'all' || vehicle.year?.toString() === filters.year;
      const matchesStatus = vehicle.status === filters.status;
      
      let matchesPrice = true;
      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map(Number);
        matchesPrice = vehicle.price >= min && (max === 0 || vehicle.price <= max);
      }
      
      let matchesMileage = true;
      if (filters.mileage !== 'all') {
        const [min, max] = filters.mileage.split('-').map(Number);
        matchesMileage = vehicle.mileage >= min && (max === 0 || vehicle.mileage <= max);
      }
      
      return matchesSearch && matchesMake && matchesYear && matchesStatus && matchesPrice && matchesMileage;
    });

    // Sort vehicles
    filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'year-new':
          return b.year - a.year;
        case 'year-old':
          return a.year - b.year;
        case 'mileage-low':
          return a.mileage - b.mileage;
        case 'mileage-high':
          return a.mileage - b.mileage;
        default:
          return 0;
      }
    });

    setFilteredVehicles(filtered);
  }, [vehiclesData, filters, sortBy]);

  const [filteredVehicles, setFilteredVehicles] = useState<any[]>([]);
  
  const makes = ['all', 'Toyota', 'Honda', 'Nissan', 'Mazda', 'Subaru', 'Mitsubishi', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen'];
  const years = ['all', '2024', '2023', '2022', '2021', '2020', '2019'];
  const priceRanges = [
    { value: 'all', label: 'Any Price' },
    { value: '0-500000', label: 'Under KES 500,' },
    { value: '500000-1000000', label: 'KES 500,000 - 1,000,000' },
    { value: '1000000-2000000', label: 'KES 1,000,000 - 2,000,000' },
    { value: '2000000-5000000', label: 'KES 2,000,000 - 5,000,000' },
    { value: '5000000-0', label: 'Over KES 5,000,000' }
  ];
  const mileageRanges = [
    { value: 'all', label: 'Any Mileage' },
    { value: '0-10000', label: 'Under 10,000 km' },
    { value: '10000-50000', label: '10,000 - 50,000 km' },
    { value: '50000-100000', label: '50,000 - 100,000 km' },
    { value: '100000-0', label: 'Over 100,000 km' }
  ];

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
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
          <h1 className="text-3xl font-bold text-green-500 mb-2">Browse Vehicles</h1>
          <p className="text-gray-300">Find your perfect vehicle from our extensive collection</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-gray-700 text-white"
                    placeholder="Search make, model..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>

                {/* Make */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Make</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-gray-700 text-white"
                    value={filters.make}
                    onChange={(e) => setFilters(prev => ({ ...prev, make: e.target.value }))}
                  >
                    {makes.map(make => (
                      <option key={make} value={make}>
                        {make === 'all' ? 'All Makes' : make}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-gray-700 text-white"
                    value={filters.year}
                    onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                  >
                    {years.map(year => (
                      <option key={year} value={year}>
                        {year === 'all' ? 'All Years' : year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-gray-700 text-white"
                    value={filters.priceRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                  >
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-80">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                    placeholder="Search make, model..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>

                {/* Make */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Make</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                    value={filters.make}
                    onChange={(e) => setFilters(prev => ({ ...prev, make: e.target.value }))}
                  >
                    {makes.map(make => (
                      <option key={make} value={make}>
                        {make === 'all' ? 'All Makes' : make}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                    value={filters.year}
                    onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                  >
                    {years.map(year => (
                      <option key={year} value={year}>
                        {year === 'all' ? 'All Years' : year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.priceRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                  >
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mileage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mileage</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.mileage}
                    onChange={(e) => setFilters(prev => ({ ...prev, mileage: e.target.value }))}
                  >
                    {mileageRanges.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reset Filters */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setFilters({
                    search: '',
                    make: 'all',
                    year: 'all',
                    priceRange: 'all',
                    mileage: 'all',
                    status: 'available'
                  })}
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-gray-600">
                    Showing {filteredVehicles.length} of {vehicles.length} vehicles
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="year-new">Year: Newest First</option>
                    <option value="year-old">Year: Oldest First</option>
                    <option value="mileage-low">Mileage: Low to High</option>
                    <option value="mileage-high">Mileage: High to Low</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex border border-gray-300 rounded-md">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Grid/List */}
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-6xl mb-4">car</div>
                <h3 className="text-lg font-medium text-white mb-2">No vehicles found</h3>
                <p className="text-gray-400">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredVehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
                    {viewMode === 'grid' ? (
                      <>
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
                            <div className="text-xl font-bold text-green-500">
                              {formatCurrency(vehicle.price)}
                            </div>
                          </div>
                          <div className="flex gap-2 mb-4">
                            {vehicle.features && vehicle.features.slice(0, 2).map((feature: any, index: number) => (
                              <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                                {feature}
                              </span>
                            ))}
                          </div>
                          <Button className="w-full bg-green-600 hover:bg-green-700 text-white">View Details</Button>
                        </CardContent>
                      </>
                    ) : (
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <div className="w-48 h-32 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={vehicle.images && vehicle.images[0] ? vehicle.images[0] : '/images/placeholder-car.jpg'}
                              alt={`${vehicle.make} ${vehicle.model}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-white">
                                  {vehicle.year} {vehicle.make} {vehicle.model}
                                </h3>
                                <p className="text-gray-400 text-sm line-clamp-1">{vehicle.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-green-500">
                                  {formatCurrency(vehicle.price)}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 mb-4">
                              {vehicle.features && vehicle.features.slice(0, 4).map((feature: any, index: number) => (
                                <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                                  {feature}
                                </span>
                              ))}
                            </div>
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">View Details</Button>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
