import { Transaction, TransactionStatus } from '#/domain/entities/Transaction.js';

describe('Transaction Entity', () => {
  const baseData = {
    id: 'tx-123',
    productId: 'prod-1',
    customerId: 'cust-1',
    amount: 10000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  test('should create a valid transaction', () => {
    const transaction = new Transaction(baseData);

    expect(transaction.id).toBe(baseData.id);
    expect(transaction.status).toBe(TransactionStatus.PENDING);
    expect(transaction.amount).toBe(10000);
  });

  test('should throw error if productId is missing', () => {
    expect(() => {
      new Transaction({ ...baseData, productId: null });
    }).toThrow('Transaction must have a productId');
  });

  test('should approve a pending transaction', () => {
    const transaction = new Transaction(baseData);

    transaction.approve('wompi-123');

    expect(transaction.status).toBe(TransactionStatus.APPROVED);
    expect(transaction.wompiTransactionId).toBe('wompi-123');
  });

  test('should not approve a non-pending transaction', () => {
    const transaction = new Transaction(baseData);
    transaction.approve('wompi-123');

    expect(() => {
      transaction.approve('wompi-456');
    }).toThrow('Only pending transactions can be approved');
  });

  test('should decline a pending transaction', () => {
    const transaction = new Transaction(baseData);

    transaction.decline();

    expect(transaction.status).toBe(TransactionStatus.DECLINED);
  });
});
