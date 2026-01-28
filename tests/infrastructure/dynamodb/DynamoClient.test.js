import { jest } from '@jest/globals';

jest.unstable_mockModule('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn().mockImplementation(() => ({})),
}));

jest.unstable_mockModule('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: {
    from: jest.fn(),
  },
}));

describe('DynamoClient', () => {
  test('should create DynamoDBDocumentClient', async () => {
    const { DynamoDBDocumentClient } = await import('@aws-sdk/lib-dynamodb');
    await import('#/infrastructure/dynamodb/DynamoClient.js');

    expect(DynamoDBDocumentClient.from).toHaveBeenCalled();
  });
});
