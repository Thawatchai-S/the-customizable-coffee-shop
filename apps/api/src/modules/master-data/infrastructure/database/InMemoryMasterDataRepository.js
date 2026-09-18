import { MasterDataRepository } from '../../domain/repositories/MasterDataRepository.js';

// Wraps already-fetched master data behind the same repository interface,
// so a use-case that needs to build several drinks (e.g. placing an order)
// can fetch ingredients/sizes once and reuse them, instead of re-querying
// the database for every drink.
export class InMemoryMasterDataRepository extends MasterDataRepository {
  constructor(ingredients, sizes) {
    super();
    this.ingredients = ingredients;
    this.sizes = sizes;
  }

  async listIngredients() {
    return this.ingredients;
  }

  async listSizes() {
    return this.sizes;
  }
}
