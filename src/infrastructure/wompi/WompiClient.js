// Cliente que se comunica con la API de Wompi (sandbox) para crear transacciones
export class WompiClient {
  constructor() {
    this.publicKey = process.env.WOMPI_PUBLIC_KEY;
    this.baseUrl = process.env.WOMPI_BASE_URL || 'https://api-sandbox.co.uat.wompi.dev/v1';
  }

  // Crea una transacción en Wompi con la información de pago
  async createTransaction(transactionId, paymentInfo) {
    try {
      const body = {
        type: 'CARD',
        amount_in_cents: paymentInfo.amount_in_cents || 1000,
        currency: paymentInfo.currency || 'COP',
        card_holder: paymentInfo.card_holder,
        card_number: paymentInfo.card_number,
        card_expiration: paymentInfo.card_expiration,
        card_cvc: paymentInfo.cvc,
        reference: transactionId,
      };

      const url = `${this.baseUrl}/transactions`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.publicKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      const status = data.data?.status || data.status || 'PENDING';
      const wompiTransactionId = data.data?.id || data.id || `wompi_${transactionId}`;

      return { status, wompiTransactionId, raw: data };
    } catch (err) {
      throw new Error(`Error al procesar el pago: ${err.message}`);
    }
  }
}
