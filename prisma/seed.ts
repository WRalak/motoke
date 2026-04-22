import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('Starting database seeding...');

  // Clear existing data
  await prisma.bid.deleteMany();
  await prisma.proxyBid.deleteMany();
  await prisma.auctionVehicle.deleteMany();
  await prisma.auction.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.salespersonProfile.deleteMany();
  await prisma.customerProfile.deleteMany();
  await prisma.dealerProfile.deleteMany();
  await prisma.authSession.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@motoke.com',
      password: adminPassword,
      name: 'System Administrator',
      phone: '+254700000001',
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true
    }
  });

  // Create dealer users
  const dealerPassword = await bcrypt.hash('dealer123', 12);
  const dealer1 = await prisma.user.create({
    data: {
      email: 'dealer@premiummotors.com',
      password: dealerPassword,
      name: 'John Dealer',
      phone: '+254700000002',
      role: 'DEALER',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true
    }
  });

  const dealer2 = await prisma.user.create({
    data: {
      email: 'dealer@familyauto.com',
      password: dealerPassword,
      name: 'Sarah Johnson',
      phone: '+254700000003',
      role: 'DEALER',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true
    }
  });

  // Create dealer profiles
  await prisma.dealerProfile.create({
    data: {
      userId: dealer1.id,
      businessName: 'Premium Motors',
      kraPin: 'A001234567P',
      county: 'Nairobi',
      city: 'Nairobi',
      address: '123 Main Street',
      phone: '+254700000002',
      email: 'dealer@premiummotors.com',
      website: 'https://premiummotors.com',
      specialties: JSON.stringify(['Luxury', 'SUV', 'Electric']),
      established: 2010,
      rating: 4.5,
      reviewCount: 234,
      verified: true,
      subscriptionPlan: 'PRO',
      mpesaNumber: '+254700000002'
    }
  });

  await prisma.dealerProfile.create({
    data: {
      userId: dealer2.id,
      businessName: 'Family Auto Center',
      kraPin: 'A001234568P',
      county: 'Burbank',
      city: 'Burbank',
      address: '456 Oak Avenue',
      phone: '+254700000003',
      email: 'dealer@familyauto.com',
      specialties: JSON.stringify(['Sedan', 'Minivan', 'Used Cars']),
      established: 2005,
      rating: 4.2,
      reviewCount: 156,
      verified: true,
      subscriptionPlan: 'STANDARD',
      mpesaNumber: '+254700000003'
    }
  });

  // Create customer users
  const customerPassword = await bcrypt.hash('customer123', 12);
  const customer1 = await prisma.user.create({
    data: {
      email: 'customer@email.com',
      password: customerPassword,
      name: 'Jane Customer',
      phone: '+254700000004',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: false
    }
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'buyer@email.com',
      password: customerPassword,
      name: 'Mike Wilson',
      phone: '+254700000005',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true
    }
  });

  // Create customer profiles
  await prisma.customerProfile.create({
    data: {
      userId: customer1.id,
      county: 'Nairobi',
      city: 'Nairobi',
      dateOfBirth: new Date('1985-06-15'),
      creditScore: 750,
      income: 85000,
      employmentStatus: 'employed',
      employer: 'Tech Corp',
      preferences: JSON.stringify({
        vehicleTypes: ['Sedan', 'SUV'],
        priceRange: { min: 20000, max: 40000 },
        financing: true,
        insurance: true
      })
    }
  });

  await prisma.customerProfile.create({
    data: {
      userId: customer2.id,
      county: 'Burbank',
      city: 'Burbank',
      dateOfBirth: new Date('1990-03-22'),
      creditScore: 680,
      income: 65000,
      employmentStatus: 'employed',
      employer: 'Marketing Agency',
      preferences: JSON.stringify({
        vehicleTypes: ['SUV', 'Crossover'],
        priceRange: { min: 25000, max: 50000 },
        financing: true,
        insurance: false
      })
    }
  });

  // Create vehicles
  const vehicle1 = await prisma.vehicle.create({
    data: {
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      mileage: 15000,
      vin: '1HGBH41JXMN109186',
      price: 2500000,
      status: 'AVAILABLE',
      images: JSON.stringify(['/images/vehicles/camry1.jpg', '/images/vehicles/camry2.jpg']),
      description: 'Well-maintained Toyota Camry with excellent fuel economy and reliability.',
      features: JSON.stringify(['Bluetooth', 'Backup Camera', 'Lane Assist', 'Cruise Control']),
      engineSize: '2.5L',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      driveType: 'FWD',
      colour: 'Silver',
      county: 'Nairobi',
      ntsaStatus: 'CLEARED',
      dealerId: dealer1.id
    }
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      make: 'Honda',
      model: 'CR-V',
      year: 2023,
      mileage: 8000,
      vin: '2HGBH41JXMN109187',
      price: 3200000,
      status: 'AVAILABLE',
      images: JSON.stringify(['/images/vehicles/crv1.jpg', '/images/vehicles/crv2.jpg']),
      description: 'Spacious SUV perfect for families, excellent safety ratings.',
      features: JSON.stringify(['AWD', 'Apple CarPlay', 'Android Auto', 'Honda Sensing']),
      engineSize: '1.5L Turbo',
      transmission: 'CVT',
      fuelType: 'Petrol',
      driveType: 'AWD',
      colour: 'Blue',
      county: 'Nairobi',
      ntsaStatus: 'CLEARED',
      dealerId: dealer1.id
    }
  });

  // Create auction
  const auction = await prisma.auction.create({
    data: {
      title: 'Spring Luxury Vehicle Auction',
      description: 'Premium luxury and exotic vehicles from private collections and dealer trade-ins.',
      type: 'ONLINE',
      status: 'UPCOMING',
      startDate: new Date('2024-04-15T10:00:00Z'),
      endDate: new Date('2024-04-15T18:00:00Z'),
      location: 'Los Angeles Convention Center, Hall A',
      organizer: 'Premier Auction House',
      fees: JSON.stringify({ buyerPremium: 10, registrationFee: 200, otherFees: ['Online bidding fee: $50', 'Wire transfer fee: $25'] }),
      requirements: JSON.stringify({ deposit: 1000, maxBidders: 500, preApproval: true }),
      images: JSON.stringify(['/images/auctions/luxury-1.jpg', '/images/auctions/luxury-2.jpg'])
    }
  });

  // Create auction vehicle
  await prisma.auctionVehicle.create({
    data: {
      vehicleId: vehicle1.id,
      auctionId: auction.id,
      startingBid: 2000000,
      currentBid: 2350000,
      reservePrice: 2500000,
      bidCount: 7,
      status: 'bidding',
      highlights: JSON.stringify(['Low mileage', 'One owner', 'Service records', 'Excellent condition']),
      conditionReport: JSON.stringify({
        overall: 'excellent',
        exterior: 'Minor scratches on rear bumper, otherwise excellent paint and finish',
        interior: 'Like new, no wear on seats or controls',
        mechanical: 'Perfect running condition, recent service completed',
        tires: '90% tread life remaining',
        documentation: 'Clean title, complete service history available'
      }),
      images: JSON.stringify(['/images/vehicles/auction-camry-1.jpg', '/images/vehicles/auction-camry-2.jpg'])
    }
  });

  // Create sample bids
  await prisma.bid.create({
    data: {
      vehicleId: vehicle1.id,
      auctionVehicleId: auction.id + '-1', // This would be the actual ID
      bidderId: customer1.id,
      amount: 2350000,
      type: 'MANUAL',
      status: 'WINNING'
    }
  });

  // Create sample sales
  await prisma.sale.create({
    data: {
      vehicleId: vehicle2.id,
      dealerId: dealer1.id,
      customerId: customer2.id,
      saleDate: new Date('2024-01-20'),
      salePrice: 3200000,
      saleType: 'RETAIL',
      status: 'COMPLETED',
      paymentMethod: 'FINANCING',
      commission: 96000,
      profit: 450000,
      taxes: 256000,
      fees: JSON.stringify({ documentation: 300, registration: 250, other: 150 })
    }
  });

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
