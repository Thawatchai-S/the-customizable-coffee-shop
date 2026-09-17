export class MasterDataRepository {
  /** @returns {Promise<import('../entities/Ingredient.js').Ingredient[]>} */
  async listIngredients() {
    throw new Error('Not implemented');
  }

  /** @returns {Promise<import('../entities/Size.js').Size[]>} */
  async listSizes() {
    throw new Error('Not implemented');
  }
}
