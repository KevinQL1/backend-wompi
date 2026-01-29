import 'dotenv/config';
import {
  DynamoDBClient,
  DeleteTableCommand,
  ListTablesCommand
} from '@aws-sdk/client-dynamodb';

// Credenciales fake (obligatorias incluso en local)
process.env.AWS_ACCESS_KEY_ID = 'fake';
process.env.AWS_SECRET_ACCESS_KEY = 'fake';

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000'
});

// 📦 Tablas definidas en .env
const TABLE_NAMES = [
  process.env.PRODUCT_TABLE,
  process.env.CUSTOMER_TABLE,
  process.env.TRANSACTION_TABLE,
  process.env.DELIVERY_TABLE
];

async function deleteTables() {
  console.log('🔍 Listing tables...');
  const { TableNames = [] } = await client.send(
    new ListTablesCommand({})
  );

  for (const name of TABLE_NAMES) {
    if (!name) {
      console.warn('⚠ Missing table name (check .env)');
      continue;
    }

    if (!TableNames.includes(name)) {
      console.log(`⚠ Not found: ${name}`);
      continue;
    }

    console.log(`🗑 Deleting: ${name}`);
    await client.send(new DeleteTableCommand({ TableName: name }));
    console.log(`✅ Deleted: ${name}`);
  }
}

deleteTables()
  .then(() => {
    console.log('🔥 DynamoDB Local cleaned');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Delete failed', err);
    process.exit(1);
  });
