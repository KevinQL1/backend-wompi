import { jest } from '@jest/globals'
import { ProcessPayment } from '#/application/useCases/ProcessPayment.js'

describe('ProcessPayment UseCase', () => {
  let mockTransactionRepo
  let mockProductRepo
  let mockCustomerRepo
  let mockPaymentService
  let useCase

  beforeEach(() => {
    mockTransactionRepo = { save: jest.fn() }
    mockProductRepo = { findById: jest.fn() }
    mockCustomerRepo = { save: jest.fn() }
    mockPaymentService = { processPayment: jest.fn() }

    useCase = new ProcessPayment(mockTransactionRepo, mockProductRepo, mockCustomerRepo, mockPaymentService)
  })

  it('should throw error if product not found', async () => {
    mockProductRepo.findById.mockResolvedValue(null)
    await expect(useCase.execute({ productId: 'p1', quantity: 1 })).rejects.toThrow('Product with ID p1 not found')
  })

  it('should throw error if product is out of stock', async () => {
    mockProductRepo.findById.mockResolvedValue({ id: 'p1', name: 'Prod', stock: 0 })
    await expect(useCase.execute({ productId: 'p1', quantity: 1 })).rejects.toThrow('Product Prod is out of stock or insufficient stock')
  })

  it('should process payment and save customer and transaction when approved', async () => {
    const product = { id: 'p1', name: 'Prod', stock: 5, price: 100 }
    mockProductRepo.findById.mockResolvedValue(product)

    mockPaymentService.processPayment.mockResolvedValue({
      status: 'APPROVED',
      tokenCard: { id: 'card-1' },
      tokenMerchants: { presigned_acceptance: { acceptance_token: 'acc' }, presigned_personal_data_auth: { acceptance_token: 'per' } }
    })
    mockTransactionRepo.save.mockResolvedValue({ id: 'gen-1' })

    const result = await useCase.execute({
      productId: 'p1',
      quantity: 1,
      customer: { cedula: 'c1', name: 'Juan', address: 'Calle 1', city: 'Bogota', phone: '3111111111', email: 'a@b.com' },
      cardNumber: '4111111111111111',
      cardType: 'VISA',
      expiry: '12/50',
      cvc: '123'
    })

    expect(mockCustomerRepo.save).toHaveBeenCalled()
    expect(mockTransactionRepo.save).toHaveBeenCalled()
    expect(result).toBeDefined()
  })
})
