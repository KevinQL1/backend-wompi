// Servicio que se encarga de comunicarse con Wompi para procesar pagos

import { WompiClient } from '#/infrastructure/wompi/WompiClient.js';

export class PaymentService {
  constructor() {
    this.wompiClient = new WompiClient();
  }

  // Procesa un pago enviando la información a Wompi
  async processPayment(transactionId, paymentInfo) {
    // paymentInfo puede incluir: card_number, cvv, expiration_date, card_holder
    const result = await this.wompiClient.createTransaction(transactionId, paymentInfo);
    return result; // Devuelve objeto con estado: APPROVED | DECLINED | PENDING
  }
}
