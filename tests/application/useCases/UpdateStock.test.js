import { UpdateStock } from '#/application/useCases/UpdateStock.js';
import { jest } from '@jest/globals';

describe('UpdateStock Use Case', () => {
  let transactionRepoMock;
  let productRepoMock;
  let deliveryRepoMock;
  let customerRepoMock;
  let paymentServiceMock;

  beforeEach(() => {
    transactionRepoMock = { findById: jest.fn(), updateStatus: jest.fn() };
    productRepoMock = { findById: jest.fn(), update: jest.fn() };
    deliveryRepoMock = { save: jest.fn() };
    customerRepoMock = { findById: jest.fn() };
    paymentServiceMock = { findAndUpdateTransactionById: jest.fn() };

    jest.clearAllMocks();
  });

  it('should throw error if transaction has no productId', async () => {
    transactionRepoMock.findById.mockResolvedValue({ id: 't1' });
    const useCase = new UpdateStock(transactionRepoMock, productRepoMock, deliveryRepoMock, customerRepoMock, paymentServiceMock);

    await expect(useCase.execute('t1')).rejects.toThrow('productId is required');
  });

  it('should throw error if product not found', async () => {
    transactionRepoMock.findById.mockResolvedValue({ id: 't1', productId: 'p1' });
    productRepoMock.findById.mockResolvedValue(null);
    const useCase = new UpdateStock(transactionRepoMock, productRepoMock, deliveryRepoMock, customerRepoMock, paymentServiceMock);

    await expect(useCase.execute('t1')).rejects.toThrow('Product with ID p1 not found');
  });

  it('should throw if insufficient stock', async () => {
    transactionRepoMock.findById.mockResolvedValue({ id: 't1', productId: 'p1', quantity: 5 });
    productRepoMock.findById.mockResolvedValue({ id: 'p1', name: 'Prod', stock: 2 });
    const useCase = new UpdateStock(transactionRepoMock, productRepoMock, deliveryRepoMock, customerRepoMock, paymentServiceMock);

    await expect(useCase.execute('t1')).rejects.toThrow('Product Prod is out of stock or insufficient stock');
  });

  it('should update stock and create delivery when approved', async () => {
    const transaction = { id: 't1', productId: 'p1', quantity: 1, customerId: 'c1', wompiTransactionId: 'w1' };
    transactionRepoMock.findById.mockResolvedValue(transaction);
    productRepoMock.findById.mockResolvedValue({ id: 'p1', name: 'Prod', stock: 10 });
    paymentServiceMock.findAndUpdateTransactionById.mockResolvedValue({ status: 'APPROVED', id: 'w1' });
    transactionRepoMock.updateStatus.mockResolvedValue({ status: 'APPROVED' });
    customerRepoMock.findById.mockResolvedValue({ id: 'c1', address: 'Calle 1' });
    deliveryRepoMock.save.mockResolvedValue(true);

    const useCase = new UpdateStock(transactionRepoMock, productRepoMock, deliveryRepoMock, customerRepoMock, paymentServiceMock);

    const res = await useCase.execute('t1');

    expect(productRepoMock.update).toHaveBeenCalled();
    expect(transactionRepoMock.updateStatus).toHaveBeenCalled();
    expect(deliveryRepoMock.save).toHaveBeenCalled();
    expect(res).toHaveProperty('delivery');
  });
});
