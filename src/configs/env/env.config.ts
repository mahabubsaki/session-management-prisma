import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV!,
  port: process.env.PORT!,
  dbUri: process.env.DATABASE_URL!,
  sessionSecret: process.env.SESSION_SECRET!,
  cookieExpiration: +(process.env.COOKIE_EXPIRATION!),
  jwtSecret: process.env.JWT_SECRET!,
  cookieSecret: process.env.COOKIE_SECRET!,
  redisUrl: process.env.REDIS_URL!,
  redisExpiration: +(process.env.REDIS_EXPIRATION!),
};