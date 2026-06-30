import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.BACKEND_PORT ?? 3000),
  apiPrefix: process.env.API_PREFIX ?? "/api/v1",
  postgres: {
    host: process.env.POSTGRES_HOST ?? "localhost",
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    db: process.env.POSTGRES_DB ?? "arvog",
    user: process.env.POSTGRES_USER ?? "arvog",
    password: process.env.POSTGRES_PASSWORD ?? "",
  },
  redis: {
    host: process.env.REDIS_HOST ?? "localhost",
    port: Number(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD || undefined,
  },
};
