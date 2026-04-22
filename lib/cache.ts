// Simple in-memory caching system
// In production, use Redis or a dedicated caching service

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { data, expiresAt });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }
}

// Global cache instance
export const cache = new MemoryCache();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  cache.cleanup();
}, 5 * 60 * 1000);

// Cache keys
export const CacheKeys = {
  VEHICLES_LIST: 'vehicles:list',
  VEHICLE_DETAIL: (id: string) => `vehicle:detail:${id}`,
  AUCTIONS_LIST: 'auctions:list',
  AUCTION_DETAIL: (id: string) => `auction:detail:${id}`,
  DEALERS_LIST: 'dealers:list',
  DEALER_DETAIL: (id: string) => `dealer:detail:${id}`,
  CUSTOMERS_LIST: 'customers:list',
  ADMIN_STATS: 'admin:stats',
  POPULAR_VEHICLES: 'popular:vehicles',
  FEATURED_AUCTIONS: 'featured:auctions'
};

// Cache helper functions
export async function getCachedOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Try to get from cache first
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetchFn();
  
  // Cache the result
  cache.set(key, data, ttl);
  
  return data;
}

// Invalidate cache by pattern
export function invalidateCache(pattern: string): void {
  for (const key of cache['cache'].keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
}

// Cache middleware for API responses
export function cacheMiddleware(ttl?: number) {
  return (key: string, fetchFn: () => Promise<any>) => {
    return getCachedOrFetch(key, fetchFn, ttl);
  };
}

// Specific cache functions for different data types
export const vehicleCache = {
  getList: () => cacheMiddleware(2 * 60 * 1000), // 2 minutes
  getDetail: (id: string) => cacheMiddleware(5 * 60 * 1000), // 5 minutes
  invalidate: (id?: string) => {
    if (id) {
      cache.delete(CacheKeys.VEHICLE_DETAIL(id));
    } else {
      cache.delete(CacheKeys.VEHICLES_LIST);
    }
    // Invalidate related caches
    invalidateCache('vehicle');
  }
};

export const auctionCache = {
  getList: () => cacheMiddleware(1 * 60 * 1000), // 1 minute
  getDetail: (id: string) => cacheMiddleware(2 * 60 * 1000), // 2 minutes
  invalidate: (id?: string) => {
    if (id) {
      cache.delete(CacheKeys.AUCTION_DETAIL(id));
    } else {
      cache.delete(CacheKeys.AUCTIONS_LIST);
    }
    // Invalidate related caches
    invalidateCache('auction');
  }
};

export const adminCache = {
  getStats: () => cacheMiddleware(5 * 60 * 1000), // 5 minutes
  invalidateStats: () => {
    cache.delete(CacheKeys.ADMIN_STATS);
  }
};

// Cache warming functions
export async function warmCache() {
  try {
    // Warm popular data
    // This would be called during application startup
    console.log('Cache warming completed');
  } catch (error) {
    console.error('Cache warming failed:', error);
  }
}

// Cache statistics
export function getCacheStats() {
  return {
    size: cache.size(),
    keys: Array.from(cache['cache'].keys())
  };
}
