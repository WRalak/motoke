// Auction types and mock data

export interface Auction {
  id: string;
  title: string;
  description: string;
  type: 'live' | 'online' | 'sealed_bid';
  status: 'upcoming' | 'active' | 'ended' | 'cancelled';
  startDate: Date;
  endDate: Date;
  location?: string;
  onlineUrl?: string;
  vehicles: AuctionVehicle[];
  organizer: string;
  fees: {
    buyerPremium: number;
    registrationFee: number;
    otherFees?: string[];
  };
  requirements: {
    deposit: number;
    maxBidders?: number;
    preApproval?: boolean;
  };
  images: string[];
}

export interface AuctionVehicle {
  id: string;
  vehicleId: string;
  auctionId: string;
  startingBid: number;
  currentBid?: number;
  reservePrice?: number;
  bidCount: number;
  status: 'pending' | 'bidding' | 'sold' | 'unsold';
  bids: Bid[];
  highlights: string[];
  conditionReport: ConditionReport;
  images: string[];
}

export interface Bid {
  id: string;
  vehicleId: string;
  bidderId: string;
  amount: number;
  timestamp: Date;
  type: 'manual' | 'auto' | 'proxy';
  status: 'active' | 'outbid' | 'winning';
}

export interface ConditionReport {
  overall: 'excellent' | 'good' | 'fair' | 'poor';
  exterior: string;
  interior: string;
  mechanical: string;
  tires: string;
  documentation: string;
  additionalNotes?: string;
}

export interface Bidder {
  id: string;
  name: string;
  email: string;
  phone: string;
  creditScore?: number;
  depositPaid: boolean;
  registrationDate: Date;
  status: 'verified' | 'pending' | 'suspended';
}

export interface ProxyBidConfig {
  bidderId: string;
  vehicleId: string;
  maximumAmount: number;
  incrementAmount: number;
  isActive: boolean;
  autoRenew: boolean;
}

export interface ProxyMiddleware {
  processBid: (newBid: Bid, currentBids: Bid[], proxyConfigs: ProxyBidConfig[]) => {
    updatedBids: Bid[];
    proxyActions: ProxyAction[];
    winningBid: Bid | null;
  };
  validateProxyConfig: (config: ProxyBidConfig, currentBid: number) => boolean;
  calculateNextBid: (currentBid: number, incrementAmount: number, maximumAmount: number) => number | null;
}

export interface ProxyAction {
  type: 'auto_bid_placed' | 'outbid_notification' | 'max_reached' | 'proxy_deactivated';
  bidderId: string;
  amount: number;
  timestamp: Date;
  message: string;
}

// Mock data
export const mockAuctions: Auction[] = [
  {
    id: '1',
    title: 'Spring Luxury Vehicle Auction',
    description: 'Premium luxury and exotic vehicles from private collections and dealer trade-ins.',
    type: 'live',
    status: 'upcoming',
    startDate: new Date('2024-04-15T10:00:00Z'),
    endDate: new Date('2024-04-15T18:00:00Z'),
    location: 'Los Angeles Convention Center, Hall A',
    vehicles: [],
    organizer: 'Premier Auction House',
    fees: {
      buyerPremium: 10,
      registrationFee: 200,
      otherFees: ['Online bidding fee: $50', 'Wire transfer fee: $25']
    },
    requirements: {
      deposit: 1000,
      maxBidders: 500,
      preApproval: true
    },
    images: ['/images/auctions/luxury-1.jpg', '/images/auctions/luxury-2.jpg']
  },
  {
    id: '2',
    title: 'Weekly Online Auto Auction',
    description: 'Regular weekly auction featuring quality used vehicles at competitive prices.',
    type: 'online',
    status: 'active',
    startDate: new Date('2024-01-10T09:00:00Z'),
    endDate: new Date('2024-01-12T21:00:00Z'),
    onlineUrl: 'https://auctions.motoke.com/weekly-123',
    vehicles: [],
    organizer: 'Motoke Auctions',
    fees: {
      buyerPremium: 8,
      registrationFee: 100
    },
    requirements: {
      deposit: 500,
      preApproval: false
    },
    images: ['/images/auctions/online-1.jpg']
  }
];

export const mockAuctionVehicles: AuctionVehicle[] = [
  {
    id: '1',
    vehicleId: '1',
    auctionId: '1',
    startingBid: 20000,
    currentBid: 23500,
    reservePrice: 25000,
    bidCount: 7,
    status: 'bidding',
    bids: [
      {
        id: '1',
        vehicleId: '1',
        bidderId: '1',
        amount: 20000,
        timestamp: new Date('2024-01-10T10:15:00Z'),
        type: 'manual',
        status: 'outbid'
      },
      {
        id: '2',
        vehicleId: '1',
        bidderId: '2',
        amount: 23500,
        timestamp: new Date('2024-01-10T11:30:00Z'),
        type: 'manual',
        status: 'winning'
      }
    ],
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
  },
  {
    id: '2',
    vehicleId: '2',
    auctionId: '2',
    startingBid: 28000,
    currentBid: 28000,
    reservePrice: 30000,
    bidCount: 1,
    status: 'bidding',
    bids: [
      {
        id: '3',
        vehicleId: '2',
        bidderId: '3',
        amount: 28000,
        timestamp: new Date('2024-01-10T12:00:00Z'),
        type: 'manual',
        status: 'winning'
      }
    ],
    highlights: ['AWD', 'Recent service', 'Clean CarFax', 'Premium package'],
    conditionReport: {
      overall: 'good',
      exterior: 'Minor door dings, good paint condition',
      interior: 'Normal wear for age, clean overall',
      mechanical: 'Runs well, recent oil change and inspection',
      tires: '70% tread life',
      documentation: 'Clean title, available service records'
    },
    images: ['/images/vehicles/auction-crv-1.jpg', '/images/vehicles/auction-crv-2.jpg']
  }
];

export const mockBidders: Bidder[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    creditScore: 750,
    depositPaid: true,
    registrationDate: new Date('2024-01-05'),
    status: 'verified'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 987-6543',
    creditScore: 680,
    depositPaid: true,
    registrationDate: new Date('2024-01-08'),
    status: 'verified'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.w@email.com',
    phone: '(555) 555-1212',
    depositPaid: true,
    registrationDate: new Date('2024-01-09'),
    status: 'verified'
  }
];

// Proxy bidding middleware implementation
export const proxyMiddleware: ProxyMiddleware = {
  processBid: (newBid: Bid, currentBids: Bid[], proxyConfigs: ProxyBidConfig[]) => {
    const updatedBids = [...currentBids, newBid];
    const proxyActions: ProxyAction[] = [];
    let winningBid = newBid;
    
    // Get active proxy configs for this vehicle (excluding the new bidder)
    const activeProxies = proxyConfigs.filter(
      config => config.vehicleId === newBid.vehicleId && 
                config.bidderId !== newBid.bidderId && 
                config.isActive
    );
    
    // Sort by maximum amount (highest first)
    activeProxies.sort((a, b) => b.maximumAmount - a.maximumAmount);
    
    let currentHighestBid = newBid.amount;
    
    for (const proxyConfig of activeProxies) {
      if (currentHighestBid >= proxyConfig.maximumAmount) {
        // Proxy bidder has been outbid beyond their max
        proxyActions.push({
          type: 'outbid_notification',
          bidderId: proxyConfig.bidderId,
          amount: currentHighestBid,
          timestamp: new Date(),
          message: `You have been outbid. Current highest bid: $${currentHighestBid}`
        });
        continue;
      }
      
      // Calculate next proxy bid
      const nextBid = proxyMiddleware.calculateNextBid(
        currentHighestBid,
        proxyConfig.incrementAmount,
        proxyConfig.maximumAmount
      );
      
      if (nextBid && nextBid > currentHighestBid) {
        // Place proxy bid
        const proxyBid: Bid = {
          id: `proxy-${Date.now()}-${proxyConfig.bidderId}`,
          vehicleId: proxyConfig.vehicleId,
          bidderId: proxyConfig.bidderId,
          amount: nextBid,
          timestamp: new Date(),
          type: 'proxy',
          status: 'winning'
        };
        
        updatedBids.push(proxyBid);
        currentHighestBid = nextBid;
        winningBid = proxyBid;
        
        // Update previous winning bid status
        const previousWinner = updatedBids.find(b => b.status === 'winning' && b.id !== proxyBid.id);
        if (previousWinner) {
          previousWinner.status = 'outbid';
        }
        
        proxyActions.push({
          type: 'auto_bid_placed',
          bidderId: proxyConfig.bidderId,
          amount: nextBid,
          timestamp: new Date(),
          message: `Automatic bid placed: $${nextBid}`
        });
        
        // Check if this is the proxy's maximum
        if (nextBid >= proxyConfig.maximumAmount) {
          proxyActions.push({
            type: 'max_reached',
            bidderId: proxyConfig.bidderId,
            amount: nextBid,
            timestamp: new Date(),
            message: `Maximum bid of $${proxyConfig.maximumAmount} reached`
          });
        }
      }
    }
    
    return {
      updatedBids,
      proxyActions,
      winningBid
    };
  },
  
  validateProxyConfig: (config: ProxyBidConfig, currentBid: number) => {
    return config.maximumAmount > currentBid && 
           config.incrementAmount > 0 && 
           config.maximumAmount > config.incrementAmount;
  },
  
  calculateNextBid: (currentBid: number, incrementAmount: number, maximumAmount: number) => {
    const nextBid = currentBid + incrementAmount;
    return nextBid <= maximumAmount ? nextBid : null;
  }
};

// Mock proxy configurations
export const mockProxyConfigs: ProxyBidConfig[] = [
  {
    bidderId: '1',
    vehicleId: '1',
    maximumAmount: 30000,
    incrementAmount: 500,
    isActive: true,
    autoRenew: true
  },
  {
    bidderId: '2',
    vehicleId: '1',
    maximumAmount: 28000,
    incrementAmount: 250,
    isActive: true,
    autoRenew: false
  },
  {
    bidderId: '3',
    vehicleId: '2',
    maximumAmount: 35000,
    incrementAmount: 1000,
    isActive: true,
    autoRenew: true
  }
];

// Helper functions
export const getActiveAuctions = () => {
  return mockAuctions.filter(auction => auction.status === 'active');
};

export const getUpcomingAuctions = () => {
  return mockAuctions.filter(auction => auction.status === 'upcoming');
};

export const getAuctionVehicles = (auctionId: string) => {
  return mockAuctionVehicles.filter(vehicle => vehicle.auctionId === auctionId);
};

export const getCurrentBid = (vehicleId: string) => {
  const vehicle = mockAuctionVehicles.find(v => v.id === vehicleId);
  return vehicle?.currentBid || vehicle?.startingBid;
};

export const isReserveMet = (vehicleId: string) => {
  const vehicle = mockAuctionVehicles.find(v => v.id === vehicleId);
  if (!vehicle || !vehicle.reservePrice) return true;
  return (vehicle.currentBid || vehicle.startingBid) >= vehicle.reservePrice;
};

export const getProxyConfig = (bidderId: string, vehicleId: string) => {
  return mockProxyConfigs.find(config => 
    config.bidderId === bidderId && config.vehicleId === vehicleId && config.isActive
  );
};

export const setProxyBid = (bidderId: string, vehicleId: string, maximumAmount: number, incrementAmount: number) => {
  const existingConfig = mockProxyConfigs.find(config => 
    config.bidderId === bidderId && config.vehicleId === vehicleId
  );
  
  if (existingConfig) {
    existingConfig.maximumAmount = maximumAmount;
    existingConfig.incrementAmount = incrementAmount;
    existingConfig.isActive = true;
  } else {
    mockProxyConfigs.push({
      bidderId,
      vehicleId,
      maximumAmount,
      incrementAmount,
      isActive: true,
      autoRenew: false
    });
  }
};

export const cancelProxyBid = (bidderId: string, vehicleId: string) => {
  const config = mockProxyConfigs.find(config => 
    config.bidderId === bidderId && config.vehicleId === vehicleId
  );
  if (config) {
    config.isActive = false;
  }
};
