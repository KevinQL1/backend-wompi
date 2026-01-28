import { DeliveryEntity, DeliveryStatus } from '#/domain/entities/DeliveryEntity.js'

describe('DeliveryEntity', () => {
  it('should throw error if id is missing', () => {
    expect(() => new DeliveryEntity({
      id: '',
      transactionId: 't1',
      address: 'Calle 123'
    })).toThrow('Delivery must have an id')
  })

  it('should mark delivery as sent', () => {
    const delivery = new DeliveryEntity({
      id: 'd1',
      transactionId: 't1',
      address: 'Calle 123'
    })
    delivery.markAsSent()
    expect(delivery.status).toBe(DeliveryStatus.SENT)
  })

  it('should mark delivery as delivered', () => {
    const delivery = new DeliveryEntity({
      id: 'd1',
      transactionId: 't1',
      address: 'Calle 123',
      status: DeliveryStatus.SENT
    })
    delivery.markAsDelivered()
    expect(delivery.status).toBe(DeliveryStatus.DELIVERED)
  })
})
