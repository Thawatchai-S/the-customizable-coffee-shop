import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/shared/database/schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/coffee_shop',
  },
});
