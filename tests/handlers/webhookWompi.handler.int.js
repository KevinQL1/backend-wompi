import { jest } from '@jest/globals'
import { handler } from '#/handlers/webhookWompi.handler.js'

describe('webhookWompi.handler', () => {
  it('should return 200 OK', async () => {
    const mockUpdateStatus = jest.fn().mockResolvedValue(true)

    const { TransactionRepository } = await import('#/domain/repositories/TransactionRepository.js')
    TransactionRepository.prototype.updateStatusByWompiId = mockUpdateStatus

    const event = {
      body: JSON.stringify({
        data: { id: 'w123', status: 'APPROVED' }
      })
    }

    const response = await handler(event)
    expect(response.statusCode).toBe(200)
    expect(response.body).toBe('OK')
  })
})
