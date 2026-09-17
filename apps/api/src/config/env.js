import * as v from 'valibot';

const EnvSchema = v.object({
  NODE_ENV: v.optional(
    v.picklist(['development', 'test', 'production']),
    'development',
  ),
  PORT: v.optional(
    v.pipe(v.string(), v.transform(Number), v.number(), v.integer()),
    '3000',
  ),
  LOG_LEVEL: v.optional(v.string(), 'info'),
  DATABASE_URL: v.optional(
    v.string(),
    'postgres://postgres:postgres@localhost:5432/coffee_shop',
  ),
});

const parsed = v.safeParse(EnvSchema, process.env);

if (!parsed.success) {
  const issues = parsed.issues
    .map((issue) => `${issue.path?.[0]?.key ?? '?'}: ${issue.message}`)
    .join(', ');
  throw new Error(`Invalid environment configuration: ${issues}`);
}

export const env = parsed.output;
