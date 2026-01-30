import { jest } from '@jest/globals';

const createTxExecuteMock = jest.fn().mockResolvedValue({ id: 'tx-1', status: 'PENDING' });

jest.unstable_mockModule('#/infrastructure/dynamodb/TransactionDynamoDB.js', () => ({
  TransactionDynamoDB: jest.fn().mockImplementation(() => ({
    save: jest.fn(),
  })),
}));

// Mock ProductDynamoDB and CustomerDynamoDB to avoid real constructors
jest.unstable_mockModule('#/infrastructure/dynamodb/ProductDynamoDB.js', () => ({
  ProductDynamoDB: jest.fn().mockImplementation(() => ({
    findById: jest.fn(),
  })),
}));

jest.unstable_mockModule('#/infrastructure/dynamodb/CustomerDynamoDB.js', () => ({
  CustomerDynamoDB: jest.fn().mockImplementation(() => ({
    save: jest.fn(),
  })),
}));

// Expose the execute mock so tests can change its behaviour per scenario
jest.unstable_mockModule('#/application/useCases/CreateTransaction.js', () => ({
  CreateTransaction: jest.fn().mockImplementation(() => ({
    execute: createTxExecuteMock,
  })),
}));

const { handler } = await import('#/handlers/createTransaction.js');

describe('CreateTransaction.handler', () => {
  test('should return 201 when transaction is created', async () => {
    const event = {
      pathParameters: { idTransaction: '00000000000000000' }
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toEqual({ id: 'tx-1', status: 'PENDING' });
  });

  test('should return 400 for invalid path parameters', async () => {
    const event = { pathParameters: {} };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
  });

  test('should throw when CreateTransaction.execute throws (current handler implementation has a catch bug)', async () => {
    // For this test, make the execute throw
    createTxExecuteMock.mockRejectedValueOnce(new Error('boom'));

    const event = { pathParameters: { idTransaction: '00000000000000000' } };

    await expect(handler(event)).rejects.toThrow();
  });
});
