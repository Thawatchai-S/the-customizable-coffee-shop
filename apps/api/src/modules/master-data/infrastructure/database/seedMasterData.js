import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { sql } from 'drizzle-orm';
import { db, pool } from '../../../../shared/database/client.js';
import { logger } from '../../../../shared/logger/index.js';
import { ingredients, sizes } from './schema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_FILE = path.join(__dirname, 'data', 'master-data.seed.json');

export async function seedMasterData() {
  const raw = await readFile(SEED_FILE, 'utf-8');
  const data = JSON.parse(raw);

  if (data.ingredients?.length) {
    await db
      .insert(ingredients)
      .values(data.ingredients)
      .onConflictDoUpdate({
        target: [ingredients.type, ingredients.name],
        set: { sortOrder: sql`excluded.sort_order` },
      });
  }

  if (data.sizes?.length) {
    await db
      .insert(sizes)
      .values(data.sizes)
      .onConflictDoUpdate({
        target: sizes.name,
        set: { sortOrder: sql`excluded.sort_order` },
      });
  }

  logger.info(
    `Seeded master data: ${data.ingredients?.length ?? 0} ingredients, ${data.sizes?.length ?? 0} sizes`,
  );
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
  seedMasterData()
    .catch((err) => {
      logger.error(err);
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}
