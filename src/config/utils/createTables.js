import 'dotenv/config';
import {
  DynamoDBClient,
  CreateTableCommand,
  ListTablesCommand
} from '@aws-sdk/client-dynamodb';

process.env.AWS_ACCESS_KEY_ID = 'fake';
process.env.AWS_SECRET_ACCESS_KEY = 'fake';

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000'
});

const TABLES = [
  process.env.PRODUCT_TABLE,
  process.env.CUSTOMER_TABLE,
  process.env.TRANSACTION_TABLE,
  process.env.DELIVERY_TABLE
].map(name => ({
  TableName: name,
  AttributeDefinitions: [
    { AttributeName: 'PK', AttributeType: 'S' },
    { AttributeName: 'SK', AttributeType: 'S' }
  ],
  KeySchema: [
    { AttributeName: 'PK', KeyType: 'HASH' },
    { AttributeName: 'SK', KeyType: 'RANGE' }
  ],
  BillingMode: 'PAY_PER_REQUEST'
}));

async function createTables() {
  console.log('🔍 Listing tables...');
  const { TableNames = [] } = await client.send(new ListTablesCommand({}));

  for (const table of TABLES) {
    if (!table.TableName) {
      console.warn('⚠ Missing table name (check .env)');
      continue;
    }

    if (TableNames.includes(table.TableName)) {
      console.log(`✔ Exists: ${table.TableName}`);
      continue;
    }

    console.log(`🚀 Creating: ${table.TableName}`);
    await client.send(new CreateTableCommand(table));
    console.log(`✅ Created: ${table.TableName}`);
  }
}

createTables()
  .then(() => {
    console.log('🎉 DynamoDB Local ready');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ DynamoDB setup failed', err);
    process.exit(1);
  });
