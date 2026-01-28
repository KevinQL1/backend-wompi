import { CreateTransaction } from '#/application/useCases/CreateTransaction.js';
import { TransactionStatus } from '#/domain/entities/Transaction.js';
import { jest } from '@jest/globals';

describe('CreateTransaction Use Case', () => {
  const transactionRepositoryMock = {
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create a pending transaction', async () => {
    const useCase = new CreateTransaction(transactionRepositoryMock);

    const transaction = await useCase.execute({
      customerId: 'cust-1',
      productId: 'prod-1',
      amount: 15000,
    });

    expect(transaction.status).toBe(TransactionStatus.PENDING);
    expect(transaction.id).toBeDefined();
    expect(transactionRepositoryMock.save).toHaveBeenCalledTimes(1);
  });

  test('should throw error for invalid data', async () => {
    const useCase = new CreateTransaction(transactionRepositoryMock);

    await expect(
      useCase.execute({
        customerId: null,
        productId: 'prod-1',
        amount: 0,
      })
    ).rejects.toThrow('Invalid transaction data');
  });
});
