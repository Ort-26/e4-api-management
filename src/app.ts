import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config';
import { requestLogger } from './middleware/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import router from './routes';
import cookieParser from 'cookie-parser';

const app: Application = express();

// Security headers
app.use(helmet());

// Cookie parser
app.use(cookieParser());

// CORS
app.use(cors({
    origin: config.allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: config.corsCredentials,
  }));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// API routes
app.use(config.apiPrefix, router);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
