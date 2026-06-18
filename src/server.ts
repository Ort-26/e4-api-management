import app from './app';
import { config } from './config';

const server = app.listen(config.port, () => {
  console.log(`[server] Running in ${config.env} mode on port ${config.port}`);
  console.log(`[server] API available at http://localhost:${config.port}${config.apiPrefix}`);
});

process.on('SIGTERM', () => {
  console.log('[server] SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('[server] Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[server] SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('[server] Process terminated');
    process.exit(0);
  });
});
