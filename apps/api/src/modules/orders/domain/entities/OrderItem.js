export class OrderItem {
  constructor({ drink, unitPrice }) {
    this.drink = drink;
    this.unitPrice = unitPrice;
  }

  get description() {
    return this.drink.describe();
  }
}
