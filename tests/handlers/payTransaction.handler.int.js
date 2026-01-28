import { handler } from '#/handlers/payTransaction.handler.js'
import { jest } from '@jest/globals';

// Mock de repositorios y servicio de pago
const mockUpdateStatus = jest.fn()
const mockDecreaseStock = jest.fn()

const transactionRepoMock = {
  findById: jest.fn().mockResolvedValue({ id: 't1', productId: 'p1' }),
  updateStatus: mockUpdateStatus
}

const productRepoMock = {
  decreaseStock: mockDecreaseStock
}

const paymentServiceMock = {
  processPayment: jest.fn().mockResolvedValue({
    status: 'APPROVED',
    wompiTransactionId: 'w123'
  })
}

// Reemplazamos las clases internas del handler con mocks
import { TransactionRepository } from '#/domain/repositories/TransactionRepository.js'
import { ProductRepository } from '#/domain/repositories/ProductRepository.js'
import { PaymentService } from '#/application/services/PaymentService.js'

TransactionRepository.prototype.findById = transactionRepoMock.findById
TransactionRepository.prototype.updateStatus = transactionRepoMock.updateStatus
ProductRepository.prototype.decreaseStock = productRepoMock.decreaseStock
PaymentService.prototype.processPayment = paymentServiceMock.processPayment

describe('payTransaction.handler', () => {
  it('should return 200 with approved status', async () => {
    const event = {
      pathParameters: { transactionId: 't1' },
      body: JSON.stringify({ paymentInfo: {} })
    }

    const response = await handler(event)
    const body = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(body.status).toBe('APPROVED')
    expect(body.wompiTransactionId).toBe('w123')
    expect(mockUpdateStatus).toHaveBeenCalled()
    expect(mockDecreaseStock).toHaveBeenCalled()
  })
})
