import { ProcessPayment } from '#/application/useCases/ProcessPayment.js';
import { TransactionDynamoDB } from '#/infrastructure/dynamodb/TransactionDynamoDB.js';
import { ProductDynamoDB } from '#/infrastructure/dynamodb/ProductDynamoDB.js';
import { PaymentService } from '#/application/services/PaymentService.js';

const transactionRepo = new TransactionDynamoDB(process.env.TRANSACTION_TABLE);
const productRepo = new ProductDynamoDB(process.env.PRODUCT_TABLE);
const paymentService = new PaymentService();
const processPaymentUC = new ProcessPayment(transactionRepo, productRepo, paymentService);

export const handler = async (event) => {
  const body = JSON.parse(event.body);

  try {
    const result = await processPaymentUC.execute(body.paymentInfo);
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
