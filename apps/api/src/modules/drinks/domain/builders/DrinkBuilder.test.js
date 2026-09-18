import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DrinkBuilder } from './DrinkBuilder.js';
import { IngredientType } from '../../../master-data/domain/entities/Ingredient.js';

const coffee = { id: '1', type: IngredientType.BASE, name: 'Coffee' };
const vanilla = { id: '2', type: IngredientType.SYRUP, name: 'Vanilla' };
const whippedCream = { id: '3', type: IngredientType.TOPPING, name: 'Whipped Cream' };
const large = { id: '4', name: 'Large' };

test('builds a drink with a base, one size, and a customization count', () => {
  const drink = new DrinkBuilder()
    .setBase(coffee)
    .setSize(large)
    .addCustomization(vanilla, 2)
    .addCustomization(whippedCream)
    .build();

  assert.equal(drink.base, coffee);
  assert.equal(drink.size, large);
  assert.deepEqual(drink.customizations, [
    { ingredient: vanilla, count: 2 },
    { ingredient: whippedCream, count: 1 },
  ]);
});

test('repeated addCustomization calls merge into one entry', () => {
  const drink = new DrinkBuilder()
    .setBase(coffee)
    .setSize(large)
    .addCustomization(vanilla)
    .addCustomization(vanilla)
    .build();

  assert.deepEqual(drink.customizations, [{ ingredient: vanilla, count: 2 }]);
});

test('builds a drink with no customizations', () => {
  const drink = new DrinkBuilder().setBase(coffee).setSize(large).build();

  assert.deepEqual(drink.customizations, []);
});

test('rejects a non-base ingredient as the base', () => {
  assert.throws(() => new DrinkBuilder().setBase(vanilla), /not a base drink/);
});

test('rejects a base ingredient as a customization', () => {
  assert.throws(
    () => new DrinkBuilder().setBase(coffee).setSize(large).addCustomization(coffee),
    /not a syrup or topping/,
  );
});

test('rejects a non-positive-integer count', () => {
  assert.throws(() => new DrinkBuilder().addCustomization(vanilla, 0), /positive integer/);
  assert.throws(() => new DrinkBuilder().addCustomization(vanilla, 1.5), /positive integer/);
});

test('requires a base before building', () => {
  assert.throws(() => new DrinkBuilder().setSize(large).build(), /must have a base/);
});

test('requires a size before building', () => {
  assert.throws(() => new DrinkBuilder().setBase(coffee).build(), /must have exactly one size/);
});

test('setSize called twice keeps exactly one size (the last one)', () => {
  const small = { id: '5', name: 'Small' };
  const drink = new DrinkBuilder().setBase(coffee).setSize(small).setSize(large).build();

  assert.equal(drink.size, large);
});

test('describe() expands counts into a repeated, comma-separated string', () => {
  const drink = new DrinkBuilder()
    .setBase(coffee)
    .setSize(large)
    .addCustomization(vanilla, 2)
    .addCustomization(whippedCream)
    .build();

  assert.equal(drink.describe(), 'Large Coffee, Vanilla, Vanilla, Whipped Cream');
});

test('describe() with no customizations', () => {
  const drink = new DrinkBuilder().setBase(coffee).setSize(large).build();

  assert.equal(drink.describe(), 'Large Coffee');
});
