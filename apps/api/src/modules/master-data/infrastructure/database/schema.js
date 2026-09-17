import {
  pgTable,
  uuid,
  text,
  integer,
  pgEnum,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const ingredientTypeEnum = pgEnum('ingredient_type', [
  'base',
  'syrup',
  'topping',
]);

export const ingredients = pgTable(
  'ingredients',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    type: ingredientTypeEnum('type').notNull(),
    name: text('name').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex('ingredients_type_name_unique').on(table.type, table.name)],
);

export const sizes = pgTable('sizes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
