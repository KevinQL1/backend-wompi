import { jest } from '@jest/globals';

const createTxExecuteMock = jest.fn().mockResolvedValue({ id: 'tx-1', status: 'PENDING' });

jest.unstable_mockModule('#/infrastructure/dynamodb/TransactionDynamoDB.js', () => ({
  TransactionDynamoDB: jest.fn().mockImplementation(() => ({
    save: jest.fn(),
  })),
}));

// Mock ProductDynamoDB to avoid constructor errors when handler imports it
jest.unstable_mockModule('#/infrastructure/dynamodb/ProductDynamoDB.js', () => ({
  ProductDynamoDB: jest.fn().mockImplementation(() => ({
    findById: jest.fn(),
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
      body: JSON.stringify({
        customerId: 'cust-1',
        productId: 'prod-1',
        amount: 1000,
      }),
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body).status).toBe('PENDING');
  });

  test('should return 400 for missing fields', async () => {
    const event = {
      body: JSON.stringify({
        customerId: 'cust-1',
      }),
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
  });

  test('should return 500 if CreateTransaction.execute throws', async () => {
    // For this test, make the execute throw
    createTxExecuteMock.mockRejectedValueOnce(new Error('boom'));

    const event = {
      body: JSON.stringify({
        customerId: 'cust-1',
        productId: 'prod-1',
        amount: 1000,
      }),
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe('boom');
  });

  test('should return 500 on invalid JSON body', async () => {
    const event = {
      body: '{ invalid json',
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(500);
    // message comes from JSON.parse error, ensure it is a string
    expect(JSON.parse(response.body).message).toEqual(expect.any(String));
  });
});
