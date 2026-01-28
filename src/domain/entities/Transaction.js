/*
 * Representa una transacción de pago dentro del dominio.
 * Contiene reglas de negocio y control de estados.
 */

export const TransactionStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  DECLINED: 'DECLINED',
};

export class Transaction {
  constructor({
    id,
    productId,
    customerId,
    amount,
    status = TransactionStatus.PENDING,
    wompiTransactionId = null,
    createdAt,
    updatedAt,
  }) {
    if (!id) throw new Error('Transaction must have an id');
    if (!productId) throw new Error('Transaction must have a productId');
    if (!customerId) throw new Error('Transaction must have a customerId');
    if (amount <= 0) throw new Error('Transaction amount must be greater than 0');
    if (!createdAt || !updatedAt) {
      throw new Error('Transaction must have timestamps');
    }

    this.id = id;
    this.productId = productId;
    this.customerId = customerId;
    this.amount = amount;
    this.status = status;
    this.wompiTransactionId = wompiTransactionId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  approve(wompiTransactionId) {
    if (this.status !== TransactionStatus.PENDING) {
      throw new Error('Only pending transactions can be approved');
    }

    this.status = TransactionStatus.APPROVED;
    this.wompiTransactionId = wompiTransactionId;
    this.updatedAt = new Date().toISOString();
  }

  decline() {
    if (this.status !== TransactionStatus.PENDING) {
      throw new Error('Only pending transactions can be declined');
    }

    this.status = TransactionStatus.DECLINED;
    this.updatedAt = new Date().toISOString();
  }
}
