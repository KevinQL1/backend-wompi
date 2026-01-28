import { TransactionRepository } from '#/domain/repositories/TransactionRepository.js';

const transactionRepo = new TransactionRepository();

export const handler = async (event) => {
  const body = JSON.parse(event.body);

  const wompiTransactionId = body.data?.id;
  const status = body.data?.status;

  try {
    await transactionRepo.updateStatusByWompiId(wompiTransactionId, status);
    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
