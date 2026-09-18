import * as v from 'valibot';

export const NonEmptyString = v.pipe(v.string(), v.trim(), v.minLength(1));

const CustomizationSchema = v.object({
  name: NonEmptyString,
  count: v.pipe(v.number(), v.integer(), v.minValue(1)),
});

// Shared by the single-drink build endpoint and the order endpoint (an
// order is just "one or more of these").
export const DrinkRequestSchema = v.object({
  base: NonEmptyString,
  size: NonEmptyString,
  customizations: v.optional(v.array(CustomizationSchema), []),
});
