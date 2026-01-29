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

    test('findById returns transaction entity when found', async () => {
        sendMock.mockResolvedValue({ Item: {
            id: 'tx-2',
            productId: 'p2',
            customerId: 'c2',
            amount: 200,
            status: 'PENDING',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
        } });

        const repo = new TransactionDynamoDB('table');
        const res = await repo.findById('tx-2');

        expect(sendMock).toHaveBeenCalledWith(expect.any(GetCommand));
        expect(res).toBeDefined();
        expect(res.id).toBe('tx-2');
        expect(res.amount).toBe(200);
    });

    test('updateStatus sends correct update command', async () => {
        sendMock.mockResolvedValue({});

        const repo = new TransactionDynamoDB('table');
        await repo.updateStatus('t1', 'APPROVED', 'w1');

        expect(sendMock).toHaveBeenCalledWith(expect.any(UpdateCommand));
        const cmd = sendMock.mock.calls[0][0];
        expect(cmd.input.TableName).toBe('table');
        expect(cmd.input.Key).toMatchObject({ PK: 'TRANSACTION#t1', SK: 'TRANSACTION#t1' });
        expect(cmd.input.ExpressionAttributeValues[':status']).toBe('APPROVED');
        expect(cmd.input.ExpressionAttributeValues[':wompiTransactionId']).toBe('w1');
        expect(cmd.input.ExpressionAttributeValues[':updatedAt']).toBeDefined();
    });

    test('save stores item with PK/SK and entity', async () => {
        sendMock.mockResolvedValue({});

        const repo = new TransactionDynamoDB('table');
        const tx = {
            id: 'tx-3',
            productId: 'p3',
            customerId: 'c3',
            amount: 300,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
        };

        await repo.save(tx);

        expect(sendMock).toHaveBeenCalledWith(expect.any(PutCommand));
        const cmd = sendMock.mock.calls[0][0];
        expect(cmd.input.Item.PK).toBe('TRANSACTION#tx-3');
        expect(cmd.input.Item.SK).toBe('TRANSACTION#tx-3');
        expect(cmd.input.Item.entity).toBe('TransactionEntity');
    });

    test('findByWompiTransactionId returns null when no items', async () => {
        sendMock.mockResolvedValue({ Items: [] });

        const repo = new TransactionDynamoDB('table');
        const res = await repo.findByWompiTransactionId('w-1');

        expect(sendMock).toHaveBeenCalledWith(expect.any(ScanCommand));
        expect(res).toBeNull();
    });

    test('findByWompiTransactionId returns transaction when found', async () => {
        sendMock.mockResolvedValue({ Items: [{
            id: 'tx-4',
            productId: 'p4',
            customerId: 'c4',
            amount: 400,
            status: 'PENDING',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
        }] });

        const repo = new TransactionDynamoDB('table');
        const res = await repo.findByWompiTransactionId('w-2');

        expect(sendMock).toHaveBeenCalledWith(expect.any(ScanCommand));
        expect(res).toBeDefined();
        expect(res.id).toBe('tx-4');
    });
});
