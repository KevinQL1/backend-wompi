import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionStatus } from '#/domain/entities/Transaction.js';

/**
 * Caso de uso encargado de crear una transacción de pago
 * en estado PENDING antes de llamar a la pasarela (Wompi).
 */
export class CreateTransaction {
  constructor(transactionRepository) {
    if (!transactionRepository) {
      throw new Error('TransactionRepository is required');
    }

    this.transactionRepository = transactionRepository;
  }

  async execute({ customerId, productId, amount }) {
    if (!customerId || !productId || amount <= 0) {
      throw new Error('Invalid transaction data');
    }

    const now = new Date().toISOString();

    const transaction = new Transaction({
      id: uuidv4(),
      customerId,
      productId,
      amount,
      status: TransactionStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    });

    await this.transactionRepository.save(transaction);

    return transaction;
  }
}
