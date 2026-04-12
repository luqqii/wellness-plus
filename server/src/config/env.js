import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file (if present)
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Define the environment schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform(Number),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/wellness-plus'),
  JWT_SECRET: z.string().default('dev_secret_key_wellness_plus_2026'),
  JWT_EXPIRES_IN: z.string().default('7d'),
   OPENAI_API_KEY: z.string().optional(),
   GEMINI_API_KEY: z.string().optional(),
   REDIS_URI: z.string().optional(),
 });

// Parse and validate process.env
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:\n', _env.error.format());
  throw new Error('Invalid environment variables');
}

export default _env.data;
