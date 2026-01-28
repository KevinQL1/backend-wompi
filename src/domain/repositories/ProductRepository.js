/*
 *
 * Este archivo define un CONTRATO del dominio.
 * NO contiene lógica ni implementación técnica.
 *
 * En Arquitectura Hexagonal:
 * - El dominio define QUÉ necesita
 * - La infraestructura define CÓMO se hace
 *
 */

export class ProductRepository {
  async findAll() {
    throw new Error('Method not implemented')
  }

  async findById(productId) {
    throw new Error('Method not implemented')
  }

  async save(product) {
    throw new Error('Method not implemented')
  }

  async update(product) {
    throw new Error('Method not implemented')
  }
}
