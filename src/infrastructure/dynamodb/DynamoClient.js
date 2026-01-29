import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

/**
 * Cliente DynamoDB centralizado
 * Funciona en:
 *  - Local (DynamoDB Local + Docker)
 *  - AWS (Lambda / Serverless)
 */

const isLocal = process.env.IS_OFFLINE === 'true' 

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  ...(isLocal && {
    endpoint: 'http://localhost:8000',
    credentials: {
      accessKeyId: 'fake',
      secretAccessKey: 'fake'
    }
  })
});

export const dynamoDb = DynamoDBDocumentClient.from(client);
