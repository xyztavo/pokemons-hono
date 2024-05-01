import 'dotenv/config';
import type { Config } from 'drizzle-kit';
import * as env from './config.json'

export default {
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
  driver: 'turso',
  dbCredentials: {
    url: env.TURSO_DATABASE_URL!,
    authToken: env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;