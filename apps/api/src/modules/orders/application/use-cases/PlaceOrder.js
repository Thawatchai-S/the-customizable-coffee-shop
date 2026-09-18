import { BuildDrink } from '../../../drinks/application/use-cases/BuildDrink.js';
import { InMemoryMasterDataRepository } from '../../../master-data/infrastructure/database/InMemoryMasterDataRepository.js';
import { Order } from '../../domain/entities/Order.js';
import { OrderItem } from '../../domain/entities/OrderItem.js';
import { ValidationError } from '../../../../shared/errors/AppError.js';

export class PlaceOrder {
  /**
   * @param {import('../../../master-data/domain/repositories/MasterDataRepository.js').MasterDataRepository} masterDataRepository
   * @param {import('../../domain/pricing/PricingCalculator.js').PricingCalculator} pricingCalculator
   */
  constructor(masterDataRepository, pricingCalculator) {
    this.masterDataRepository = masterDataRepository;
    this.pricingCalculator = pricingCalculator;
  }

  async execute({ drinks }) {
    const [ingredients, sizes] = await Promise.all([
      this.masterDataRepository.listIngredients(),
      this.masterDataRepository.listSizes(),
    ]);

    // Fetch master data once and reuse it for every drink in the order,
    // instead of BuildDrink re-querying the database per drink.
    const buildDrink = new BuildDrink(new InMemoryMasterDataRepository(ingredients, sizes));

    const issues = [];
    const items = [];

    for (const [index, spec] of drinks.entries()) {
      try {
        const drink = await buildDrink.execute(spec);
        items.push(new OrderItem({ drink, unitPrice: this.pricingCalculator.priceOf(drink) }));
      } catch (err) {
        const detail = err.issues?.length ? err.issues.join('; ') : err.message;
        issues.push(`Drink ${index + 1}: ${detail}`);
      }
    }

    if (issues.length > 0) {
      throw new ValidationError('Invalid order', issues);
    }

    return new Order({ items });
  }
}
