import { z } from "zod";
import 'dotenv/config';

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  throw new Error("Invalid environment variables");
}

export const env = _env.data;

