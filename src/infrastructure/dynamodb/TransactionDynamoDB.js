import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

import { dynamoDb } from './DynamoClient.js';
import { Transaction } from '#/domain/entities/Transaction.js';

/**
 * Implementación DynamoDB del TransactionRepository
 * Solo persistencia, cero lógica de negocio.
 */
export class TransactionDynamoDB {
  constructor(tableName) {
    if (!tableName) {
      throw new Error('Table name is required');
    }

    this.tableName = tableName;
  }

  async findAll() {
    const result = await dynamoDb.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'entity = :entity',
        ExpressionAttributeValues: {
          ':entity': 'Transaction',
        },
      })
    );

    return result.Items.map(item => new Transaction(item));
  }

  async findById(id) {
    const result = await dynamoDb.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          PK: `TRANSACTION#${id}`,
          SK: `TRANSACTION#${id}`,
        },
      })
    );

    if (!result.Item) return null;

    return new Transaction(result.Item);
  }

  async save(transaction) {
    await dynamoDb.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          PK: `TRANSACTION#${transaction.id}`,
          SK: `TRANSACTION#${transaction.id}`,
          entity: 'Transaction',

          ...transaction,
        },
      })
    );
  }

  async update(transaction) {
    await dynamoDb.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: {
          PK: `TRANSACTION#${transaction.id}`,
          SK: `TRANSACTION#${transaction.id}`,
        },
        UpdateExpression: `
          SET #status = :status,
              wompiTransactionId = :wompiTransactionId,
              updatedAt = :updatedAt
        `,
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': transaction.status,
          ':wompiTransactionId': transaction.wompiTransactionId,
          ':updatedAt': transaction.updatedAt,
        },
      })
    );
  }
}
