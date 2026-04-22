'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                <span className="text-sm">M</span>
              </div>
              <span className="text-green-500 font-bold text-xl">Motoke</span>
            </div>
            <p className="text-gray-400 text-sm">
              Kenya's trusted automotive marketplace. Buy, sell, and auction vehicles with confidence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-2.485h-2.842c-2.018 0-2.734-1.26-2.734-2.734V9.727c0-1.474 1.716-2.734 2.734-2.734h2.842V6.527c0-1.474-1.716-2.734-2.734-2.734C8.373 3.793 7.657 2.527 6.639 2.527H3.797C2.779 2.527 2.063 3.793 2.063 5.527v5.965c0 1.474 1.716 2.734 2.734 2.734z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.727l.025.025a10 10 0 01-2.828-.727l-.025-.025a10 10 0 112.825-.727l-.025.025a10 10 0 012.828.727l.025.025zm-2.828 2.828l-1.414-1.414a8 8 0 111.414 1.414l1.414 1.414z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.012 4.867 0 6.02-.012 7.25-.07 3.252-.06 4.867-.012 6.02-.07 3.252-.012 4.867-.012 6.02-.07 3.252-.06 4.867-.012 6.02-.07 3.252-.012 4.867-.012 6.02-.07 3.252-.06 4.867-.012 6.02-.07 3.252-.012 4.867-.012 6.02-.07 3.252-.06 4.867-.012 6.02-.07 3.252-.012 4.867-.012 6.02-.07 3.252-.06 4.867-.012 6.02-.07 3.252-.012 4.867-.012 6.02-.07 3.252-.06 4.867-.012 6.02-.07 3.252-.012 4.867-.012 6.02-.07 3.252-.06 4.867-.012 6.02-.07 3.252-.012 4.867-.012 6.02-.07z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-2.136v-2.978c0-1.777 1.424-3.228 3.228-3.228h2.194v-3.5H13.89c-2.566 0-4.642 2.076-4.642 4.642v2.978H7.5v3.5h1.748v5.569h3.554v-5.569h1.748v-2.978c0-1.777 1.424-3.228 3.228-3.228h2.194v-3.5h-3.554z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-green-500 font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/browse" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  Browse Vehicles
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  Sell Your Car
                </Link>
              </li>
              <li>
                <Link href="/auctions" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  Live Auctions
                </Link>
              </li>
              <li>
                <Link href="/dealers" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  Find Dealers
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  Finance Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-green-500 font-semibold text-lg">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  Vehicle Inspection
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  Financing Options
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  Insurance Services
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  Legal Transfer
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  Warranty Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-green-500 font-semibold text-lg">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16l2.257-1.13a1 1 0 011.21-.502l4.493 1.498a1 1 0 001.21-.502l4.493-1.498a1 1 0 00.502-1.21L16.97 3.485a1 1 0 00-.502-1.21L12.065.772a1 1 0 00-1.21.502l-4.493 1.498a1 1 0 00-1.21.502l-2.257 1.13a1 1 0 01-.502 1.21L3.485 16.97a1 1 0 00-.502 1.21z" />
                </svg>
                <span className="text-sm">+254 700 123 456</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">info@motoke.co.ke</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">Nairobi, Kenya</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Monday - Friday: 9am - 6pm</p>
              <p className="text-gray-400 text-sm">Saturday: 9am - 4pm</p>
              <p className="text-gray-400 text-sm">Sunday: Closed</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Motoke. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                Cookie Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
