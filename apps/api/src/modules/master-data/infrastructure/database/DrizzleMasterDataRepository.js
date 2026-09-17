import { asc } from 'drizzle-orm';
import { db } from '../../../../shared/database/client.js';
import { MasterDataRepository } from '../../domain/repositories/MasterDataRepository.js';
import { Ingredient } from '../../domain/entities/Ingredient.js';
import { Size } from '../../domain/entities/Size.js';
import { ingredients, sizes } from './schema.js';

export class DrizzleMasterDataRepository extends MasterDataRepository {
  async listIngredients() {
    const rows = await db
      .select()
      .from(ingredients)
      .orderBy(asc(ingredients.type), asc(ingredients.sortOrder));

    return rows.map((row) => new Ingredient(row));
  }

  async listSizes() {
    const rows = await db.select().from(sizes).orderBy(asc(sizes.sortOrder));

    return rows.map((row) => new Size(row));
  }
}
