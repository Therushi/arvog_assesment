import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { connectPostgres } from "./config/db.js";
import { connectRedis } from "./config/redis.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get(`${env.apiPrefix}/health`, (req, res) => {
  res.status(200).json({
    success: true,
    data: { status: "ok", uptime: process.uptime() },
    message: "Server online",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    code: 404,
  });
});

app.use((err, req, res, next) => {
  console.error("[error]", err);
  res.status(err.status ?? 500).json({
    success: false,
    error: err.message ?? "Internal Server Error",
    code: err.status ?? 500,
  });
});

async function bootstrap() {
  try {
    await connectPostgres();
    await connectRedis();
    app.listen(env.port, () => {
      console.log(
        `[server] listening on http://localhost:${env.port}${env.apiPrefix}`,
      );
    });
  } catch (err) {
    console.error("[bootstrap] failed to start:", err);
    process.exit(1);
  }
}

bootstrap();
