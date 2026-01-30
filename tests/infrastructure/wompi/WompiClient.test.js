import { jest } from '@jest/globals';
import { WompiClient } from '#/infrastructure/wompi/WompiClient.js';

describe('WompiClient', () => {
  let wompiClient;

  beforeAll(() => {
    process.env.WOMPI_PUBLIC_KEY = 'test_public_key';
    process.env.WOMPI_INTEGRITY_KEY = 'secret';
    wompiClient = new WompiClient();
  });

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('tokenCard should return tokens', async () => {
    const paymentInfo = {
      cardNumber: '4111111111111111',
      expiry: '12/29',
      cvc: '123',
      customer: { name: 'Juan', address: 'Calle 1', city: 'Bogota', phone: '3111111111' }
    };

    global.fetch.mockImplementation((url) => {
      if (url.endsWith('/tokens/cards')) {
        return Promise.resolve({ json: async () => ({ status: 'success', data: { id: 'card-1' } }) });
      }
      if (url.includes('/merchants/')) {
        return Promise.resolve({ json: async () => ({ data: { presigned_acceptance: { acceptance_token: 'acc' }, presigned_personal_data_auth: { acceptance_token: 'per' } } }) });
      }
      return Promise.resolve({ json: async () => ({}) });
    });

    const tokens = await wompiClient.tokenCard(paymentInfo);
    expect(tokens).toHaveProperty('status');
    expect(tokens).toHaveProperty('tokenCard');
    expect(tokens.tokenCard.id).toBe('card-1');
  });

  it('tokenCard should throw on invalid expiry format', async () => {
    const badPayment = { cardNumber: '4111', expiry: 'bad', cvc: '123', customer: { name: 'Juan', address: 'a', city: 'b', phone: '3111111111' } }
    await expect(wompiClient.tokenCard(badPayment)).rejects.toThrow('Formato de expiry inválido')
  })

  it('tokenMerchants should throw if fetch fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('network'))
    await expect(wompiClient.tokenMerchants()).rejects.toThrow('network')
  })

  it('createTransaction should throw and wrap error message on failure', async () => {
    const transaction = { id: 't1', amount: 50, quantity: 1, acceptanceToken: 'acc', personalToken: 'per', cardToken: 'card-1' }
    const customer = { email: 'a@b.com' }

    global.fetch.mockRejectedValueOnce(new Error('boom'))

    await expect(wompiClient.createTransaction(transaction, customer)).rejects.toThrow(/Error al procesar el pago/)
  })

  it('findAndUpdateTransactionById should return data', async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => ({ data: { status: 'APPROVED', id: 'w3' } }) })
    const res = await wompiClient.findAndUpdateTransactionById('w3')
    expect(res.id).toBe('w3')
  })
});
