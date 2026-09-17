export const IngredientType = Object.freeze({
  BASE: 'base',
  SYRUP: 'syrup',
  TOPPING: 'topping',
});

export class Ingredient {
  constructor({ id, type, name, sortOrder }) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.sortOrder = sortOrder;
  }
}
