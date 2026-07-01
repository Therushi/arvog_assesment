import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../models/db.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

async function findUserByEmail(email) {
  const rows = await query(
    `SELECT id, email, password FROM users WHERE email = ? LIMIT 1`,
    [email],
  );
  return rows[0] ?? null;
}

async function login(email, password) {
  const user = await findUserByEmail(email);

  if (!user) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  const token = jwt.sign({ id: user.id, email: user.email }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });

  return {
    token,
    user: { id: user.id, email: user.email },
  };
}

export const authService = { login, findUserByEmail };
