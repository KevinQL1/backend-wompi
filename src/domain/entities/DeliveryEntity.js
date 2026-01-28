export const DeliveryStatus = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
}

export class DeliveryEntity {
  constructor({
    id,
    transactionId,
    address,
    status = DeliveryStatus.PENDING,
    createdAt,
    updatedAt,
  }) {
    this.validate({ id, transactionId, address })

    this.id = id
    this.transactionId = transactionId
    this.address = address
    this.status = status
    this.createdAt = createdAt || new Date().toISOString()
    this.updatedAt = updatedAt || new Date().toISOString()
  }

  validate({ id, transactionId, address }) {
    if (!id) {
      throw new Error('Delivery must have an id')
    }

    if (!transactionId) {
      throw new Error('Delivery must have a transactionId')
    }

    if (!address || typeof address !== 'string') {
      throw new Error('Delivery address is required')
    }
  }

  markAsSent() {
    if (this.status !== DeliveryStatus.PENDING) {
      throw new Error('Only pending deliveries can be sent')
    }

    this.status = DeliveryStatus.SENT
    this.updatedAt = new Date().toISOString()
  }

  markAsDelivered() {
    if (this.status !== DeliveryStatus.SENT) {
      throw new Error('Only sent deliveries can be delivered')
    }

    this.status = DeliveryStatus.DELIVERED
    this.updatedAt = new Date().toISOString()
  }
}
