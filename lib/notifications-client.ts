export interface NotificationChannel {
  type: 'inapp' | 'email' | 'sms' | 'push';
  enabled: boolean;
  settings?: {
    email?: string;
    phone?: string;
    pushToken?: string;
  };
}

export interface NotificationTemplate {
  id: string;
  type: 'bid' | 'offer' | 'message' | 'auction' | 'payment' | 'system';
  channels: ('inapp' | 'email' | 'sms' | 'push')[];
  templates: {
    inapp?: {
      title: string;
      message: string;
    };
    email?: {
      subject: string;
      html: string;
      text: string;
    };
    sms?: {
      text: string;
    };
    push?: {
      title: string;
      body: string;
      icon?: string;
    };
  };
}

// Client-side notification service (browser compatible)
export class NotificationService {
  private static instance: NotificationService;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // In-app notifications (stored in localStorage)
  async createInAppNotification(userId: string, notification: Omit<NotificationTemplate, 'id'>) {
    const notifications = this.getInAppNotifications(userId);
    notifications.push({
      id: Date.now().toString(),
      ...notification,
      createdAt: new Date().toISOString(),
      read: false
    });
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
    
    // Trigger browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.templates.inapp?.title || 'New Notification', {
        body: notification.templates.inapp?.message || 'You have a new notification',
        icon: '/favicon.ico'
      });
    }
  }

  getInAppNotifications(userId: string): Omit<NotificationTemplate, 'id'>[] {
    const stored = localStorage.getItem(`notifications_${userId}`);
    return stored ? JSON.parse(stored) : [];
  }

  markAsRead(userId: string, notificationId: string) {
    const notifications = this.getInAppNotifications(userId);
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(updated));
  }

  getUnreadCount(userId: string): number {
    const notifications = this.getInAppNotifications(userId);
    return notifications.filter(n => !n.read).length;
  }

  // Email notifications (via API)
  async sendEmailNotification(to: string, template: NotificationTemplate['templates']['email']) {
    try {
      const response = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject: template.subject,
          html: template.html,
          text: template.text
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email notification');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending email notification:', error);
      throw error;
    }
  }

  // SMS notifications (via API)
  async sendSMSNotification(to: string, template: NotificationTemplate['templates']['sms']) {
    try {
      const response = await fetch('/api/notifications/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          message: template.text
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send SMS notification');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending SMS notification:', error);
      throw error;
    }
  }

  // Push notifications (via API)
  async sendPushNotification(to: string, template: NotificationTemplate['templates']['push']) {
    try {
      const response = await fetch('/api/notifications/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          title: template.title,
          body: template.body,
          icon: template.icon
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send push notification');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  }

  // Send notification through appropriate channel
  async sendNotification(userId: string, template: NotificationTemplate, channels: NotificationChannel[]) {
    const promises: Promise<any>[] = [];

    for (const channel of channels) {
      if (channel.type === 'inapp') {
        promises.push(this.createInAppNotification(userId, template));
      } else if (channel.type === 'email' && channel.enabled) {
        promises.push(this.sendEmailNotification(userId, template.templates.email!));
      } else if (channel.type === 'sms' && channel.enabled) {
        promises.push(this.sendSMSNotification(userId, template.templates.sms!));
      } else if (channel.type === 'push' && channel.enabled) {
        promises.push(this.sendPushNotification(userId, template.templates.push!));
      }
    }

    return Promise.allSettled(promises);
  }
}
