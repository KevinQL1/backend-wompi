import { CustomerEntity } from '#/domain/entities/CustomerEntity.js'

describe('CustomerEntity', () => {
  it('should throw error if id is missing', () => {
    expect(() => new CustomerEntity({
      id: '',
      name: 'Juan',
      email: 'juan@test.com',
      address: 'Calle 123',
      city: 'Bogota',
      phone: '3001234567'
    })).toThrow('Customer id (cédula) es requerido y debe ser un string')
  })

  it('should throw error if email is invalid', () => {
    expect(() => new CustomerEntity({
      id: '123',
      name: 'Juan',
      email: 'juan.com',
      address: 'Calle 123',
      city: 'Bogota',
      phone: '3001234567'
    })).toThrow('Customer email no es válido')
  })

  it('should create a customer correctly', () => {
    const customer = new CustomerEntity({
      id: '123',
      name: 'Juan',
      email: 'juan@test.com',
      address: 'Calle 123',
      city: 'Bogota',
      phone: '3001234567'
    })
    expect(customer.id).toBe('123')
    // savedCard no está definido en la entidad actual
    expect(customer.savedCard).toBeUndefined()
  })
})
