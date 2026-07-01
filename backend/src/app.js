import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";
import { apiRouter } from "./routes/index.js";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Pipe HTTP access logs through pino.
app.use(
  morgan("tiny", {
    stream: { write: (msg) => logger.info(msg.trim()) },
  }),
);

app.use(env.apiPrefix, apiRouter);

// 404 + centralized error handler must be registered last.
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };
