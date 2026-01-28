import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { dynamoDb } from './DynamoClient.js';
import { CustomerEntity } from '#/domain/entities/CustomerEntity.js';

/**
 * Implementación DynamoDB del CustomerRepository
 * Solo persistencia, cero lógica de negocio.
 */
export class CustomerDynamoDB {
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
          ':entity': 'CustomerEntity',
        },
      })
    );

    return result.Items.map(item => new CustomerEntity(item));
  }

  async findById(id) {
    const result = await dynamoDb.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          PK: `CUSTOMER#${id}`,
          SK: `CUSTOMER#${id}`,
        },
      })
    );

    if (!result.Item) return null;

    return new CustomerEntity(result.Item);
  }

  async save(customer) {
    await dynamoDb.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          PK: `CUSTOMER#${customer.id}`,
          SK: `CUSTOMER#${customer.id}`,
          entity: 'CustomerEntity',
          ...customer,
        },
      })
    );
  }

  async update(customer) {
    await dynamoDb.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: {
          PK: `CUSTOMER#${customer.id}`,
          SK: `CUSTOMER#${customer.id}`,
        },
        UpdateExpression: `
          SET #name = :name,
              email = :email,
              address = :address,
              savedCard = :savedCard,
              updatedAt = :updatedAt
        `,
        ExpressionAttributeNames: {
          '#name': 'name',
        },
        ExpressionAttributeValues: {
          ':name': customer.name,
          ':email': customer.email,
          ':address': customer.address,
          ':savedCard': customer.savedCard || null,
          ':updatedAt': customer.updatedAt,
        },
      })
    );
  }
}
