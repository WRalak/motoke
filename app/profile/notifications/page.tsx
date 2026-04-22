'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProtectedRoute from '@/components/ProtectedRoute';
import { notificationService, NotificationChannel } from '@/lib/notifications';
import { auth } from '@/lib/auth';

export default function NotificationPreferencesPage() {
  const [channels, setChannels] = useState<NotificationChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testPhone, setTestPhone] = useState('');

  useEffect(() => {
    const user = auth.getUser();
    if (!user) return;

    // Load user's notification preferences
    const userChannels = notificationService.getUserChannels(user.id);
    setChannels(userChannels);
    setLoading(false);
  }, []);

  const handleChannelToggle = (channelType: string, enabled: boolean) => {
    setChannels(prev => 
      prev.map(channel => 
        channel.type === channelType 
          ? { ...channel, enabled }
          : channel
      )
    );
  };

  const handleChannelSettings = (channelType: string, settings: any) => {
    setChannels(prev => 
      prev.map(channel => 
        channel.type === channelType 
          ? { ...channel, settings: { ...channel.settings, ...settings } }
          : channel
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const user = auth.getUser();
      if (user) {
        await notificationService.updateNotificationPreferences(user.id, channels);
        // Show success message
        alert('Notification preferences saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleTestNotification = async (channelType: 'email' | 'sms') => {
    try {
      const user = auth.getUser();
      if (!user) return;

      const testData = {
        make: 'Toyota',
        model: 'Camry',
        year: '2022',
        amount: '2,500,000',
        timestamp: new Date().toLocaleString(),
        actionUrl: `${window.location.origin}/sell`,
        shortUrl: `${window.location.origin}/sell`
      };

      if (channelType === 'email') {
        await notificationService.sendNotification(
          user.id,
          'bid_received',
          testData,
          ['email']
        );
        alert('Test email sent! Check your inbox.');
      } else if (channelType === 'sms') {
        await notificationService.sendNotification(
          user.id,
          'bid_received',
          testData,
          ['sms']
        );
        alert('Test SMS sent! Check your phone.');
      }
    } catch (error) {
      console.error('Failed to send test notification:', error);
      alert('Failed to send test notification. Please check your settings.');
    }
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'inapp':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
      case 'email':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'sms':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'push':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getChannelDescription = (type: string) => {
    switch (type) {
      case 'inapp':
        return 'Receive notifications within the Motoke platform';
      case 'email':
        return 'Receive email notifications for important updates';
      case 'sms':
        return 'Receive SMS notifications for urgent alerts';
      case 'push':
        return 'Receive push notifications on your mobile device';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-green-500 mb-2">Notification Preferences</h1>
            <p className="text-gray-300">Manage how you receive notifications from Motoke</p>
          </div>

          {/* Notification Channels */}
          <div className="space-y-6">
            {channels.map((channel) => (
              <Card key={channel.type} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-green-500">
                        {getChannelIcon(channel.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white capitalize">
                          {channel.type === 'inapp' ? 'In-App' : channel.type.toUpperCase()} Notifications
                        </CardTitle>
                        <p className="text-sm text-gray-400">
                          {getChannelDescription(channel.type)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={channel.enabled}
                          onChange={(e) => handleChannelToggle(channel.type, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>
                </CardHeader>
                {channel.enabled && (
                  <CardContent className="space-y-4">
                    {channel.type === 'email' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={channel.settings?.email || ''}
                          onChange={(e) => handleChannelSettings('email', { email: e.target.value })}
                          placeholder="Enter your email address"
                          className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                        />
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestNotification('email')}
                            disabled={!channel.settings?.email}
                          >
                            Send Test Email
                          </Button>
                        </div>
                      </div>
                    )}

                    {channel.type === 'sms' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={channel.settings?.phone || ''}
                          onChange={(e) => handleChannelSettings('sms', { phone: e.target.value })}
                          placeholder="Enter your phone number (e.g., +254712345678)"
                          className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Include country code for international numbers
                        </p>
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestNotification('sms')}
                            disabled={!channel.settings?.phone}
                          >
                            Send Test SMS
                          </Button>
                        </div>
                      </div>
                    )}

                    {channel.type === 'push' && (
                      <div>
                        <p className="text-sm text-gray-400">
                          Push notifications are available on our mobile app. Download the Motoke app to enable push notifications.
                        </p>
                        <div className="mt-4 space-y-2">
                          <Button variant="outline" size="sm" disabled>
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.16-.48-3.34-.48-1.18 0-2.26.02-3.34.48-1.03.45-2.1.6-3.08-.35-2.45-2.38-2.87-6.87-.85-9.64.63-1.38 1.65-1.5 2.66-1.5 1.01.01 2.02.01 3.03.01 1.01 0 2.02 0 3.03-.01 1.01-.01 2.03.12 2.66 1.5 2.02 2.77 1.6 7.26-.85 9.64z"/>
                            </svg>
                            Download for iOS
                          </Button>
                          <Button variant="outline" size="sm" disabled>
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5h14c.83 0 1.5.67 1.5 1.5v17c0 .83-.67 1.5-1.5 1.5h-14c-.83 0-1.5-.67-1.5-1.5zm16-1.5v-14h-13v14h13z"/>
                            </svg>
                            Download for Android
                          </Button>
                        </div>
                      </div>
                    )}

                    {channel.type === 'inapp' && (
                      <div>
                        <p className="text-sm text-gray-400">
                          In-app notifications are always enabled when you're logged into Motoke. You'll see them in the notification bell icon.
                        </p>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Notification Types */}
          <Card className="bg-gray-800 border-gray-700 mt-8">
            <CardHeader>
              <CardTitle className="text-lg text-white">Notification Types</CardTitle>
              <p className="text-sm text-gray-400">Choose which events trigger notifications</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 'bid', name: 'New Bids', description: 'When someone bids on your vehicle' },
                  { id: 'auction', name: 'Auction Updates', description: 'When auctions are ending or you\'re outbid' },
                  { id: 'message', name: 'Messages', description: 'When you receive new messages' },
                  { id: 'offer', name: 'Offer Updates', description: 'When your offers are accepted or rejected' },
                  { id: 'payment', name: 'Payment Reminders', description: 'When payments are due or overdue' },
                  { id: 'system', name: 'System Updates', description: 'Important platform updates and announcements' }
                ].map((type) => (
                  <div key={type.id} className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="text-white font-medium">{type.name}</h4>
                      <p className="text-sm text-gray-400">{type.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white px-8"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
