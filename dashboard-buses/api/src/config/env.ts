import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),

  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),

  TRACKING_USER: z.string(),
  TRACKING_PASSWORD: z.string(),

  MASGPS_TRACKER_LIST_URL: z.string().url(),
  MASGPS_TRACKER_LIST_SESSION_KEY: z.string(),
  MASGPS_TRACKER_LIST_ORIGIN: z.string(), // si no es URL estricta, quita .url()
  MASGPS_GET_STATE_URL: z.string(),

  CENTINELA_TRANSMISION_URL: z.string().url(),
  CENTINELA_TRANSMISION_BEARER: z.string()
});

export const env = envSchema.parse(process.env);
