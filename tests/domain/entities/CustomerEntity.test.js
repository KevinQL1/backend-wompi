import { CustomerEntity } from '#/domain/entities/CustomerEntity.js'

describe('CustomerEntity', () => {
  it('should throw error if id is missing', () => {
    expect(() => new CustomerEntity({
      id: '',
      name: 'Juan',
      email: 'juan@test.com',
      address: 'Calle 123'
    })).toThrow('Customer id (cedula) is required')
  })

  it('should throw error if email is invalid', () => {
    expect(() => new CustomerEntity({
      id: '123',
      name: 'Juan',
      email: 'juan.com',
      address: 'Calle 123'
    })).toThrow('Customer email is not valid')
  })

  it('should create a customer correctly', () => {
    const customer = new CustomerEntity({
      id: '123',
      name: 'Juan',
      email: 'juan@test.com',
      address: 'Calle 123'
    })
    expect(customer.id).toBe('123')
    expect(customer.savedCard).toBeNull()
  })
})
