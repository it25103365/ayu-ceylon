/**
 * Generic in-memory rate limiter for API endpoints.
 * Creates isolated rate limit buckets per route with configurable limits.
 *
 * Usage:
 *   const limiter = createRateLimiter({ maxRequests: 10, windowMs: 15 * 60 * 1000 });
 *   // In your API handler:
 *   const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
 *   if (!limiter.check(ip)) {
 *     return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 *   }
 */

interface RateLimitRecord {
  count: number;
  windowStart: number;
}

interface RateLimiterConfig {
  /** Maximum number of requests allowed within the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
}

export function createRateLimiter(config: RateLimiterConfig) {
  const store = new Map<string, RateLimitRecord>();

  // Periodic cleanup to prevent unbounded memory growth
  // Runs every windowMs to remove expired entries
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store) {
      if (now - record.windowStart > config.windowMs) {
        store.delete(key);
      }
    }
  }, config.windowMs);

  // Allow cleanup interval to not prevent process exit
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return {
    /**
     * Check if the given key (typically an IP address) is within rate limits.
     * Returns true if allowed, false if rate limited.
     * Automatically increments the counter.
     */
    check(key: string): boolean {
      const now = Date.now();
      const record = store.get(key);

      if (!record || now - record.windowStart > config.windowMs) {
        // First request or window expired — start fresh
        store.set(key, { count: 1, windowStart: now });
        return true;
      }

      record.count += 1;
      if (record.count > config.maxRequests) {
        return false;
      }

      return true;
    },
  };
}
