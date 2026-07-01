import { query } from "../models/db.js";
import { logger } from "../utils/logger.js";

export async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id         VARCHAR(36)  NOT NULL PRIMARY KEY,
      email      VARCHAR(255) NOT NULL UNIQUE,
      password   VARCHAR(255) NOT NULL,
      created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS categories (
      id         VARCHAR(36)  NOT NULL PRIMARY KEY,
      name       VARCHAR(255) NOT NULL,
      created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS products (
      id          VARCHAR(36)    NOT NULL PRIMARY KEY,
      name        VARCHAR(255)   NOT NULL,
      image       VARCHAR(500)   DEFAULT NULL,
      price       DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
      category_id VARCHAR(36)    NOT NULL,
      created_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_product_category FOREIGN KEY (category_id)
        REFERENCES categories(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  logger.info(`[db] tables initialized`);
}
