import { jest } from '@jest/globals'
import { ProcessPayment } from '#/application/useCases/ProcessPayment.js'

describe('ProcessPayment UseCase', () => {
  let transactionRepoMock
  let productRepoMock
  let paymentServiceMock
  let useCase

  beforeEach(() => {
    transactionRepoMock = {
      findById: jest.fn(),
      updateStatus: jest.fn()
    }

    productRepoMock = {
      decreaseStock: jest.fn()
    }

    paymentServiceMock = {
      processPayment: jest.fn()
    }

    useCase = new ProcessPayment(transactionRepoMock, productRepoMock, paymentServiceMock)
  })

  it('should throw error if transaction not found', async () => {
    transactionRepoMock.findById.mockResolvedValue(null)

    await expect(useCase.execute('t1', {}))
      .rejects.toThrow('Transacción no encontrada')
  })

  it('should update transaction and decrease stock if approved', async () => {
    const transaction = { id: 't1', productId: 'p1' }
    transactionRepoMock.findById.mockResolvedValue(transaction)
    paymentServiceMock.processPayment.mockResolvedValue({
      status: 'APPROVED',
      wompiTransactionId: 'w123'
    })

    const result = await useCase.execute('t1', {})

    expect(transactionRepoMock.updateStatus).toHaveBeenCalledWith('t1', 'APPROVED', 'w123')
    expect(productRepoMock.decreaseStock).toHaveBeenCalledWith('p1', 1)
    expect(result).toEqual({
      transactionId: 't1',
      status: 'APPROVED',
      wompiTransactionId: 'w123'
    })
  })

  it('should update transaction but not decrease stock if declined', async () => {
    const transaction = { id: 't1', productId: 'p1' }
    transactionRepoMock.findById.mockResolvedValue(transaction)
    paymentServiceMock.processPayment.mockResolvedValue({
      status: 'DECLINED',
      wompiTransactionId: 'w124'
    })

    const result = await useCase.execute('t1', {})

    expect(transactionRepoMock.updateStatus).toHaveBeenCalledWith('t1', 'DECLINED', 'w124')
    expect(productRepoMock.decreaseStock).not.toHaveBeenCalled()
    expect(result).toEqual({
      transactionId: 't1',
      status: 'DECLINED',
      wompiTransactionId: 'w124'
    })
  })
})
