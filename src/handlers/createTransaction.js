import { CreateTransaction } from '#/application/useCases/CreateTransaction.js';
import { TransactionDynamoDB } from '#/infrastructure/dynamodb/TransactionDynamoDB.js';
import { ProductDynamoDB } from '#/infrastructure/dynamodb/ProductDynamoDB.js';

/*
 * Crea una transacción en estado PENDING.
 * No contiene lógica de negocio.
 */

const transactionRepository = new TransactionDynamoDB(process.env.TRANSACTION_TABLE);
const productRepository = new ProductDynamoDB(process.env.PRODUCT_TABLE);
const createTransaction = new CreateTransaction({ transactionRepository, productRepository });

export const handler = async (event) => {
    try {
        const body = JSON.parse(event.body || '{}');
        const { customerId, productId, amount } = body;

        if (!customerId || !productId || !amount) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Missing required fields',
                }),
            };
        }

        const transaction = await createTransaction.execute({
            customerId,
            productId,
            amount,
        });

        return {
            statusCode: 201,
            body: JSON.stringify(transaction),
        };
    } catch (error) {
        console.error('CreateTransaction error:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message,
            }),
        };
    }
};
