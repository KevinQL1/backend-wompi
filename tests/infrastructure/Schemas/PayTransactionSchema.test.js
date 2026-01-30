import { payProcessSchema } from '#/infrastructure/Schemas/PayTransactionSchema.js'

describe('PayTransactionSchema', () => {
  it('should return error for missing paymentInfo', () => {
    const { error } = payProcessSchema.validate({}, { abortEarly: false })
    expect(error).toBeDefined()
    expect(error.details.some(d => d.message.includes('paymentInfo es requerido'))).toBeTruthy()
  })

  it('should return error for invalid card number', () => {
    const body = { paymentInfo: { cardNumber: '123', cardType: 'VISA', expiry: '12/29', cvc: '123', customer: { cedula: '1234567', name: 'a', email: 'a@b.com', address: 'addr', city: 'c', phone: '3111111111' }, productId: '00000000000000001', quantity: 1 } }
    const { error } = payProcessSchema.validate(body, { abortEarly: false })
    expect(error).toBeDefined()
    expect(error.details.some(d => d.message.includes('El número de tarjeta no es válido'))).toBeTruthy()
  })

  it('should return error for invalid expiry month/year', () => {
    const body = { paymentInfo: { cardNumber: '4111111111111111', cardType: 'VISA', expiry: '13/99', cvc: '123', customer: { cedula: '1234567', name: 'a', email: 'a@b.com', address: 'addr', city: 'c', phone: '3111111111' }, productId: '00000000000000001', quantity: 1 } }
    const { error } = payProcessSchema.validate(body, { abortEarly: false })
    expect(error).toBeDefined()
    expect(error.details.some(d => d.message.includes('El mes de expiry debe estar entre 01 y 12') || d.message.includes('El año de expiry debe estar entre 26 y 50'))).toBeTruthy()
  })
})