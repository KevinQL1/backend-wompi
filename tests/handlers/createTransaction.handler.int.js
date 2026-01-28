import { jest } from '@jest/globals';

jest.unstable_mockModule(
  '#/infrastructure/dynamodb/TransactionDynamoDB.js',
  () => ({
    TransactionDynamoDB: jest.fn().mockImplementation(() => ({
      save: jest.fn(),
    })),
  })
);

jest.unstable_mockModule(
  '#/application/useCases/CreateTransaction.js',
  () => ({
    CreateTransaction: jest.fn().mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue({
        id: 'tx-1',
        status: 'PENDING',
      }),
    })),
  })
);

const { handler } = await import('#/handlers/createTransaction.handler.js');

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
});
