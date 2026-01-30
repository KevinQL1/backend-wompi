import { CreateTransaction } from '#/application/useCases/CreateTransaction.js';
import { jest } from '@jest/globals';

describe('CreateTransaction Use Case', () => {
  let transactionRepositoryMock;
  let productRepositoryMock;
  let customerRepositoryMock;
  let paymentServiceMock;

  beforeEach(() => {
    transactionRepositoryMock = { findById: jest.fn(), updateStatus: jest.fn() };
    productRepositoryMock = { findById: jest.fn() };
    customerRepositoryMock = { findById: jest.fn() };
    paymentServiceMock = { createPayment: jest.fn() };

    jest.clearAllMocks();
  });

  it('should throw error if transaction not found', async () => {
    transactionRepositoryMock.findById.mockResolvedValue(null);

    const useCase = new CreateTransaction(transactionRepositoryMock, productRepositoryMock, customerRepositoryMock, paymentServiceMock);

    await expect(useCase.execute('t1')).rejects.toThrow('Transaction with ID t1 not found');
  });

  it('should throw error if product not found', async () => {
    transactionRepositoryMock.findById.mockResolvedValue({ id: 't1', productId: 'p1', quantity: 1 });
    productRepositoryMock.findById.mockResolvedValue(null);

    const useCase = new CreateTransaction(transactionRepositoryMock, productRepositoryMock, customerRepositoryMock, paymentServiceMock);

    await expect(useCase.execute('t1')).rejects.toThrow('Product with ID p1 not found');
  });

  it('should call payment service and update status when valid', async () => {
    transactionRepositoryMock.findById.mockResolvedValue({ id: 't1', productId: 'p1', customerId: 'c1', quantity: 1 });
    productRepositoryMock.findById.mockResolvedValue({ id: 'p1', name: 'Prod', stock: 5 });
    customerRepositoryMock.findById.mockResolvedValue({ id: 'c1' });
    paymentServiceMock.createPayment.mockResolvedValue({ status: 'APPROVED', id: 'w1' });
    transactionRepositoryMock.updateStatus.mockResolvedValue({ status: 'APPROVED' });

    const useCase = new CreateTransaction(transactionRepositoryMock, productRepositoryMock, customerRepositoryMock, paymentServiceMock);

    const res = await useCase.execute('t1');

    expect(transactionRepositoryMock.updateStatus).toHaveBeenCalledWith('t1', 'APPROVED', 'w1');
    expect(res).toHaveProperty('message');
  });
});
