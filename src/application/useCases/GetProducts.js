/*
 * Este caso de uso representa una acción del sistema:
 * "Obtener todos los productos disponibles"
 *
 * No sabe:
 * - De HTTP
 * - De DynamoDB
 * - De AWS
 *
 * Solo conoce un ProductRepository (puerto).
 */

export class GetProducts {
  constructor(productRepository) {
    if (!productRepository) {
      throw new Error('ProductRepository is required')
    }

    this.productRepository = productRepository
  }

  async execute() {
    return this.productRepository.findAll()
  }
}
