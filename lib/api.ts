const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Auth API
export const auth = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    const data = await response.json();
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  register: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    
    return response.json();
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }
};

// Vehicles API
export const vehicles = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    make?: string;
    status?: string;
    county?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
  }) => {
    // Mock implementation for now
    const mockVehicles = [
      {
        id: '1',
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        mileage: 15000,
        vin: '1HGBH41JXMN109186',
        price: 2500000,
        status: 'AVAILABLE',
        images: ['/images/vehicles/camry1.jpg', '/images/vehicles/camry2.jpg'],
        description: 'Well-maintained Toyota Camry with excellent fuel economy and reliability.',
        features: ['Bluetooth', 'Backup Camera', 'Lane Assist', 'Cruise Control'],
        engineSize: '2.5L',
        transmission: 'Automatic',
        fuelType: 'Petrol',
        driveType: 'FWD',
        colour: 'Silver',
        county: 'Nairobi',
        ntsaStatus: 'CLEARED',
        dealerId: 'dealer1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '2',
        make: 'Honda',
        model: 'CR-V',
        year: 2023,
        mileage: 8000,
        vin: '2HGBH41JXMN109187',
        price: 3200000,
        status: 'AVAILABLE',
        images: ['/images/vehicles/crv1.jpg', '/images/vehicles/crv2.jpg'],
        description: 'Spacious SUV perfect for families, excellent safety ratings.',
        features: ['AWD', 'Apple CarPlay', 'Android Auto', 'Honda Sensing'],
        engineSize: '1.5L Turbo',
        transmission: 'CVT',
        fuelType: 'Petrol',
        driveType: 'AWD',
        colour: 'Blue',
        county: 'Nairobi',
        ntsaStatus: 'CLEARED',
        dealerId: 'dealer1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ];

    // Apply filters
    let filteredVehicles = mockVehicles.filter(vehicle => {
      const matchesSearch = !params?.search || 
        vehicle.make.toLowerCase().includes(params.search.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(params.search.toLowerCase()) ||
        vehicle.description.toLowerCase().includes(params.search.toLowerCase());
      
      const matchesMake = !params?.make || vehicle.make === params.make;
      const matchesStatus = !params?.status || vehicle.status === params.status;
      const matchesCounty = !params?.county || vehicle.county === params.county;
      
      let matchesPrice = true;
      if (params?.minPrice !== undefined || params?.maxPrice !== undefined) {
        matchesPrice = vehicle.price >= (params?.minPrice || 0) && (params?.maxPrice === undefined || vehicle.price <= params?.maxPrice);
      }
      
      return matchesSearch && matchesMake && matchesStatus && matchesCounty && matchesPrice;
    });

    // Sort vehicles
    if (params?.sortBy === 'price-low') {
      filteredVehicles.sort((a, b) => a.price - b.price);
    } else if (params?.sortBy === 'price-high') {
      filteredVehicles.sort((a, b) => b.price - a.price);
    } else if (params?.sortBy === 'year-new') {
      filteredVehicles.sort((a, b) => b.year - a.year);
    }

    return {
      vehicles: filteredVehicles,
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: filteredVehicles.length,
        pages: Math.ceil(filteredVehicles.length / (params?.limit || 20))
      }
    };
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/vehicles/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch vehicle');
    }
    
    return response.json();
  },

  create: async (vehicleData: any) => {
    const token = auth.getToken();
    const response = await fetch(`${API_BASE_URL}/api/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(vehicleData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create vehicle');
    }
    
    return response.json();
  },

  update: async (id: string, vehicleData: any) => {
    const token = auth.getToken();
    const response = await fetch(`${API_BASE_URL}/api/vehicles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(vehicleData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update vehicle');
    }
    
    return response.json();
  },

  approve: async (id: string, status: 'available' | 'rejected') => {
    const token = auth.getToken();
    const response = await fetch(`${API_BASE_URL}/api/vehicles/${id}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to approve vehicle');
    }
    
    return response.json();
  },

  delete: async (id: string) => {
    const token = auth.getToken();
    const response = await fetch(`${API_BASE_URL}/api/vehicles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete vehicle');
    }
    
    return response.json();
  }
};

// Auctions API
export const auctions = {
  getAll: async (params?: {
    status?: string;
    type?: string;
  }) => {
    // Mock implementation for now
    const mockAuctions = [
      {
        id: 'auction1',
        title: 'Spring Luxury Vehicle Auction',
        description: 'Premium luxury and exotic vehicles from private collections and dealer trade-ins.',
        type: 'ONLINE',
        status: 'ACTIVE',
        startDate: new Date('2024-04-15T10:00:00Z'),
        endDate: new Date('2024-04-15T18:00:00Z'),
        location: 'Los Angeles Convention Center, Hall A',
        organizer: 'Premier Auction House',
        fees: { buyerPremium: 10, registrationFee: 200, otherFees: ['Online bidding fee: $50', 'Wire transfer fee: $25'] },
        requirements: { deposit: 1000, maxBidders: 500, preApproval: true },
        images: ['/images/auctions/luxury-1.jpg', '/images/auctions/luxury-2.jpg'],
        auctionVehicles: [
          {
            id: 'av1',
            vehicleId: '1',
            startingBid: 2000000,
            currentBid: 2350000,
            reservePrice: 2500000,
            bidCount: 7,
            status: 'bidding',
            highlights: ['Low mileage', 'One owner', 'Service records', 'Excellent condition'],
            conditionReport: {
              overall: 'excellent',
              exterior: 'Minor scratches on rear bumper, otherwise excellent paint and finish',
              interior: 'Like new, no wear on seats or controls',
              mechanical: 'Perfect running condition, recent service completed',
              tires: '90% tread life remaining',
              documentation: 'Clean title, complete service history available'
            },
            images: ['/images/vehicles/auction-camry-1.jpg', '/images/vehicles/auction-camry-2.jpg']
          }
        ],
        bids: [
          {
            id: 'bid1',
            amount: 2350000,
            type: 'MANUAL',
            status: 'WINNING',
            bidderId: 'customer1',
            createdAt: new Date('2024-04-15T11:30:00Z')
          }
        ]
      },
      {
        id: 'auction2',
        title: 'Summer Sports Car Auction',
        description: 'Great deals on sports cars and convertibles from private sellers.',
        type: 'ONLINE',
        status: 'UPCOMING',
        startDate: new Date('2024-05-01T10:00:00Z'),
        endDate: new Date('2024-05-01T18:00:00Z'),
        location: 'Nairobi Exhibition Center',
        organizer: 'Auto Kenya Auctions',
        fees: { buyerPremium: 8, registrationFee: 150, otherFees: ['Catalog fee: $30', 'Processing fee: $15'] },
        requirements: { deposit: 500, maxBidders: 300, preApproval: false },
        images: ['/images/auctions/sports-1.jpg', '/images/auctions/sports-2.jpg'],
        auctionVehicles: [
          {
            id: 'av2',
            vehicleId: '2',
            startingBid: 1500000,
            currentBid: 1500000,
            reservePrice: 1800000,
            bidCount: 3,
            status: 'pending',
            highlights: ['Low mileage', 'Well maintained', 'Service records available'],
            conditionReport: {
              overall: 'good',
              exterior: 'Minor wear and tear',
              interior: 'Clean and well-maintained',
              mechanical: 'Runs well, no issues detected',
              tires: '70% tread life remaining',
              documentation: 'Service records available'
            },
            images: ['/images/vehicles/sports-1.jpg', '/images/vehicles/sports-2.jpg']
          }
        ],
        bids: []
      }
    ];

    // Apply filters
    let filteredAuctions = mockAuctions.filter(auction => {
      const matchesStatus = !params?.status || auction.status === params.status;
      const matchesType = !params?.type || auction.type === params.type;
      return matchesStatus && matchesType;
    });

    return filteredAuctions;
  },

  create: async (auctionData: any) => {
    const token = auth.getToken();
    const response = await fetch(`${API_BASE_URL}/api/auctions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(auctionData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create auction');
    }
    
    return response.json();
  },

  placeBid: async (auctionVehicleId: string, bidData: any) => {
    const token = auth.getToken();
    const response = await fetch(`${API_BASE_URL}/api/auctions/${auctionVehicleId}/bid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bidData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to place bid');
    }
    
    return response.json();
  }
};

// M-Pesa API
export const mpesa = {
  stkPush: async (paymentData: {
    phoneNumber: string;
    amount: number;
    accountReference: string;
    transactionDesc?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/mpesa/stk-push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to initiate payment');
    }
    
    return response.json();
  }
};

// Admin API
export const admin = {
  getStats: async (period?: string) => {
    const token = auth.getToken();
    const searchParams = period ? `?period=${period}` : '';
    
    const response = await fetch(`${API_BASE_URL}/api/admin/stats${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch admin stats');
    }
    
    return response.json();
  }
};

// Helper function for authenticated requests
export const authenticatedFetch = async (url: string, options?: RequestInit) => {
  const token = auth.getToken();
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options?.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  
  if (response.status === 401) {
    // Token expired or invalid
    auth.logout();
    window.location.href = '/auth/login';
    throw new Error('Authentication required');
  }
  
  return response;
};
