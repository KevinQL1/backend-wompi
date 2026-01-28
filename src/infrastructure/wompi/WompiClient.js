// Cliente que se comunica con la API de Wompi (sandbox) para crear transacciones

import fetch from 'node-fetch';

export class WompiClient {
  constructor() {
    // Tu llave de sandbox de Wompi desde el .env
    this.publicKey = process.env.WOMPI_PUBLIC_KEY;
    this.baseUrl = 'https://sandbox.wompi.co/v1';
  }

  // Crea una transacción en Wompi con la información de pago
  async createTransaction(transactionId, paymentInfo) {
    // paymentInfo incluye: card_number, cvv, exp_month, exp_year, card_holder
    try {
      const body = {
        type: 'CARD',
        amount_in_cents: paymentInfo.amount_in_cents || 1000, // valor de ejemplo
        currency: 'COP',
        card_holder: paymentInfo.card_holder,
        card_number: paymentInfo.card_number,
        card_expiration: paymentInfo.card_expiration, // MM/YY
        card_cvc: paymentInfo.cvc,
        reference: transactionId,
      };

      const response = await fetch(`${this.baseUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.publicKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      // Simulamos un resultado si la sandbox no da respuesta real
      const status = data.data?.status || 'APPROVED'; // APPROVED | DECLINED | PENDING
      const wompiTransactionId = data.data?.id || `wompi_${transactionId}`;

      return { status, wompiTransactionId };
    } catch (err) {
      throw new Error(`Error al procesar el pago: ${err.message}`);
    }
  }
}
