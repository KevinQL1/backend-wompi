export class CustomerEntity {
  constructor({ id, name, email, address, savedCard }) {
    this.validate({ id, name, email, address })

    this.id = id
    this.name = name
    this.email = email
    this.address = address
    this.savedCard = savedCard || null
  }

  validate({ id, name, email, address }) {
    // id = cédula
    if (!id || typeof id !== 'string') {
      throw new Error('Customer id (cedula) is required')
    }

    if (!name || typeof name !== 'string') {
      throw new Error('Customer name is required')
    }

    if (!email || typeof email !== 'string') {
      throw new Error('Customer email is required')
    }

    // validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Customer email is not valid')
    }

    if (!address || typeof address !== 'string') {
      throw new Error('Customer address is required')
    }
  }
}
