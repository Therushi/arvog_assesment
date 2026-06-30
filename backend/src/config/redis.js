import { createClient } from "redis";
import { env } from "./env.js";

export const redisClient = createClient({
  socket: { host: env.redis.host, port: env.redis.port },
  password: env.redis.password,
});

redisClient.on("error", (err) => console.log(`Redis Connection error: ${err}`));

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log(`Redis connected`);
  }
}
