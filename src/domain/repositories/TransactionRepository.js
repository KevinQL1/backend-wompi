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

export class TransactionRepository {
    async findAll() {
        throw new Error('Method not implemented')
    }

    async findById(id) {
        throw new Error('Method not implemented');
    }

    async save(transaction) {
        throw new Error('Method not implemented');
    }

    async update(transaction) {
        throw new Error('Method not implemented');
    }
}
