export class Drink {
  constructor({ base, size, customizations = [] }) {
    this.base = base;
    this.size = size;
    this.customizations = customizations; // [{ ingredient, count }]
  }

  // e.g. "Large Coffee, Vanilla, Vanilla, Whipped Cream"
  describe() {
    const parts = [`${this.size.name} ${this.base.name}`];

    for (const { ingredient, count } of this.customizations) {
      for (let i = 0; i < count; i += 1) {
        parts.push(ingredient.name);
      }
    }

    return parts.join(', ');
  }
}
