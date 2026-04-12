import Redis from 'ioredis';
import env from '../config/env.js';

let redisClient = null;
let redisReady = false;

if (env.REDIS_URI) {
  try {
    redisClient = new Redis(env.REDIS_URI, {
      lazyConnect: true,
      connectTimeout: 3000,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    });
    redisClient.on('ready', () => {
      redisReady = true;
      console.log('[Cache] Redis connected ✅');
    });
    redisClient.on('error', () => {
      redisReady = false; // Silently disable caching on error
    });
    redisClient.connect().catch(() => {
      redisReady = false;
    });
  } catch (e) {
    redisClient = null;
  }
}

/**
 * Express middleware to intercept and cache GET responses via Redis.
 * Gracefully falls through (no-op) when Redis is unavailable.
 */
export const cacheRoute = (durationSeconds = 300) => async (req, res, next) => {
  // Skip caching if not a GET, or Redis not ready
  if (req.method !== 'GET' || !redisClient || !redisReady) {
    return next();
  }

  const key = `__req__${req.originalUrl || req.url}__usr__${req.user?._id || 'anon'}`;

  try {
    const cached = await redisClient.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
  } catch {
    return next(); // Redis read error → skip cache
  }

  // Intercept the response to store in cache
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    redisClient.set(key, JSON.stringify(body), 'EX', durationSeconds).catch(() => {});
    return originalJson(body);
  };

  next();
};
