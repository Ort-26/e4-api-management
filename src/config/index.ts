import dotenv from 'dotenv';

dotenv.config();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ?? ['*'];
const hasWildcardOrigin = allowedOrigins.includes('*');

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '2020', 10),
  apiPrefix: process.env.API_PREFIX ?? '/api/v1',
  allowedOrigins,
  corsCredentials: hasWildcardOrigin
    ? false
    : (process.env.CORS_CREDENTIALS ?? 'true') === 'true',
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '2021', 10),
    name: process.env.DB_NAME ?? 'e4-support-db',
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    schema: process.env.DB_SCHEMA ?? 'public',
    logging: process.env.DB_LOGGING === 'true',
  },
  auth: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret',
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
    accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    accessTokenCookieName: process.env.JWT_ACCESS_COOKIE_NAME ?? 'accessToken',
    refreshTokenCookieName: process.env.JWT_REFRESH_COOKIE_NAME ?? 'refreshToken',
    cookieSecure: process.env.JWT_COOKIE_SECURE === 'true',
    cookieDomain: process.env.JWT_COOKIE_DOMAIN,
    cookieSameSite: (process.env.JWT_COOKIE_SAMESITE ?? 'lax') as | 'lax' | 'strict' | 'none',
  },
};
