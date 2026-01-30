import { TransactionEntity } from '#/domain/entities/TransactionEntity.js';

describe('TransactionEntity', () => {
  const now = new Date().toISOString();
  const baseData = {
    id: 'tx-123',
    productId: 'prod-1',
    customerId: 'cust-1',
    amount: 10000,
    cardToken: { id: 'card-1' },
    quantity: 1,
    acceptanceToken: { presigned_acceptance: { acceptance_token: 'acc' } },
    personalToken: { presigned_personal_data_auth: { acceptance_token: 'per' } },
    createdAt: now,
    updatedAt: now,
  };

  test('should create a valid transaction', () => {
    const transaction = new TransactionEntity(baseData);

    expect(transaction.id).toBe(baseData.id);
    expect(transaction.amount).toBe(10000);
    expect(transaction.cardToken).toBeDefined();
  });

  test('should throw error if productId is missing', () => {
    expect(() => new TransactionEntity({ ...baseData, productId: null })).toThrow('Transaction must have a productId');
  });

  test('should throw error if cardToken missing', () => {
    expect(() => new TransactionEntity({ ...baseData, cardToken: null })).toThrow('Transaction must have a cardToken');
  });

  test('should throw error if amount invalid', () => {
    expect(() => new TransactionEntity({ ...baseData, amount: 0 })).toThrow('Transaction amount must be greater than 0');
  });

  test('should throw error if quantity invalid', () => {
    expect(() => new TransactionEntity({ ...baseData, quantity: 0 })).toThrow('Transaction quantity must be greater than 0');
  });

  test('should throw error if timestamps missing', () => {
    const t = { ...baseData };
    delete t.createdAt; delete t.updatedAt;
    expect(() => new TransactionEntity(t)).toThrow('Transaction must have timestamps');
  });
});
