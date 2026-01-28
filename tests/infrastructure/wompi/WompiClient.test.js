import { WompiClient } from '#/infrastructure/wompi/WompiClient.js';

describe('WompiClient', () => {
  let wompiClient;

  beforeAll(() => {
    process.env.WOMPI_PUBLIC_KEY = 'test_public_key';
    wompiClient = new WompiClient();
  });

  it('Debe crear una transacción y devolver estado y id', async () => {
    const paymentInfo = {
      card_holder: 'Juan Perez',
      card_number: '4111111111111111',
      card_expiration: '12/29',
      cvc: '123',
      amount_in_cents: 5000,
    };

    const result = await wompiClient.createTransaction('tx_123', paymentInfo);

    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('wompiTransactionId');
    expect(['APPROVED','DECLINED','PENDING']).toContain(result.status);
  });
});
