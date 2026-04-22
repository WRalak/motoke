// Simple in-memory rate limiting for development
// In production, use Redis or a dedicated rate limiting service

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds
  maxRequests?: number; // Maximum requests per window
  message?: string; // Custom error message
}

export function createRateLimit(options: RateLimitOptions = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxRequests = 100, // 100 requests per window
    message = 'Too many requests, please try again later.'
  } = options;

  return (identifier: string): { success: boolean; resetTime?: number; message?: string } => {
    const now = Date.now();
    const key = identifier;

    // Get or create rate limit entry
    let entry = rateLimitStore.get(key);

    // Reset if window has passed
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 1,
        resetTime: now + windowMs
      };
      rateLimitStore.set(key, entry);
      return { success: true };
    }

    // Check if limit exceeded
    if (entry.count >= maxRequests) {
      return {
        success: false,
        resetTime: entry.resetTime,
        message
      };
    }

    // Increment count
    entry.count++;
    rateLimitStore.set(key, entry);
    return { success: true };
  };
}

// Rate limiters for different endpoints
export const rateLimiters = {
  // General API rate limit
  api: createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
    message: 'Too many API requests, please try again later.'
  }),

  // Auth endpoints - more restrictive
  auth: createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 auth attempts per 15 minutes
    message: 'Too many authentication attempts, please try again later.'
  }),

  // Vehicle listing - less restrictive
  vehicles: createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 200, // 200 requests per 15 minutes
    message: 'Too many vehicle listing requests, please try again later.'
  }),

  // Auction bidding - very restrictive
  bidding: createRateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 bids per minute
    message: 'Too many bidding attempts, please slow down.'
  }),

  // M-Pesa payments - very restrictive
  payments: createRateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 3, // 3 payment attempts per minute
    message: 'Too many payment attempts, please try again later.'
  })
};

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // Cleanup every 5 minutes

// Helper function to get client identifier
export function getClientIdentifier(request: Request): string {
  // Try to get IP address from various headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  const ip = forwardedFor?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
  
  // For development, use a simple identifier
  if (ip === 'unknown') {
    return 'dev-client';
  }
  
  return ip;
}
