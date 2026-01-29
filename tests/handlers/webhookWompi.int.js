import { jest } from '@jest/globals';

// Mocks globales
const findByWompiTransactionIdMock = jest.fn();
const updateMock = jest.fn();
const executeMock = jest.fn();
const saveMock = jest.fn();

// Mock de clases
jest.unstable_mockModule('#/infrastructure/dynamodb/TransactionDynamoDB.js', () => ({
  TransactionDynamoDB: jest.fn().mockImplementation(() => ({
    findByWompiTransactionId: findByWompiTransactionIdMock,
    update: updateMock,
  })),
}));

jest.unstable_mockModule('#/infrastructure/dynamodb/ProductDynamoDB.js', () => ({
  ProductDynamoDB: jest.fn().mockImplementation(() => ({})),
}));

jest.unstable_mockModule('#/infrastructure/dynamodb/DeliveryDynamoDB.js', () => ({
  DeliveryDynamoDB: jest.fn().mockImplementation(() => ({
    save: saveMock,
  })),
}));

jest.unstable_mockModule('#/application/useCases/UpdateStock.js', () => ({
  UpdateStock: jest.fn().mockImplementation(() => ({
    execute: executeMock,
  })),
}));

jest.unstable_mockModule('uuid', () => ({
  v4: jest.fn(() => 'uuid-1234'),
}));

// Importamos handler después de los mocks
const { handler } = await import('#/handlers/webhookWompi.js');

describe('webhookWompi.handler', () => {

  beforeEach(() => {
    // Limpiar mocks antes de cada test
    findByWompiTransactionIdMock.mockReset();
    updateMock.mockReset();
    executeMock.mockReset();
    saveMock.mockReset();
  });

  it('should return 400 if payload is invalid', async () => {
    const event = { body: '{}' };
    const res = await handler(event);
    expect(res.statusCode).toBe(400);
    expect(res.body).toBe('Invalid payload');
  });

  it('should return 404 if transaction not found', async () => {
    findByWompiTransactionIdMock.mockResolvedValue(null);

    const event = { body: JSON.stringify({ data: { id: 'w123', status: 'APPROVED' } }) };
    const res = await handler(event);

    expect(findByWompiTransactionIdMock).toHaveBeenCalledWith('w123');
    expect(res.statusCode).toBe(404);
    expect(res.body).toBe('Transaction not found');
  });

  it('should update transaction, stock, and create delivery if APPROVED', async () => {
    const transaction = { id: 't1', productId: 'p1', deliveryAddress: 'Calle 123' };
    findByWompiTransactionIdMock.mockResolvedValue(transaction);

    const event = { body: JSON.stringify({ data: { id: 'w123', status: 'APPROVED' } }) };
    const res = await handler(event);

    expect(updateMock).toHaveBeenCalledWith(expect.objectContaining({
      id: 't1',
      status: 'APPROVED',
      wompiTransactionId: 'w123',
    }));

    expect(executeMock).toHaveBeenCalledWith({ productId: 'p1', quantity: 1 });
    expect(saveMock).toHaveBeenCalledWith(expect.objectContaining({
      id: 'uuid-1234',
      transactionId: 't1',
      address: 'Calle 123',
      status: 'PENDING',
    }));

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('OK');
  });

  it('should update transaction but not stock or delivery if DECLINED', async () => {
    const transaction = { id: 't1', productId: 'p1', deliveryAddress: 'Calle 123' };
    findByWompiTransactionIdMock.mockResolvedValue(transaction);

    const event = { body: JSON.stringify({ data: { id: 'w123', status: 'DECLINED' } }) };
    const res = await handler(event);

    expect(updateMock).toHaveBeenCalledWith(expect.objectContaining({ status: 'DECLINED' }));
    expect(executeMock).not.toHaveBeenCalled();
    expect(saveMock).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('OK');
  });

  it('should return 401 if signature header is present but invalid', async () => {
    process.env.WOMPI_PRIVATE_KEY = 'secret-key';

    const transaction = { id: 't1', productId: 'p1', deliveryAddress: 'Calle 123' };
    findByWompiTransactionIdMock.mockResolvedValue(transaction);

    const payload = JSON.stringify({ data: { id: 'w123', status: 'APPROVED' } });
    const event = { body: payload, headers: { 'x-wompi-signature': 'invalid-signature' } };
    const res = await handler(event);

    expect(res.statusCode).toBe(401);
    expect(res.body).toBe('Invalid signature');
  });

  it('should accept valid signature and process normally', async () => {
    const { createHmac } = await import('crypto');
    process.env.WOMPI_PRIVATE_KEY = 'secret-key';

    const transaction = { id: 't1', productId: 'p1', deliveryAddress: 'Calle 123' };
    findByWompiTransactionIdMock.mockResolvedValue(transaction);

    const payload = JSON.stringify({ data: { id: 'w123', status: 'APPROVED' } });
    const signature = createHmac('sha256', process.env.WOMPI_PRIVATE_KEY).update(payload).digest('hex');

    const event = { body: payload, headers: { 'x-wompi-signature': signature } };
    const res = await handler(event);

    expect(updateMock).toHaveBeenCalledWith(expect.objectContaining({ status: 'APPROVED' }));
    expect(executeMock).toHaveBeenCalled();
    expect(saveMock).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('OK');
  });

  it('should return 500 if unexpected error occurs', async () => {
    findByWompiTransactionIdMock.mockRejectedValue(new Error('DB failure'));

    const event = { body: JSON.stringify({ data: { id: 'w123', status: 'APPROVED' } }) };
    const res = await handler(event);

    expect(res.statusCode).toBe(500);
    expect(res.body).toBe('DB failure');
  });
});
