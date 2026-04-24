'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NotificationService } from '@/lib/notifications-client';

export interface Notification {
  id: string;
  type: 'bid' | 'offer' | 'message' | 'auction' | 'payment' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationService = NotificationService.getInstance();

  // Load notifications from localStorage on mount
  useEffect(() => {
    // Try to get user ID from localStorage or use a default
    const userId = localStorage.getItem('userId') || 'demo-user';
    const storedNotifications = notificationService.getInAppNotifications(userId);
    // Convert stored notification format to Notification format
    const formattedNotifications = storedNotifications.map((n: any) => ({
      id: n.id || Date.now().toString(),
      type: n.type,
      title: n.templates?.inapp?.title || n.title || '',
      message: n.templates?.inapp?.message || n.message || '',
      timestamp: new Date(n.createdAt || n.timestamp || Date.now()),
      read: n.read || false,
      actionUrl: n.actionUrl,
      actionText: n.actionText
    }));
    setNotifications(formattedNotifications);
  }, []);

  const addNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    try {
      // Try to get user ID from localStorage or use a default
      const userId = localStorage.getItem('userId') || 'demo-user';

      // Convert to NotificationTemplate format
      const template = {
        id: Date.now().toString(),
        type: notification.type,
        channels: ['inapp'] as ('inapp' | 'email' | 'sms' | 'push')[],
        templates: {
          inapp: {
            title: notification.title,
            message: notification.message
          }
        }
      };

      await notificationService.sendNotification(userId, template, [
        { type: 'inapp', enabled: true }
      ]);

      // Update local state
      const updatedNotifications = notificationService.getInAppNotifications(userId);
      // Convert stored notification format to Notification format
      const formattedNotifications = updatedNotifications.map((n: any) => ({
        id: n.id || Date.now().toString(),
        type: n.type,
        title: n.templates?.inapp?.title || n.title || '',
        message: n.templates?.inapp?.message || n.message || '',
        timestamp: new Date(n.createdAt || n.timestamp || Date.now()),
        read: n.read || false,
        actionUrl: n.actionUrl,
        actionText: n.actionText
      }));
      setNotifications(formattedNotifications);
    } catch (error) {
      console.error('Error adding notification:', error);
    }

    // Note: Email and SMS notifications would be handled by the backend API
    // For now, we only handle in-app notifications on the client side
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Utility functions for creating common notifications
export const createBidNotification = (vehicleMake: string, vehicleModel: string, bidAmount: number, listingId: string) => ({
  type: 'bid' as const,
  title: 'New Bid Received',
  message: `Someone placed a bid of KES ${bidAmount.toLocaleString()} on your ${vehicleMake} ${vehicleModel} listing`,
  actionUrl: `/sell`,
  actionText: 'View Listing'
});

export const createAuctionNotification = (vehicleMake: string, vehicleModel: string, auctionId: string) => ({
  type: 'auction' as const,
  title: 'Auction Ending Soon',
  message: `The auction for ${vehicleMake} ${vehicleModel} ends in 2 hours`,
  actionUrl: `/auctions`,
  actionText: 'View Auction'
});

export const createMessageNotification = (senderName: string, messagePreview: string, messageId: string) => ({
  type: 'message' as const,
  title: 'New Message',
  message: `${senderName}: ${messagePreview}`,
  actionUrl: '/messages',
  actionText: 'View Message'
});

export const createOfferNotification = (vehicleMake: string, vehicleModel: string, offerAmount: number, offerId: string) => ({
  type: 'offer' as const,
  title: 'Offer Update',
  message: `Your offer of KES ${offerAmount.toLocaleString()} for the ${vehicleMake} ${vehicleModel} has been accepted`,
  actionUrl: '/purchases',
  actionText: 'View Purchase'
});

export const createPaymentNotification = (description: string, dueDate: Date, paymentId: string) => ({
  type: 'payment' as const,
  title: 'Payment Reminder',
  message: `${description} is due on ${dueDate.toLocaleDateString()}`,
  actionUrl: '/payments',
  actionText: 'Make Payment'
});

export const createSystemNotification = (title: string, message: string) => ({
  type: 'system' as const,
  title,
  message
});
