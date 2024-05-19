import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import * as env from './config.json'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
  driver: 'turso',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.TURSO_DATABASE_URL!,
    authToken: env.TURSO_AUTH_TOKEN,
  },
})