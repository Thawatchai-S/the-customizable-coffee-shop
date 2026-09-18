import { PricingCalculator } from '../../domain/pricing/PricingCalculator.js';

// Pricing rules haven't been defined yet (Sprint 2). Every drink prices at
// 0 for now; swap this implementation for a real one once the rules land —
// Order/OrderItem and the receipt shape won't need to change.
export class PlaceholderPricingCalculator extends PricingCalculator {
  priceOf() {
    return 0;
  }
}
