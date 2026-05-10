import { redisClient, redisConnected } from '../server.js';

/**
 * Cache Middleware - Caches GET requests for products and categories.
 * Gracefully skips all caching if Redis is not available.
 */
export const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    // Skip cache entirely if Redis is not connected
    if (!redisConnected || req.method !== 'GET') {
      return next();
    }

    try {
      const key = `cache:${req.originalUrl}`;
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        console.log(`✅ Cache HIT for ${req.originalUrl}`);
        return res.json(JSON.parse(cachedData));
      }

      // Override res.json to cache the response on the way out
      const originalJson = res.json.bind(res);
      res.json = function (data) {
        redisClient
          .setEx(key, duration, JSON.stringify(data))
          .catch((err) => console.error('Cache set error:', err));
        return originalJson(data);
      };

      next();
    } catch (error) {
      // Redis error mid-request — just skip cache and serve normally
      console.warn('Cache middleware skipped:', error.message);
      next();
    }
  };
};

/**
 * Cache Invalidation - Clears cache when data is modified.
 * No-op if Redis is not connected.
 */
export const invalidateCache = async (pattern) => {
  if (!redisConnected) return;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`🗑️  Cache invalidated: ${pattern} (${keys.length} keys)`);
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
};
