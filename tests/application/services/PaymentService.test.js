import { jest } from '@jest/globals'
import { PaymentService } from '#/application/services/PaymentService.js'
import { WompiClient } from '#/infrastructure/wompi/WompiClient.js'

describe('PaymentService', () => {
  it('should call WompiClient.tokenCard and return result', async () => {
    const mockTokenCard = jest.fn().mockResolvedValue({
      status: 'success',
      tokenCard: { id: 'card-1' },
      tokenMerchants: { presigned_acceptance: { acceptance_token: 'acc' }, presigned_personal_data_auth: { acceptance_token: 'per' } }
    })

    WompiClient.prototype.tokenCard = mockTokenCard

    const service = new PaymentService()
    const paymentInfo = {
      cardNumber: '4111111111111111',
      expiry: '12/50',
      cvc: '123',
      customer: { name: 'Juan', address: 'Calle 1', city: 'Bogota', phone: '3111111111' }
    }

    const result = await service.processPayment(paymentInfo)

    expect(mockTokenCard).toHaveBeenCalledWith(paymentInfo)
    expect(result.tokenCard.id).toBe('card-1')
  })

  it('should call WompiClient.createTransaction via createPayment and return result', async () => {
    const mockCreateTransaction = jest.fn().mockResolvedValue({ status: 'APPROVED', id: 'w1' })
    WompiClient.prototype.createTransaction = mockCreateTransaction

    const service = new PaymentService()
    const transaction = { id: 't1' }
    const customer = { email: 'a@b.com' }

    const res = await service.createPayment(transaction, customer)

    expect(mockCreateTransaction).toHaveBeenCalledWith(transaction, customer)
    expect(res.status).toBe('APPROVED')
    expect(res.id).toBe('w1')
  })

  it('should call WompiClient.findAndUpdateTransactionById and return result', async () => {
    const mockFind = jest.fn().mockResolvedValue({ status: 'APPROVED', id: 'w2' })
    WompiClient.prototype.findAndUpdateTransactionById = mockFind

    const service = new PaymentService()
    const res = await service.findAndUpdateTransactionById('w2')

    expect(mockFind).toHaveBeenCalledWith('w2')
    expect(res.id).toBe('w2')
  })
})
