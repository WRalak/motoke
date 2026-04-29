import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*',
      },
      {
        source: '/api/vehicles/:path*',
        destination: '/api/vehicles/:path*',
      },
      {
        source: '/api/auctions/:path*',
        destination: '/api/auctions/:path*',
      },
    ];
  },
};

export default nextConfig;
