import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 8080,
  jwtSecret: process.env.JWT_SECRET || 'dev-super-secret',
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

