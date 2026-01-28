import { jest } from '@jest/globals';

const sendMock = jest.fn();

jest.unstable_mockModule('#/infrastructure/dynamodb/DynamoClient.js', () => ({
    dynamoDb: {
        send: sendMock,
    },
}));

describe('TransactionDynamoDB', () => {
    let TransactionDynamoDB;
    let ScanCommand;
    let GetCommand;
    let PutCommand;
    let UpdateCommand;

    beforeAll(async () => {
        ({ TransactionDynamoDB } = await import(
            '#/infrastructure/dynamodb/TransactionDynamoDB.js'
        ));

        ({
            ScanCommand,
            GetCommand,
            PutCommand,
            UpdateCommand,
        } = await import('@aws-sdk/lib-dynamodb'));
    });

    beforeEach(() => {
        sendMock.mockReset();
    });

    test('throws error if table name missing', () => {
        expect(() => new TransactionDynamoDB()).toThrow('Table name is required');
    });

    test('findAll returns transactions', async () => {
        sendMock.mockResolvedValue({
            Items: [{
                id: 'tx-1',
                productId: 'p1',
                customerId: 'c1',
                amount: 100,
                status: 'PENDING',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
            }],
        });

        const repo = new TransactionDynamoDB('table');
        const result = await repo.findAll();

        expect(sendMock).toHaveBeenCalledWith(expect.any(ScanCommand));
        expect(result[0].id).toBe('tx-1');
    });

    test('findById returns null if not found', async () => {
        sendMock.mockResolvedValue({});

        const repo = new TransactionDynamoDB('table');
        const result = await repo.findById('tx-1');

        expect(result).toBeNull();
        expect(sendMock).toHaveBeenCalledWith(expect.any(GetCommand));
    });

    test('save persists transaction', async () => {
        sendMock.mockResolvedValue({});

        const repo = new TransactionDynamoDB('table');
        await repo.save({ id: 'tx-1' });

        expect(sendMock).toHaveBeenCalledWith(expect.any(PutCommand));
    });

    test('update updates transaction', async () => {
        sendMock.mockResolvedValue({});

        const repo = new TransactionDynamoDB('table');
        await repo.update({
            id: 'tx-1',
            status: 'APPROVED',
            wompiTransactionId: 'w1',
            updatedAt: new Date().toISOString(),
        });

        expect(sendMock).toHaveBeenCalledWith(expect.any(UpdateCommand));
    });
});
