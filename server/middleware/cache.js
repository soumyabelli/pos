import { redisClient } from '../server.js';

/**
 * Cache Middleware - Caches GET requests for products and categories
 * Invalidates on POST/PUT/DELETE operations
 */
export const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    try {
      const key = `cache:${req.originalUrl}`;
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        console.log(`✅ Cache HIT for ${req.originalUrl}`);
        return res.json(JSON.parse(cachedData));
      }

      // Store original res.json
      const originalJson = res.json.bind(res);

      // Override res.json to cache response
      res.json = function(data) {
        try {
          redisClient.setEx(key, duration, JSON.stringify(data)).catch(err =>
            console.error('Cache set error:', err)
          );
        } catch (err) {
          console.error('Cache middleware error:', err);
        }
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

/**
 * Cache Invalidation - Clears cache when data is modified
 */
export const invalidateCache = async (pattern) => {
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
