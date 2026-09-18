import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PlaceOrder } from './PlaceOrder.js';
import { MasterDataRepository } from '../../../master-data/domain/repositories/MasterDataRepository.js';
import { IngredientType } from '../../../master-data/domain/entities/Ingredient.js';

const ingredients = [
  { id: 'base-coffee', type: IngredientType.BASE, name: 'Coffee' },
  { id: 'base-tea', type: IngredientType.BASE, name: 'Tea' },
  { id: 'syrup-vanilla', type: IngredientType.SYRUP, name: 'Vanilla' },
  { id: 'topping-whipped-cream', type: IngredientType.TOPPING, name: 'Whipped Cream' },
];
const sizes = [
  { id: 'size-small', name: 'Small' },
  { id: 'size-large', name: 'Large' },
];

class FakeMasterDataRepository extends MasterDataRepository {
  async listIngredients() {
    return ingredients;
  }

  async listSizes() {
    return sizes;
  }
}

const zeroPricing = { priceOf: () => 0 };

test('places an order with multiple drinks and returns a receipt with a grand total', async () => {
  const placeOrder = new PlaceOrder(new FakeMasterDataRepository(), zeroPricing);

  const order = await placeOrder.execute({
    drinks: [
      { base: 'Coffee', size: 'Large', customizations: [{ name: 'Vanilla', count: 2 }] },
      { base: 'Tea', size: 'Small', customizations: [{ name: 'Whipped Cream', count: 1 }] },
    ],
  });

  assert.equal(order.items.length, 2);
  assert.equal(order.items[0].description, 'Large Coffee, Vanilla, Vanilla');
  assert.equal(order.items[1].description, 'Small Tea, Whipped Cream');
  assert.equal(order.grandTotal, 0);
});

test('sums non-zero unit prices into the grand total', async () => {
  const flatRatePricing = { priceOf: () => 2.5 };
  const placeOrder = new PlaceOrder(new FakeMasterDataRepository(), flatRatePricing);

  const order = await placeOrder.execute({
    drinks: [
      { base: 'Coffee', size: 'Large' },
      { base: 'Tea', size: 'Small' },
    ],
  });

  assert.equal(order.grandTotal, 5);
});

test('rejects the whole order and reports every invalid drink by position', async () => {
  const placeOrder = new PlaceOrder(new FakeMasterDataRepository(), zeroPricing);

  await assert.rejects(
    () =>
      placeOrder.execute({
        drinks: [
          { base: 'Coffee', size: 'Large' },
          { base: 'Espresso', size: 'Large' },
          { base: 'Tea', size: 'Huge' },
        ],
      }),
    (err) => {
      assert.equal(err.name, 'ValidationError');
      assert.match(err.issues[0], /Drink 2:.*Espresso/);
      assert.match(err.issues[1], /Drink 3:.*Huge/);
      return true;
    },
  );
});
