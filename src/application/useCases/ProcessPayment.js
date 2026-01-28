// Use case que se encarga de procesar el pago y actualizar transacción y stock

export class ProcessPayment {
  constructor(transactionRepo, productRepo, paymentService) {
    this.transactionRepo = transactionRepo;
    this.productRepo = productRepo;
    this.paymentService = paymentService;
  }

  // Ejecuta el proceso de pago de una transacción
  async execute(transactionId, paymentInfo) {
    const transaction = await this.transactionRepo.findById(transactionId);
    if (!transaction) throw new Error('Transacción no encontrada');

    const paymentResult = await this.paymentService.processPayment(transactionId, paymentInfo);

    const status = paymentResult.status;
    await this.transactionRepo.updateStatus(transactionId, status, paymentResult.wompiTransactionId);
    
    if (status === 'APPROVED') {
      await this.productRepo.decreaseStock(transaction.productId, 1);
    }

    return {
      transactionId,
      status,
      wompiTransactionId: paymentResult.wompiTransactionId,
    };
  }
}
