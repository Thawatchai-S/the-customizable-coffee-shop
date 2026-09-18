import * as v from 'valibot';
import { PlaceOrder } from '../../application/use-cases/PlaceOrder.js';
import { PlaceholderPricingCalculator } from '../pricing/PlaceholderPricingCalculator.js';
import { DrizzleMasterDataRepository } from '../../../master-data/infrastructure/database/DrizzleMasterDataRepository.js';
import { DrinkRequestSchema } from '../../../drinks/infrastructure/http/drinkRequestSchema.js';
import { ValidationError } from '../../../../shared/errors/AppError.js';

const placeOrder = new PlaceOrder(new DrizzleMasterDataRepository(), new PlaceholderPricingCalculator());

const PlaceOrderRequestSchema = v.object({
  drinks: v.pipe(
    v.array(DrinkRequestSchema),
    v.minLength(1, 'An order must contain at least one drink'),
  ),
});

export async function placeOrderHandler(req, res) {
  const parsed = v.safeParse(PlaceOrderRequestSchema, req.body);

  if (!parsed.success) {
    throw new ValidationError(
      'Invalid order request',
      parsed.issues.map((issue) => issue.message),
    );
  }

  const order = await placeOrder.execute(parsed.output);

  res.status(201).json({
    items: order.items.map((item) => ({
      base: item.drink.base,
      size: item.drink.size,
      customizations: item.drink.customizations,
      description: item.description,
      price: item.unitPrice,
    })),
    grandTotal: order.grandTotal,
  });
}
