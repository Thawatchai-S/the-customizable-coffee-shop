import { IngredientType } from '../../domain/entities/Ingredient.js';

export class GetMasterData {
  /** @param {import('../../domain/repositories/MasterDataRepository.js').MasterDataRepository} masterDataRepository */
  constructor(masterDataRepository) {
    this.masterDataRepository = masterDataRepository;
  }

  async execute() {
    const [ingredients, sizes] = await Promise.all([
      this.masterDataRepository.listIngredients(),
      this.masterDataRepository.listSizes(),
    ]);

    return {
      baseDrinks: ingredients.filter((i) => i.type === IngredientType.BASE),
      syrups: ingredients.filter((i) => i.type === IngredientType.SYRUP),
      toppings: ingredients.filter((i) => i.type === IngredientType.TOPPING),
      sizes,
    };
  }
}
