export class Order {
  constructor({ items }) {
    this.items = items;
  }

  get grandTotal() {
    return this.items.reduce((total, item) => total + item.unitPrice, 0);
  }
}
