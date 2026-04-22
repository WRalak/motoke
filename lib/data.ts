// Vehicle, dealer, lender, and helper data types and mock data

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  vin: string;
  status: 'available' | 'sold' | 'pending';
  images: string[];
  description: string;
  features: string[];
  dealerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Dealer {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  established: number;
  verified: boolean;
  vehicles: string[];
}

export interface Lender {
  id: string;
  name: string;
  type: 'bank' | 'credit_union' | 'online' | 'dealer';
  minCreditScore: number;
  maxLoanAmount: number;
  interestRates: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
  };
  loanTerms: number[];
  preApprovalAvailable: boolean;
  website: string;
  phone: string;
  description: string;
}

export interface Helper {
  id: string;
  name: string;
  category: 'inspection' | 'insurance' | 'shipping' | 'documentation' | 'financing';
  service: string;
  description: string;
  price: string;
  rating: number;
  availability: 'nationwide' | 'regional' | 'local';
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
  coverage?: string[];
}

// Mock data
export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 25000,
    mileage: 15000,
    vin: '1HGBH41JXMN109186',
    status: 'available',
    images: ['/images/vehicles/camry1.jpg', '/images/vehicles/camry2.jpg'],
    description: 'Well-maintained Toyota Camry with excellent fuel economy and reliability.',
    features: ['Bluetooth', 'Backup Camera', 'Lane Assist', 'Cruise Control'],
    dealerId: '1',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '2',
    make: 'Honda',
    model: 'CR-V',
    year: 2023,
    price: 32000,
    mileage: 8000,
    vin: '2HGBH41JXMN109187',
    status: 'available',
    images: ['/images/vehicles/crv1.jpg', '/images/vehicles/crv2.jpg'],
    description: 'Spacious SUV perfect for families, excellent safety ratings.',
    features: ['AWD', 'Apple CarPlay', 'Android Auto', 'Honda Sensing'],
    dealerId: '1',
    createdAt: new Date('2023-06-20'),
    updatedAt: new Date('2024-01-12')
  }
];

export const mockDealers: Dealer[] = [
  {
    id: '1',
    name: 'Premium Motors',
    address: '123 Main Street',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90210',
    phone: '(555) 123-4567',
    email: 'info@premiummotors.com',
    website: 'https://premiummotors.com',
    rating: 4.5,
    reviewCount: 234,
    specialties: ['Luxury', 'SUV', 'Electric'],
    established: 2010,
    verified: true,
    vehicles: ['1', '2']
  },
  {
    id: '2',
    name: 'Family Auto Center',
    address: '456 Oak Avenue',
    city: 'Burbank',
    state: 'CA',
    zipCode: '91502',
    phone: '(555) 987-6543',
    email: 'sales@familyauto.com',
    rating: 4.2,
    reviewCount: 156,
    specialties: ['Sedan', 'Minivan', 'Used Cars'],
    established: 2005,
    verified: true,
    vehicles: []
  }
];

export const mockLenders: Lender[] = [
  {
    id: '1',
    name: 'National Bank',
    type: 'bank',
    minCreditScore: 620,
    maxLoanAmount: 100000,
    interestRates: {
      excellent: 3.5,
      good: 5.2,
      fair: 7.8,
      poor: 12.5
    },
    loanTerms: [36, 48, 60, 72],
    preApprovalAvailable: true,
    website: 'https://nationalbank.com',
    phone: '(555) 111-2222',
    description: 'Full-service bank with competitive auto loan rates and flexible terms.'
  },
  {
    id: '2',
    name: 'Quick Auto Loans',
    type: 'online',
    minCreditScore: 580,
    maxLoanAmount: 75000,
    interestRates: {
      excellent: 4.2,
      good: 6.5,
      fair: 9.2,
      poor: 15.8
    },
    loanTerms: [24, 36, 48, 60, 72],
    preApprovalAvailable: true,
    website: 'https://quickautoloans.com',
    phone: '(555) 333-4444',
    description: 'Online lender specializing in fast approvals for all credit types.'
  }
];

export const mockHelpers: Helper[] = [
  {
    id: '1',
    name: 'Pro Vehicle Inspections',
    category: 'inspection',
    service: 'Pre-purchase Inspection',
    description: 'Comprehensive 150-point vehicle inspection by certified mechanics.',
    price: '$150-300',
    rating: 4.8,
    availability: 'nationwide',
    contactInfo: {
      phone: '(555) 777-8888',
      website: 'https://proinspections.com'
    }
  },
  {
    id: '2',
    name: 'SecureAuto Insurance',
    category: 'insurance',
    service: 'Auto Insurance Quotes',
    description: 'Compare rates from multiple insurance providers instantly.',
    price: 'Free quotes',
    rating: 4.6,
    availability: 'nationwide',
    contactInfo: {
      phone: '(555) 999-0000',
      website: 'https://secureauto.com'
    }
  }
];
