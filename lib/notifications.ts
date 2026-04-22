import { Notification } from '@/contexts/NotificationContext';

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
      actionUrl?: string;
      actionText?: string;
    };
    email?: {
      subject: string;
      html: string;
      text: string;
    };
    sms?: {
      message: string;
    };
    push?: {
      title: string;
      body: string;
      icon?: string;
      tag?: string;
    };
  };
}

class NotificationService {
  private static instance: NotificationService;
  private userChannels: Map<string, NotificationChannel[]> = new Map();

  private constructor() {
    this.initializeTemplates();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private templates: Map<string, NotificationTemplate> = new Map();

  private initializeTemplates() {
    // Bid notification templates
    this.templates.set('bid_received', {
      id: 'bid_received',
      type: 'bid',
      channels: ['inapp', 'email', 'sms'],
      templates: {
        inapp: {
          title: 'New Bid Received',
          message: 'Someone placed a bid of KES {{amount}} on your {{make}} {{model}} listing',
          actionUrl: '/sell',
          actionText: 'View Listing'
        },
        email: {
          subject: 'New Bid Received - Motoke',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #10b981; color: white; padding: 20px; text-align: center;">
                <h1>Motoke</h1>
                <p>New Bid Received</p>
              </div>
              <div style="padding: 20px; background: #f9fafb;">
                <h2>Great News!</h2>
                <p>You've received a new bid of <strong>KES {{amount}}</strong> on your {{make}} {{model}} listing.</p>
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h3>Vehicle Details:</h3>
                  <p><strong>Make:</strong> {{make}}</p>
                  <p><strong>Model:</strong> {{model}}</p>
                  <p><strong>Year:</strong> {{year}}</p>
                  <p><strong>Bid Amount:</strong> KES {{amount}}</p>
                  <p><strong>Bid Time:</strong> {{timestamp}}</p>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="{{actionUrl}}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    View Listing
                  </a>
                </div>
              </div>
              <div style="background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 12px;">
                <p>&copy; 2024 Motoke. All rights reserved.</p>
                <p>This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          `,
          text: `
            New Bid Received - Motoke
            
            Great News! You've received a new bid of KES {{amount}} on your {{make}} {{model}} listing.
            
            Vehicle Details:
            Make: {{make}}
            Model: {{model}}
            Year: {{year}}
            Bid Amount: KES {{amount}}
            Bid Time: {{timestamp}}
            
            View your listing here: {{actionUrl}}
            
            © 2024 Motoke. All rights reserved.
          `
        },
        sms: {
          message: 'Motoke: New bid of KES {{amount}} received for your {{make}} {{model}}. View listing: {{shortUrl}}'
        },
        push: {
          title: 'New Bid Received',
          body: 'Someone placed a bid of KES {{amount}} on your vehicle listing',
          icon: '/icons/bid.png',
          tag: 'bid_received'
        }
      }
    });

    // Auction notification templates
    this.templates.set('auction_ending', {
      id: 'auction_ending',
      type: 'auction',
      channels: ['inapp', 'email', 'sms'],
      templates: {
        inapp: {
          title: 'Auction Ending Soon',
          message: 'The auction for {{make}} {{model}} ends in {{timeLeft}}. Current bid: KES {{currentBid}}',
          actionUrl: '/auctions',
          actionText: 'View Auction'
        },
        email: {
          subject: 'Auction Ending Soon - Motoke',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #10b981; color: white; padding: 20px; text-align: center;">
                <h1>Motoke</h1>
                <p>Auction Ending Soon</p>
              </div>
              <div style="padding: 20px; background: #f9fafb;">
                <h2>Act Fast!</h2>
                <p>The auction for <strong>{{make}} {{model}}</strong> ends in <strong>{{timeLeft}}</strong>.</p>
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h3>Auction Details:</h3>
                  <p><strong>Vehicle:</strong> {{make}} {{model}}</p>
                  <p><strong>Current Bid:</strong> KES {{currentBid}}</p>
                  <p><strong>Time Remaining:</strong> {{timeLeft}}</p>
                  <p><strong>Auction ID:</strong> {{auctionId}}</p>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="{{actionUrl}}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Place Your Bid
                  </a>
                </div>
              </div>
              <div style="background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 12px;">
                <p>&copy; 2024 Motoke. All rights reserved.</p>
              </div>
            </div>
          `,
          text: `
            Auction Ending Soon - Motoke
            
            Act Fast! The auction for {{make}} {{model}} ends in {{timeLeft}}.
            
            Auction Details:
            Vehicle: {{make}} {{model}}
            Current Bid: KES {{currentBid}}
            Time Remaining: {{timeLeft}}
            Auction ID: {{auctionId}}
            
            Place your bid here: {{actionUrl}}
            
            © 2024 Motoke. All rights reserved.
          `
        },
        sms: {
          message: 'Motoke: Auction for {{make}} {{model}} ends in {{timeLeft}}! Current bid: KES {{currentBid}}. Bid now: {{shortUrl}}'
        },
        push: {
          title: 'Auction Ending Soon',
          body: 'The auction for {{make}} {{model}} ends in {{timeLeft}}',
          icon: '/icons/auction.png',
          tag: 'auction_ending'
        }
      }
    });

    // Message notification templates
    this.templates.set('new_message', {
      id: 'new_message',
      type: 'message',
      channels: ['inapp', 'email', 'sms'],
      templates: {
        inapp: {
          title: 'New Message',
          message: '{{senderName}}: {{messagePreview}}',
          actionUrl: '/messages',
          actionText: 'View Message'
        },
        email: {
          subject: 'New Message from {{senderName}} - Motoke',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #10b981; color: white; padding: 20px; text-align: center;">
                <h1>Motoke</h1>
                <p>New Message</p>
              </div>
              <div style="padding: 20px; background: #f9fafb;">
                <h2>You have a new message</h2>
                <p><strong>{{senderName}}</strong> sent you a message:</p>
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                  <p>{{messageContent}}</p>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="{{actionUrl}}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Reply to Message
                  </a>
                </div>
              </div>
              <div style="background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 12px;">
                <p>&copy; 2024 Motoke. All rights reserved.</p>
              </div>
            </div>
          `,
          text: `
            New Message from {{senderName}} - Motoke
            
            You have a new message from {{senderName}}:
            
            {{messageContent}}
            
            Reply here: {{actionUrl}}
            
            © 2024 Motoke. All rights reserved.
          `
        },
        sms: {
          message: 'Motoke: New message from {{senderName}}. "{{messagePreview}}" Reply here: {{shortUrl}}'
        },
        push: {
          title: 'New Message',
          body: '{{senderName}} sent you a message',
          icon: '/icons/message.png',
          tag: 'new_message'
        }
      }
    });

    // Offer notification templates
    this.templates.set('offer_update', {
      id: 'offer_update',
      type: 'offer',
      channels: ['inapp', 'email', 'sms'],
      templates: {
        inapp: {
          title: 'Offer Update',
          message: 'Your offer of KES {{amount}} for the {{make}} {{model}} has been {{status}}',
          actionUrl: '/purchases',
          actionText: 'View Purchase'
        },
        email: {
          subject: 'Offer {{status}} - Motoke',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #10b981; color: white; padding: 20px; text-align: center;">
                <h1>Motoke</h1>
                <p>Offer {{status}}</p>
              </div>
              <div style="padding: 20px; background: #f9fafb;">
                <h2>Your offer has been {{status}}!</h2>
                <p>Your offer of <strong>KES {{amount}}</strong> for the <strong>{{make}} {{model}}</strong> has been {{status}}.</p>
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h3>Offer Details:</h3>
                  <p><strong>Vehicle:</strong> {{make}} {{model}}</p>
                  <p><strong>Your Offer:</strong> KES {{amount}}</p>
                  <p><strong>Status:</strong> {{status}}</p>
                  <p><strong>Date:</strong> {{timestamp}}</p>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="{{actionUrl}}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    View Details
                  </a>
                </div>
              </div>
              <div style="background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 12px;">
                <p>&copy; 2024 Motoke. All rights reserved.</p>
              </div>
            </div>
          `,
          text: `
            Offer {{status}} - Motoke
            
            Your offer of KES {{amount}} for the {{make}} {{model}} has been {{status}}!
            
            Offer Details:
            Vehicle: {{make}} {{model}}
            Your Offer: KES {{amount}}
            Status: {{status}}
            Date: {{timestamp}}
            
            View details here: {{actionUrl}}
            
            © 2024 Motoke. All rights reserved.
          `
        },
        sms: {
          message: 'Motoke: Your offer of KES {{amount}} for {{make}} {{model}} has been {{status}}! Details: {{shortUrl}}'
        },
        push: {
          title: 'Offer Update',
          body: 'Your offer for {{make}} {{model}} has been {{status}}',
          icon: '/icons/offer.png',
          tag: 'offer_update'
        }
      }
    });

    // Payment reminder templates
    this.templates.set('payment_reminder', {
      id: 'payment_reminder',
      type: 'payment',
      channels: ['inapp', 'email', 'sms'],
      templates: {
        inapp: {
          title: 'Payment Reminder',
          message: '{{description}} is due on {{dueDate}}',
          actionUrl: '/payments',
          actionText: 'Make Payment'
        },
        email: {
          subject: 'Payment Reminder - Motoke',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #ef4444; color: white; padding: 20px; text-align: center;">
                <h1>Motoke</h1>
                <p>Payment Reminder</p>
              </div>
              <div style="padding: 20px; background: #f9fafb;">
                <h2>Payment Due Soon</h2>
                <p>This is a reminder that your <strong>{{description}}</strong> is due on <strong>{{dueDate}}</strong>.</p>
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                  <h3>Payment Details:</h3>
                  <p><strong>Description:</strong> {{description}}</p>
                  <p><strong>Amount:</strong> KES {{amount}}</p>
                  <p><strong>Due Date:</strong> {{dueDate}}</p>
                  <p><strong>Payment ID:</strong> {{paymentId}}</p>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="{{actionUrl}}" style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Make Payment Now
                  </a>
                </div>
              </div>
              <div style="background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 12px;">
                <p>&copy; 2024 Motoke. All rights reserved.</p>
              </div>
            </div>
          `,
          text: `
            Payment Reminder - Motoke
            
            This is a reminder that your {{description}} is due on {{dueDate}}.
            
            Payment Details:
            Description: {{description}}
            Amount: KES {{amount}}
            Due Date: {{dueDate}}
            Payment ID: {{paymentId}}
            
            Make payment here: {{actionUrl}}
            
            © 2024 Motoke. All rights reserved.
          `
        },
        sms: {
          message: 'Motoke: Payment reminder! {{description}} due on {{dueDate}}. Amount: KES {{amount}}. Pay now: {{shortUrl}}'
        },
        push: {
          title: 'Payment Reminder',
          body: 'Your payment is due on {{dueDate}}',
          icon: '/icons/payment.png',
          tag: 'payment_reminder'
        }
      }
    });
  }

  async sendNotification(
    userId: string,
    templateId: string,
    data: Record<string, any>,
    channels?: ('inapp' | 'email' | 'sms' | 'push')[]
  ): Promise<void> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const userChannels = this.getUserChannels(userId);
    const targetChannels = channels || template.channels;

    for (const channel of targetChannels) {
      const userChannel = userChannels.find(c => c.type === channel);
      if (!userChannel?.enabled) continue;

      try {
        await this.sendToChannel(channel, template, data, userChannel);
      } catch (error) {
        console.error(`Failed to send ${channel} notification:`, error);
      }
    }
  }

  private async sendToChannel(
    channel: 'inapp' | 'email' | 'sms' | 'push',
    template: NotificationTemplate,
    data: Record<string, any>,
    userChannel: NotificationChannel
  ): Promise<void> {
    const channelTemplate = template.templates[channel];
    if (!channelTemplate) return;

    switch (channel) {
      case 'inapp':
        // In-app notifications are handled by the React context
        break;

      case 'email':
        await this.sendEmail(userChannel.settings?.email, channelTemplate, data);
        break;

      case 'sms':
        await this.sendSMS(userChannel.settings?.phone, channelTemplate, data);
        break;

      case 'push':
        await this.sendPushNotification(userChannel.settings?.pushToken, channelTemplate, data);
        break;
    }
  }

  private async sendEmail(email: string | undefined, template: any, data: Record<string, any>): Promise<void> {
    if (!email) return;

    try {
      // SendGrid implementation
      const sgMail = require('@sendgrid/mail');
      const sg = require('@sendgrid/mail').setApiKey(process.env.SENDGRID_API_KEY);
      
      const msg = {
        to: email,
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        subject: this.replaceTemplateVariables(template.subject, data),
        html: this.replaceTemplateVariables(template.html, data),
        text: this.replaceTemplateVariables(template.text, data),
      };

      await sg.send(msg);
      console.log('Email sent successfully to:', email);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  private async sendSMS(phone: string | undefined, template: any, data: Record<string, any>): Promise<void> {
    if (!phone) return;

    try {
      // Twilio implementation
      const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      const message = this.replaceTemplateVariables(template.message, data);
      
      await twilio.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
        messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
      });

      console.log('SMS sent successfully to:', phone);
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw error;
    }
  }

  private async sendPushNotification(token: string | undefined, template: any, data: Record<string, any>): Promise<void> {
    if (!token) return;

    // In a real implementation, you would use FCM, APNs, etc.
    const title = this.replaceTemplateVariables(template.title, data);
    const body = this.replaceTemplateVariables(template.body, data);
    console.log('Sending push notification to token:', token);
    console.log('Title:', title);
    console.log('Body:', body);
    
    // Mock push notification sending
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private replaceTemplateVariables(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  setUserChannels(userId: string, channels: NotificationChannel[]): void {
    this.userChannels.set(userId, channels);
  }

  getUserChannels(userId: string): NotificationChannel[] {
    return this.userChannels.get(userId) || [
      { type: 'inapp', enabled: true },
      { type: 'email', enabled: true, settings: { email: 'user@example.com' } },
      { type: 'sms', enabled: false },
      { type: 'push', enabled: false }
    ];
  }

  async updateNotificationPreferences(
    userId: string,
    preferences: Partial<NotificationChannel>[]
  ): Promise<void> {
    const currentChannels = this.getUserChannels(userId);
    const updatedChannels = currentChannels.map(channel => {
      const preference = preferences.find(p => p.type === channel.type);
      return preference ? { ...channel, ...preference } : channel;
    });
    
    this.setUserChannels(userId, updatedChannels);
  }

  getAvailableTemplates(): NotificationTemplate[] {
    return Array.from(this.templates.values());
  }
}

export const notificationService = NotificationService.getInstance();
