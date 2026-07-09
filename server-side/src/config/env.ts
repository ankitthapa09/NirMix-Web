// Environment Variable Validation

import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  // Node / Server
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5001),
  // Comma-separated list of allowed client origins; each must be a valid URL.
  CLIENT_URL: z
    .string()
    .default("http://localhost:3000,http://127.0.0.1:3000")
    .transform((value) => value.split(",").map((origin) => origin.trim()).filter(Boolean))
    .pipe(z.array(z.url()).min(1)),
  MONGODB_URI: z.string().min(1),
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", z.flattenError(parsed.error).fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
