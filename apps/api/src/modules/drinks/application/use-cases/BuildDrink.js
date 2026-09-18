import { IngredientType } from '../../../master-data/domain/entities/Ingredient.js';
import { DrinkBuilder } from '../../domain/builders/DrinkBuilder.js';
import { ValidationError } from '../../../../shared/errors/AppError.js';

function findByName(items, name) {
  const target = name.trim().toLowerCase();
  return items.find((item) => item.name.toLowerCase() === target);
}

export class BuildDrink {
  /** @param {import('../../../master-data/domain/repositories/MasterDataRepository.js').MasterDataRepository} masterDataRepository */
  constructor(masterDataRepository) {
    this.masterDataRepository = masterDataRepository;
  }

  async execute({ base, size, customizations = [] }) {
    const [ingredients, sizes] = await Promise.all([
      this.masterDataRepository.listIngredients(),
      this.masterDataRepository.listSizes(),
    ]);

    const issues = [];
    const builder = new DrinkBuilder();

    const baseIngredient = findByName(ingredients, base);
    if (!baseIngredient || baseIngredient.type !== IngredientType.BASE) {
      issues.push(`"${base}" is not a valid base drink`);
    } else {
      builder.setBase(baseIngredient);
    }

    const sizeEntity = findByName(sizes, size);
    if (!sizeEntity) {
      issues.push(`"${size}" is not a valid size`);
    } else {
      builder.setSize(sizeEntity);
    }

    for (const { name, count } of customizations) {
      const ingredient = findByName(ingredients, name);
      const isCustomization =
        ingredient &&
        (ingredient.type === IngredientType.SYRUP || ingredient.type === IngredientType.TOPPING);

      if (!isCustomization) {
        issues.push(`"${name}" is not a valid syrup or topping`);
        continue;
      }

      if (!Number.isInteger(count) || count < 1) {
        issues.push(`Count for "${name}" must be a positive integer`);
        continue;
      }

      builder.addCustomization(ingredient, count);
    }

    if (issues.length > 0) {
      throw new ValidationError('Invalid drink', issues);
    }

    return builder.build();
  }
}
