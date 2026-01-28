import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { dynamoDb } from './DynamoClient.js';
import { ProductEntity } from '#/domain/entities/ProductEntity.js';

/**
 * Implementación DynamoDB del ProductRepository
 */

export class ProductDynamoDB {
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
          ':entity': 'ProductEntity',
        },
      })
    );

    return result.Items.map(item => new ProductEntity(item));
  }

  async findById(id) {
    const result = await dynamoDb.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          PK: `PRODUCT#${id}`,
          SK: `PRODUCT#${id}`,
        },
      })
    );

    if (!result.Item) return null;

    return new ProductEntity(result.Item);
  }

  async save(product) {
    await dynamoDb.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          PK: `PRODUCT#${product.id}`,
          SK: `PRODUCT#${product.id}`,
          entity: 'ProductEntity',
          ...product,
        },
      })
    );
  }

  async update(product) {
    await dynamoDb.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: {
          PK: `PRODUCT#${product.id}`,
          SK: `PRODUCT#${product.id}`,
        },
        UpdateExpression: `
          SET #name = :name,
              description = :description,
              price = :price,
              stock = :stock,
              updatedAt = :updatedAt
        `,
        ExpressionAttributeNames: {
          '#name': 'name',
        },
        ExpressionAttributeValues: {
          ':name': product.name,
          ':description': product.description,
          ':price': product.price,
          ':stock': product.stock,
          ':updatedAt': product.updatedAt,
        },
      })
    );
  }
}
