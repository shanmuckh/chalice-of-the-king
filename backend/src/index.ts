// Load .env before any other module reads process.env (the logger reads it at import time)
import 'dotenv/config';
import startServer from './server';
import logger from './utils/logger';

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection:', reason);
});

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
