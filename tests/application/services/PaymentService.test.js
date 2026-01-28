import { jest } from '@jest/globals'
import { PaymentService } from '#/application/services/PaymentService.js'
import { WompiClient } from '#/infrastructure/wompi/WompiClient.js'

describe('PaymentService', () => {
  it('should call WompiClient.createTransaction and return result', async () => {
    // Mock dinámico de WompiClient
    const mockCreateTransaction = jest.fn().mockResolvedValue({
      status: 'APPROVED',
      wompiTransactionId: 'w123'
    })

    WompiClient.prototype.createTransaction = mockCreateTransaction

    const service = new PaymentService()
    const transactionId = 't1'
    const paymentInfo = { card_number: '4111111111111111', cvv: '123' }

    const result = await service.processPayment(transactionId, paymentInfo)

    expect(mockCreateTransaction).toHaveBeenCalledWith(transactionId, paymentInfo)
    expect(result.status).toBe('APPROVED')
    expect(result.wompiTransactionId).toBe('w123')
  })
})
