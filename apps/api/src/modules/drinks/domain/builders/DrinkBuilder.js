import { IngredientType } from '../../../master-data/domain/entities/Ingredient.js';
import { Drink } from '../entities/Drink.js';

const CUSTOMIZATION_TYPES = new Set([IngredientType.SYRUP, IngredientType.TOPPING]);

// Builder pattern: assembles a Drink one piece at a time (base, one size, any
// number of syrup/topping customizations) without needing a subclass per
// ingredient or combination of ingredients. Customizations are tracked as
// { ingredient, count } so repeated additions (e.g. a double vanilla) merge
// into a single entry instead of duplicating the ingredient in memory.
export class DrinkBuilder {
  #base = null;
  #size = null;
  #customizations = [];

  setBase(ingredient) {
    if (ingredient.type !== IngredientType.BASE) {
      throw new Error(`"${ingredient.name}" is not a base drink`);
    }
    this.#base = ingredient;
    return this;
  }

  setSize(size) {
    this.#size = size;
    return this;
  }

  addCustomization(ingredient, count = 1) {
    if (!CUSTOMIZATION_TYPES.has(ingredient.type)) {
      throw new Error(`"${ingredient.name}" is not a syrup or topping`);
    }
    if (!Number.isInteger(count) || count < 1) {
      throw new Error(`Count for "${ingredient.name}" must be a positive integer`);
    }

    const existing = this.#customizations.find((c) => c.ingredient.id === ingredient.id);
    if (existing) {
      existing.count += count;
    } else {
      this.#customizations.push({ ingredient, count });
    }

    return this;
  }

  build() {
    if (!this.#base) {
      throw new Error('A drink must have a base');
    }
    if (!this.#size) {
      throw new Error('A drink must have exactly one size');
    }

    return new Drink({
      base: this.#base,
      size: this.#size,
      customizations: this.#customizations.map((c) => ({ ...c })),
    });
  }
}
