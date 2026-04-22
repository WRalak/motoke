import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Helper functions for database operations
export const db = {
  // User operations
  users: {
    findById: (id: string) => prisma.user.findUnique({ where: { id } }),
    findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
    create: (data: any) => prisma.user.create({ data }),
    update: (id: string, data: any) => prisma.user.update({ where: { id }, data }),
    delete: (id: string) => prisma.user.delete({ where: { id } }),
    findMany: (filters: any) => prisma.user.findMany({ where: filters }),
  },

  // Vehicle operations
  vehicles: {
    findById: (id: string) => prisma.vehicle.findUnique({ 
      where: { id },
      include: {
        dealer: true
      }
    }),
    findMany: (filters: any) => prisma.vehicle.findMany({ 
      where: filters,
      include: {
        dealer: true
      }
    }),
    create: (data: any) => prisma.vehicle.create({ data }),
    update: (id: string, data: any) => prisma.vehicle.update({ where: { id }, data }),
    delete: (id: string) => prisma.vehicle.delete({ where: { id } }),
    search: (query: string) => prisma.vehicle.findMany({
      where: {
        OR: [
          { make: { contains: query, mode: 'insensitive' } },
          { model: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { county: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        dealer: true
      }
    }),
  },

  // Dealer operations
  dealers: {
    findById: (id: string) => prisma.dealer.findUnique({ where: { id } }),
    findMany: (filters: any) => prisma.dealer.findMany({ where: filters }),
    create: (data: any) => prisma.dealer.create({ data }),
    update: (id: string, data: any) => prisma.dealer.update({ where: { id }, data }),
    delete: (id: string) => prisma.dealer.delete({ where: { id } }),
  },

  // Listing operations
  listings: {
    findById: (id: string) => prisma.listing.findUnique({ 
      where: { id },
      include: {
        vehicle: true,
        seller: true
      }
    }),
    findMany: (filters: any) => prisma.listing.findMany({ 
      where: filters,
      include: {
        vehicle: true,
        seller: true
      }
    }),
    create: (data: any) => prisma.listing.create({ data }),
    update: (id: string, data: any) => prisma.listing.update({ where: { id }, data }),
    delete: (id: string) => prisma.listing.delete({ where: { id } }),
  },

  // Auction operations
  auctions: {
    findById: (id: string) => prisma.auction.findUnique({ 
      where: { id },
      include: {
        vehicle: true
      }
    }),
    findMany: (filters: any) => prisma.auction.findMany({ 
      where: filters,
      include: {
        vehicle: true
      }
    }),
    create: (data: any) => prisma.auction.create({ data }),
    update: (id: string, data: any) => prisma.auction.update({ where: { id }, data }),
    delete: (id: string) => prisma.auction.delete({ where: { id } }),
  },

  // Bid operations
  bids: {
    findById: (id: string) => prisma.bid.findUnique({ 
      where: { id },
      include: {
        vehicle: true,
        bidder: true
      }
    }),
    findMany: (filters: any) => prisma.bid.findMany({ 
      where: filters,
      include: {
        vehicle: true,
        bidder: true
      }
    }),
    create: (data: any) => prisma.bid.create({ data }),
    update: (id: string, data: any) => prisma.bid.update({ where: { id }, data }),
    delete: (id: string) => prisma.bid.delete({ where: { id } }),
  },

  // Message operations
  messages: {
    findById: (id: string) => prisma.message.findUnique({ 
      where: { id },
      include: {
        sender: true,
        receiver: true,
        vehicle: true,
        dealer: true
      }
    }),
    findMany: (filters: any) => prisma.message.findMany({ 
      where: filters,
      include: {
        sender: true,
        receiver: true,
        vehicle: true,
        dealer: true
      }
    }),
    create: (data: any) => prisma.message.create({ data }),
    update: (id: string, data: any) => prisma.message.update({ where: { id }, data }),
    delete: (id: string) => prisma.message.delete({ where: { id } }),
  },

  // Notification operations
  notifications: {
    findById: (id: string) => prisma.notification.findUnique({ where: { id } }),
    findMany: (filters: any) => prisma.notification.findMany({ where: filters }),
    create: (data: any) => prisma.notification.create({ data }),
    update: (id: string, data: any) => prisma.notification.update({ where: { id }, data }),
    delete: (id: string) => prisma.notification.delete({ where: { id } }),
    markAsRead: (id: string) => prisma.notification.update({ 
      where: { id }, 
      data: { isRead: true } 
    }),
  },

  // Review operations
  reviews: {
    findById: (id: string) => prisma.review.findUnique({ 
      where: { id },
      include: {
        user: true,
        dealer: true
      }
    }),
    findMany: (filters: any) => prisma.review.findMany({ 
      where: filters,
      include: {
        user: true,
        dealer: true
      }
    }),
    create: (data: any) => prisma.review.create({ data }),
    update: (id: string, data: any) => prisma.review.update({ where: { id }, data }),
    delete: (id: string) => prisma.review.delete({ where: { id } }),
  },

  // Payment operations
  payments: {
    findById: (id: string) => prisma.payment.findUnique({ where: { id } }),
    findMany: (filters: any) => prisma.payment.findMany({ where: filters }),
    create: (data: any) => prisma.payment.create({ data }),
    update: (id: string, data: any) => prisma.payment.update({ where: { id }, data }),
    delete: (id: string) => prisma.payment.delete({ where: { id } }),
  },

  // M-Pesa operations
  mpesaTransactions: {
    findById: (id: string) => prisma.mpesaTransaction.findUnique({ where: { id } }),
    findMany: (filters: any) => prisma.mpesaTransaction.findMany({ where: filters }),
    create: (data: any) => prisma.mpesaTransaction.create({ data }),
    update: (id: string, data: any) => prisma.mpesaTransaction.update({ where: { id }, data }),
    delete: (id: string) => prisma.mpesaTransaction.delete({ where: { id } }),
  },
};

// Export types
export type User = import('@prisma/client').User;
export type Vehicle = import('@prisma/client').Vehicle;
export type Dealer = import('@prisma/client').Dealer;
export type Listing = import('@prisma/client').Listing;
export type Auction = import('@prisma/client').Auction;
export type Bid = import('@prisma/client').Bid;
export type Message = import('@prisma/client').Message;
export type Notification = import('@prisma/client').Notification;
export type Review = import('@prisma/client').Review;
export type Payment = import('@prisma/client').Payment;
export type MpesaTransaction = import('@prisma/client').MpesaTransaction;
