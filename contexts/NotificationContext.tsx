'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/auth';

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

  // Load notifications from localStorage on mount
  useEffect(() => {
    const user = auth.getUser();
    if (!user) return;

    const storedNotifications = localStorage.getItem(`notifications_${user.id}`);
    if (storedNotifications) {
      try {
        const parsed = JSON.parse(storedNotifications);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    const user = auth.getUser();
    if (!user) return;

    if (notifications.length > 0) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show browser notification if permission is granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: newNotification.id
      });
    }

    // Send email and SMS notifications using notification service
    const user = auth.getUser();
    if (user) {
      // Map notification types to template IDs
      const templateMap: Record<string, string> = {
        'bid': 'bid_received',
        'auction': 'auction_ending',
        'message': 'new_message',
        'offer': 'offer_update',
        'payment': 'payment_reminder',
        'system': 'payment_reminder' // Use generic template for system notifications
      };

      const templateId = templateMap[notification.type];
      if (templateId) {
        // Import notificationService dynamically to avoid circular dependency
        import('@/lib/notifications').then(({ notificationService }) => {
          notificationService.sendNotification(user.id, templateId, {
            title: notification.title,
            message: notification.message,
            actionUrl: notification.actionUrl,
            actionText: notification.actionText,
            timestamp: newNotification.timestamp.toLocaleString()
          }, ['email', 'sms']).catch(console.error);
        });
      }
    }
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
