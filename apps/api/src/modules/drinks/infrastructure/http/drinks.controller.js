import * as v from 'valibot';
import { BuildDrink } from '../../application/use-cases/BuildDrink.js';
import { DrizzleMasterDataRepository } from '../../../master-data/infrastructure/database/DrizzleMasterDataRepository.js';
import { ValidationError } from '../../../../shared/errors/AppError.js';
import { DrinkRequestSchema } from './drinkRequestSchema.js';

const buildDrink = new BuildDrink(new DrizzleMasterDataRepository());

export async function buildDrinkHandler(req, res) {
  const parsed = v.safeParse(DrinkRequestSchema, req.body);

  if (!parsed.success) {
    throw new ValidationError(
      'Invalid drink request',
      parsed.issues.map((issue) => issue.message),
    );
  }

  const drink = await buildDrink.execute(parsed.output);

  res.status(201).json({
    base: drink.base,
    size: drink.size,
    customizations: drink.customizations,
    description: drink.describe(),
  });
}
