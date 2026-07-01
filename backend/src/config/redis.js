import IORedis from "ioredis";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

export const redisConnection = new IORedis({
  host: env.redis.host,
  port: env.redis.port,
  password: env.redis.password,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

redisConnection.on("connect", () => logger.info("[redis] connected"));
redisConnection.on("error", (err) =>
  logger.error({ err }, "[redis] connection error"),
);
