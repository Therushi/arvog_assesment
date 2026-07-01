import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.BACKEND_PORT ?? 3000),
  apiPrefix: process.env.API_PREFIX ?? "/api/v1",
  uploadDir: process.env.UPLOAD_DIR ?? "uploads",
  mysql: {
    host: process.env.MYSQL_HOST ?? "localhost",
    port: Number(process.env.MYSQL_PORT ?? 3306),
    db: process.env.MYSQL_DATABASE ?? "arvog",
    user: process.env.MYSQL_USER ?? "arvog",
    password: process.env.MYSQL_PASSWORD ?? "",
  },
  redis: {
    host: process.env.REDIS_HOST ?? "localhost",
    port: Number(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? "change-me-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
  },
};
