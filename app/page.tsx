'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { vehicles, auctions } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const [featuredVehicles, setFeaturedVehicles] = useState<any[]>([]);
  const [activeAuctions, setActiveAuctions] = useState<any[]>([]);
  const [upcomingAuctions, setUpcomingAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesData, auctionsData] = await Promise.all([
          vehicles.getAll({ limit: 3, status: 'available' }),
          auctions.getAll()
        ]);

        setFeaturedVehicles(vehiclesData.vehicles);
        
        // Filter auctions
        const active = auctionsData.filter(a => a.status === 'ACTIVE').slice(0, 2);
        const upcoming = auctionsData.filter(a => a.status === 'UPCOMING').slice(0, 2);
        
        setActiveAuctions(active);
        setUpcomingAuctions(upcoming);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const getTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with 3D Vehicles */}
      <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* 3D Vehicle Showcase */}
        <div className="relative z-10 flex items-center min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-green-500 leading-tight">
                    Drive Your
                    <span className="block text-white">Dream Car</span>
                  </h1>
                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed">
                    Kenya's premier automotive marketplace with verified vehicles, secure payments, and live auctions.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-200">
                    Browse Vehicles
                  </Button>
                  <Button size="lg" variant="outline" className="border-green-600 text-green-500 hover:bg-green-600 hover:text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-200">
                    Sell Your Car
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500 mb-1">1000+</div>
                    <div className="text-sm text-gray-400">Vehicles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500 mb-1">500+</div>
                    <div className="text-sm text-gray-400">Dealers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500 mb-1">50+</div>
                    <div className="text-sm text-gray-400">Auctions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500 mb-1">NTSA</div>
                    <div className="text-sm text-gray-400">Certified</div>
                  </div>
                </div>
              </div>

              {/* Right - 3D Vehicle Display */}
              <div className="relative">
                <div className="relative w-full h-96 lg:h-full min-h-[400px]">
                  {/* 3D Car Container */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full max-w-md">
                      {/* Car SVG with 3D Effect */}
                      <div className="relative transform-gpu animate-float">
                        <svg
                          viewBox="0 0 400 200"
                          className="w-full h-auto drop-shadow-2xl"
                          style={{
                            filter: 'drop-shadow(0 25px 50px rgba(16, 185, 129, 0.3))'
                          }}
                        >
                          {/* Car Body */}
                          <g className="transform-gpu animate-rotate-slow">
                            {/* Main Body */}
                            <path
                              d="M50 120 L80 100 L320 100 L350 120 L350 140 L320 160 L80 160 L50 140 Z"
                              fill="url(#carGradient)"
                              stroke="#10b981"
                              strokeWidth="2"
                            />
                            
                            {/* Roof */}
                            <path
                              d="M120 100 L180 60 L220 60 L280 100"
                              fill="url(#roofGradient)"
                              stroke="#10b981"
                              strokeWidth="2"
                            />
                            
                            {/* Windows */}
                            <path
                              d="M130 100 L175 70 L225 70 L270 100"
                              fill="#1e293b"
                              stroke="#10b981"
                              strokeWidth="1"
                              opacity="0.8"
                            />
                            
                            {/* Wheels */}
                            <circle cx="100" cy="160" r="20" fill="#1f2937" stroke="#10b981" strokeWidth="2"/>
                            <circle cx="100" cy="160" r="10" fill="#374151"/>
                            <circle cx="300" cy="160" r="20" fill="#1f2937" stroke="#10b981" strokeWidth="2"/>
                            <circle cx="300" cy="160" r="10" fill="#374151"/>
                            
                            {/* Headlights */}
                            <ellipse cx="340" cy="120" rx="15" ry="8" fill="#fbbf24" opacity="0.8"/>
                            <ellipse cx="60" cy="120" rx="15" ry="8" fill="#ef4444" opacity="0.8"/>
                            
                            {/* Grill */}
                            <rect x="320" y="115" width="20" height="10" fill="#1f2937" stroke="#10b981" strokeWidth="1"/>
                          </g>
                          
                          {/* Gradients */}
                          <defs>
                            <linearGradient id="carGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#1e293b"/>
                              <stop offset="50%" stopColor="#334155"/>
                              <stop offset="100%" stopColor="#1e293b"/>
                            </linearGradient>
                            <linearGradient id="roofGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#1e293b"/>
                              <stop offset="100%" stopColor="#0f172a"/>
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      
                      {/* Floating Particles */}
                      <div className="absolute -top-10 -left-10 w-4 h-4 bg-green-500 rounded-full animate-float-particle opacity-60"></div>
                      <div className="absolute -top-5 -right-8 w-3 h-3 bg-blue-500 rounded-full animate-float-particle-delayed opacity-60"></div>
                      <div className="absolute top-20 left-5 w-2 h-2 bg-purple-500 rounded-full animate-float-particle opacity-60"></div>
                      <div className="absolute bottom-10 -right-5 w-3 h-3 bg-green-500 rounded-full animate-float-particle-delayed opacity-60"></div>
                    </div>
                  </div>

                  {/* Background Vehicle Silhouettes */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <svg viewBox="0 0 400 200" className="w-full h-auto transform scale-110">
                      <path
                        d="M50 120 L80 100 L320 100 L350 120 L350 140 L320 160 L80 160 L50 140 Z"
                        fill="#10b981"
                        opacity="0.1"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Custom Styles for 3D Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotateX(0deg); }
          50% { transform: translateY(-20px) rotateX(5deg); }
        }
        
        @keyframes rotate-slow {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-5px) translateX(-5px); }
          75% { transform: translateY(-15px) translateX(3px); }
        }
        
        @keyframes float-particle-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-8px) translateX(-3px); }
          66% { transform: translateY(-12px) translateX(4px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-rotate-slow {
          animation: rotate-slow 20s linear infinite;
        }
        
        .animate-float-particle {
          animation: float-particle 4s ease-in-out infinite;
        }
        
        .animate-float-particle-delayed {
          animation: float-particle-delayed 5s ease-in-out infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>

      {/* Trust Bar */}
      <section className="bg-gray-800 py-6 sm:py-8 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-2">1000+</div>
              <div className="text-sm sm:text-base text-gray-400">Verified Vehicles</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-2">500+</div>
              <div className="text-sm sm:text-base text-gray-400">Trusted Dealers</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-2">50+</div>
              <div className="text-sm sm:text-base text-gray-400">Live Auctions</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-2">NTSA</div>
              <div className="text-sm sm:text-base text-gray-400">Certified Platform</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-12 sm:py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-green-500 mb-4">Featured Vehicles</h2>
            <p className="text-gray-300 px-4">Discover our handpicked selection of quality vehicles</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {featuredVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
                <div className="aspect-video bg-gray-700">
                  <img
                    src={vehicle.images[0] || '/images/placeholder-car.jpg'}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                    <div className="mb-2 sm:mb-0">
                      <h3 className="text-base sm:text-lg font-semibold text-white">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-gray-400 text-sm">{vehicle.mileage.toLocaleString()} km</p>
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-green-500">
                      {formatCurrency(vehicle.price)}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                    {vehicle.features.slice(0, 3).map((feature: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Button className="w-full text-sm sm:text-base bg-green-600 hover:bg-green-700 text-white" onClick={() => router.push(`/vehicle/${vehicle.id}`)}>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" onClick={() => router.push('/browse')} className="border-green-600 text-green-500 hover:bg-green-600 hover:text-white">
              View All Vehicles
            </Button>
          </div>
        </div>
      </section>

      {/* Active Auctions */}
      <section className="py-12 sm:py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-green-500 mb-4">Live Auctions</h2>
            <p className="text-gray-300">Participate in exciting vehicle auctions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {activeAuctions.map((auction) => (
              <Card key={auction.id} className="overflow-hidden bg-gray-900 border-gray-700">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white">{auction.title}</h3>
                      <p className="text-gray-400 text-sm">{auction.organizer}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-green-500 font-medium">
                        {getTimeRemaining(auction.endDate)}
                      </div>
                      <div className="text-xs text-gray-500">Time remaining</div>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4 line-clamp-2">{auction.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-sm text-gray-400">Buyer Premium:</span>
                      <span className="ml-2 font-medium text-white">{auction.fees.buyerPremium}%</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Registration:</span>
                      <span className="ml-2 font-medium text-white">{formatCurrency(auction.fees.registrationFee)}</span>
                    </div>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => router.push('/auctions')}>
                    Join Auction
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 sm:py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-green-500 mb-4">Our Services</h2>
            <p className="text-gray-300">Complete automotive solutions for buyers and sellers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Verified Listings</h3>
                <p className="text-gray-300">All vehicles are inspected and verified by our team of experts</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Secure Payments</h3>
                <p className="text-gray-300">Safe and secure payment processing with M-Pesa integration</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Legal Support</h3>
                <p className="text-gray-300">Complete documentation and transfer assistance</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-500 mb-4">Ready to Get Started?</h2>
          <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8">
            Join thousands of satisfied buyers and sellers on Motoke
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
              Sign Up Now
            </Button>
            <Button size="lg" variant="outline" className="border-green-600 text-green-500 hover:bg-green-600 hover:text-white w-full sm:w-auto">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
