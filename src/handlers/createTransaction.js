import { CreateTransaction } from '#/application/useCases/CreateTransaction.js';
import { TransactionDynamoDB } from '#/infrastructure/dynamodb/TransactionDynamoDB.js';

/*
 * Crea una transacción en estado PENDING.
 * No contiene lógica de negocio.
 */

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

        const repository = new TransactionDynamoDB(
            process.env.TRANSACTIONS_TABLE
        );

        const createTransaction = new CreateTransaction(repository);

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
                message: 'Internal server error',
            }),
        };
    }
};
