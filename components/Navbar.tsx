'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = auth.getToken();
    const userData = auth.getUser();
    setIsAuthenticated(!!token);
    setUser(userData);
  }, []);

  const handleLogout = () => {
    auth.logout();
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/auth/login';
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/browse', label: 'Browse' },
    { href: '/auctions', label: 'Auctions' },
    { href: '/calculator', label: 'Calculator' },
    { href: '/dealers', label: 'Dealers' },
    { href: '/sell', label: 'Sell' }
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/listings', label: 'Listings' },
    { href: '/admin/dealers', label: 'Dealers' },
    { href: '/admin/auctions', label: 'Auctions' },
    { href: '/admin/customers', label: 'Customers' },
    { href: '/admin/sales', label: 'Sales' },
    { href: '/admin/settings', label: 'Settings' }
  ];

  const currentLinks = isAuthenticated && user?.role === 'ADMIN' ? adminLinks : navLinks;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              <span className="text-lg">M</span>
            </div>
            <span className="text-blue-600 font-bold text-xl">Motoke</span>
          </Link>

          <div className="flex items-center space-x-8">
            {currentLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {user.email}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
