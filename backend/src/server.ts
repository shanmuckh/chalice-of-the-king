import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { registerSocketHandlers } from './socketHandlers';
import { createSocketRateLimiter } from './middleware/rateLimiter';
import { createErrorHandler } from './middleware/errorHandler';
import logger from './utils/logger';
import { validateEnv, getEnv } from './config/env';
import { redisClient } from './database/redis';

async function startServer() {
  // Validate environment variables before starting
  validateEnv();
  const env = getEnv();

  // Connect to Redis
  try {
    await redisClient.connect();
    logger.info('✅ Redis connected successfully');
  } catch (error) {
    logger.error('❌ Failed to connect to Redis:', error);
    process.exit(1);
  }


  const app = express();
  const httpServer = createServer(app);

  // FRONTEND_URL may be a comma-separated list (e.g. production + preview URLs)
  const allowedOrigins = env.FRONTEND_URL.split(',').map((o) => o.trim()).filter(Boolean);
  const allowedOrigin = allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins;

  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // Enable WebSocket compression for bandwidth optimization
    perMessageDeflate: {
      threshold: 1024, // Only compress messages larger than 1KB
    },
    // Connection optimization
    pingTimeout: 60000, // 60 seconds
    pingInterval: 25000, // 25 seconds
    // Upgrade timeout
    upgradeTimeout: 10000, // 10 seconds
    // Maximum buffer size
    maxHttpBufferSize: 1e6, // 1MB
  });

  // Set up Redis adapter for Socket.IO (enables multi-instance support)
  try {
    const pubClient = createClient({ url: env.REDIS_URL });
    const subClient = pubClient.duplicate();

    await Promise.all([
      pubClient.connect(),
      subClient.connect(),
    ]);

    io.adapter(createAdapter(pubClient, subClient));
    logger.info('✅ Socket.IO Redis adapter configured');
  } catch (error) {
    logger.error('❌ Failed to set up Redis adapter:', error);
    // Continue without adapter for development
    logger.warn('⚠️  Running without Redis adapter (single instance only)');
  }

  // Apply rate limiting
  const rateLimiter = createSocketRateLimiter({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
    // WebRTC ICE candidates and latency pings arrive in bursts by design
    exemptEvents: ['voice-offer', 'voice-answer', 'voice-candidate', 'latency_ping'],
  });
  io.use(rateLimiter);

  // Apply error handling middleware
  const errorHandler = createErrorHandler();
  io.use(errorHandler);
  io.engine.on("connection_error", (err) => {
    logger.error("Connection error:", err);
  });

  registerSocketHandlers(io);

  // Health check endpoint
  app.get('/health', async (_req, res) => {
    const redisHealth = await redisClient.healthCheck();
    res.status(redisHealth.status === 'healthy' ? 200 : 503).json({
      status: 'ok',
      redis: redisHealth,
      uptime: process.uptime(),
    });
  });

  httpServer.listen(env.PORT, () => {
    logger.info(`🚀 Server listening on http://localhost:${env.PORT}`);
    logger.info(`🌐 CORS origin(s) allowed: ${allowedOrigins.join(', ')}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully...`);
    io.close();
    await redisClient.disconnect();
    httpServer.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
    // Force exit if connections refuse to close
    setTimeout(() => process.exit(0), 5000).unref();
  };
  process.once('SIGTERM', () => void shutdown('SIGTERM'));
  process.once('SIGINT', () => void shutdown('SIGINT'));
}

export default startServer;
