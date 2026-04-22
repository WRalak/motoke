// Sales, customers, and revenue data for admin dashboard

export interface Sale {
  id: string;
  vehicleId: string;
  dealerId: string;
  customerId: string;
  saleDate: Date;
  salePrice: number;
  saleType: 'retail' | 'auction' | 'wholesale' | 'fleet';
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod: 'cash' | 'financing' | 'lease' | 'trade';
  salespersonId: string;
  commission: number;
  profit: number;
  taxes: number;
  fees: {
    documentation: number;
    registration: number;
    other?: number;
  };
  notes?: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateOfBirth: Date;
  creditScore: number;
  income: number;
  employmentStatus: 'employed' | 'self-employed' | 'unemployed' | 'retired';
  employer?: string;
  customerType: 'individual' | 'business' | 'fleet';
  status: 'active' | 'inactive' | 'blacklisted';
  registrationDate: Date;
  lastActivity: Date;
  purchaseHistory: string[]; // Sale IDs
  preferences: {
    vehicleTypes: string[];
    priceRange: {
      min: number;
      max: number;
    };
    financing: boolean;
    insurance: boolean;
  };
  documents: {
    licenseVerified: boolean;
    insuranceVerified: boolean;
    financingApproved: boolean;
  };
}

export interface Revenue {
  period: string; // e.g., '2024-01', 'Q1-2024', '2024'
  totalRevenue: number;
  vehicleSales: number;
  serviceRevenue: number;
  financingRevenue: number;
  otherRevenue: number;
  costs: {
    inventory: number;
    operations: number;
    marketing: number;
    commissions: number;
    other: number;
  };
  profit: number;
  profitMargin: number;
  unitsSold: number;
  averageSalePrice: number;
  breakdown: {
    bySaleType: Record<string, number>;
    byVehicleType: Record<string, number>;
    bySalesperson: Record<string, number>;
    byRegion: Record<string, number>;
  };
}

export interface Salesperson {
  id: string;
  name: string;
  email: string;
  phone: string;
  hireDate: Date;
  status: 'active' | 'inactive' | 'terminated';
  commissionRate: number;
  monthlyTarget: number;
  ytdSales: number;
  ytdCommission: number;
  specialties: string[];
  performance: {
    salesThisMonth: number;
    salesLastMonth: number;
    averageDealSize: number;
    customerSatisfaction: number;
    unitsSold: number;
  };
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'website' | 'phone' | 'walk_in' | 'referral' | 'social_media' | 'email';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed_lost';
  priority: 'high' | 'medium' | 'low';
  vehicleInterest: string[];
  budget: number;
  timeline: 'immediate' | '1_week' | '1_month' | '3_months' | 'just_browsing';
  assignedTo: string; // Salesperson ID
  createdDate: Date;
  lastContactDate: Date;
  notes: string[];
  followUpDate?: Date;
}

// Mock data
export const mockSales: Sale[] = [
  {
    id: '1',
    vehicleId: '1',
    dealerId: '1',
    customerId: '1',
    saleDate: new Date('2024-01-15'),
    salePrice: 25000,
    saleType: 'retail',
    status: 'completed',
    paymentMethod: 'financing',
    salespersonId: '1',
    commission: 750,
    profit: 3200,
    taxes: 2000,
    fees: {
      documentation: 300,
      registration: 250
    },
    notes: 'Customer very satisfied, referred friend'
  },
  {
    id: '2',
    vehicleId: '2',
    dealerId: '1',
    customerId: '2',
    saleDate: new Date('2024-01-20'),
    salePrice: 32000,
    saleType: 'retail',
    status: 'completed',
    paymentMethod: 'financing',
    salespersonId: '2',
    commission: 960,
    profit: 4500,
    taxes: 2560,
    fees: {
      documentation: 300,
      registration: 250,
      other: 150
    }
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    address: '123 Oak Street',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    dateOfBirth: new Date('1985-06-15'),
    creditScore: 750,
    income: 85000,
    employmentStatus: 'employed',
    employer: 'Tech Corp',
    customerType: 'individual',
    status: 'active',
    registrationDate: new Date('2024-01-10'),
    lastActivity: new Date('2024-01-15'),
    purchaseHistory: ['1'],
    preferences: {
      vehicleTypes: ['Sedan', 'SUV'],
      priceRange: { min: 20000, max: 40000 },
      financing: true,
      insurance: true
    },
    documents: {
      licenseVerified: true,
      insuranceVerified: true,
      financingApproved: true
    }
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 987-6543',
    address: '456 Maple Avenue',
    city: 'Burbank',
    state: 'CA',
    zipCode: '91502',
    dateOfBirth: new Date('1990-03-22'),
    creditScore: 680,
    income: 65000,
    employmentStatus: 'employed',
    employer: 'Marketing Agency',
    customerType: 'individual',
    status: 'active',
    registrationDate: new Date('2024-01-05'),
    lastActivity: new Date('2024-01-20'),
    purchaseHistory: ['2'],
    preferences: {
      vehicleTypes: ['SUV', 'Crossover'],
      priceRange: { min: 25000, max: 50000 },
      financing: true,
      insurance: false
    },
    documents: {
      licenseVerified: true,
      insuranceVerified: false,
      financingApproved: true
    }
  }
];

export const mockRevenue: Revenue[] = [
  {
    period: '2024-01',
    totalRevenue: 285000,
    vehicleSales: 250000,
    serviceRevenue: 20000,
    financingRevenue: 10000,
    otherRevenue: 5000,
    costs: {
      inventory: 180000,
      operations: 25000,
      marketing: 15000,
      commissions: 8500,
      other: 2000
    },
    profit: 53500,
    profitMargin: 18.8,
    unitsSold: 12,
    averageSalePrice: 23750,
    breakdown: {
      bySaleType: {
        retail: 200000,
        auction: 30000,
        wholesale: 15000,
        fleet: 5000
      },
      byVehicleType: {
        sedan: 80000,
        suv: 120000,
        truck: 35000,
        luxury: 15000
      },
      bySalesperson: {
        '1': 120000,
        '2': 95000,
        '3': 70000
      },
      byRegion: {
        'Los Angeles': 150000,
        'Burbank': 80000,
        'Santa Monica': 55000
      }
    }
  },
  {
    period: '2023-12',
    totalRevenue: 320000,
    vehicleSales: 280000,
    serviceRevenue: 25000,
    financingRevenue: 12000,
    otherRevenue: 3000,
    costs: {
      inventory: 200000,
      operations: 28000,
      marketing: 18000,
      commissions: 9600,
      other: 2400
    },
    profit: 61800,
    profitMargin: 19.3,
    unitsSold: 15,
    averageSalePrice: 26667,
    breakdown: {
      bySaleType: {
        retail: 240000,
        auction: 25000,
        wholesale: 10000,
        fleet: 5000
      },
      byVehicleType: {
        sedan: 90000,
        suv: 140000,
        truck: 40000,
        luxury: 10000
      },
      bySalesperson: {
        '1': 130000,
        '2': 110000,
        '3': 80000
      },
      byRegion: {
        'Los Angeles': 170000,
        'Burbank': 90000,
        'Santa Monica': 60000
      }
    }
  }
];

export const mockSalespeople: Salesperson[] = [
  {
    id: '1',
    name: 'Michael Davis',
    email: 'michael.d@dealership.com',
    phone: '(555) 111-2222',
    hireDate: new Date('2022-03-15'),
    status: 'active',
    commissionRate: 3,
    monthlyTarget: 150000,
    ytdSales: 120000,
    ytdCommission: 3600,
    specialties: ['Luxury', 'SUV', 'Financing'],
    performance: {
      salesThisMonth: 120000,
      salesLastMonth: 95000,
      averageDealSize: 30000,
      customerSatisfaction: 4.8,
      unitsSold: 4
    }
  },
  {
    id: '2',
    name: 'Jennifer Wilson',
    email: 'jennifer.w@dealership.com',
    phone: '(555) 333-4444',
    hireDate: new Date('2021-08-20'),
    status: 'active',
    commissionRate: 2.5,
    monthlyTarget: 120000,
    ytdSales: 95000,
    ytdCommission: 2375,
    specialties: ['Sedan', 'First-time buyers'],
    performance: {
      salesThisMonth: 95000,
      salesLastMonth: 88000,
      averageDealSize: 23750,
      customerSatisfaction: 4.9,
      unitsSold: 4
    }
  }
];

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Robert Brown',
    email: 'robert.b@email.com',
    phone: '(555) 666-7777',
    source: 'website',
    status: 'qualified',
    priority: 'high',
    vehicleInterest: ['Toyota Camry', 'Honda Accord'],
    budget: 30000,
    timeline: '1_month',
    assignedTo: '1',
    createdDate: new Date('2024-01-18'),
    lastContactDate: new Date('2024-01-20'),
    notes: ['Interested in financing options', 'Has trade-in vehicle'],
    followUpDate: new Date('2024-01-25')
  },
  {
    id: '2',
    name: 'Emily Davis',
    email: 'emily.d@email.com',
    phone: '(555) 888-9999',
    source: 'phone',
    status: 'contacted',
    priority: 'medium',
    vehicleInterest: ['SUV', 'AWD'],
    budget: 40000,
    timeline: '3_months',
    assignedTo: '2',
    createdDate: new Date('2024-01-19'),
    lastContactDate: new Date('2024-01-19'),
    notes: ['Looking for family vehicle', 'Needs good safety ratings'],
    followUpDate: new Date('2024-01-26')
  }
];

// Helper functions
export const getMonthlyRevenue = (year: number, month: number) => {
  const period = `${year}-${month.toString().padStart(2, '0')}`;
  return mockRevenue.find(r => r.period === period);
};

export const getSalesBySalesperson = (salespersonId: string) => {
  return mockSales.filter(sale => sale.salespersonId === salespersonId);
};

export const getCustomerSales = (customerId: string) => {
  return mockSales.filter(sale => sale.customerId === customerId);
};

export const getActiveLeads = () => {
  return mockLeads.filter(lead => 
    lead.status !== 'converted' && lead.status !== 'closed_lost'
  );
};

export const calculateCommission = (salePrice: number, rate: number) => {
  return salePrice * (rate / 100);
};

export const getSalesMetrics = () => {
  const currentMonth = mockRevenue[0]; // 2024-01
  const previousMonth = mockRevenue[1]; // 2023-12
  
  return {
    revenueGrowth: ((currentMonth.totalRevenue - previousMonth.totalRevenue) / previousMonth.totalRevenue) * 100,
    profitGrowth: ((currentMonth.profit - previousMonth.profit) / previousMonth.profit) * 100,
    unitsSoldGrowth: ((currentMonth.unitsSold - previousMonth.unitsSold) / previousMonth.unitsSold) * 100,
    averageDealGrowth: ((currentMonth.averageSalePrice - previousMonth.averageSalePrice) / previousMonth.averageSalePrice) * 100
  };
};
