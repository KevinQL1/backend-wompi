import { Product } from '#/domain/entities/Product.js'

describe('Product Entity', () => {
  it('should create a valid product', () => {
    const product = new Product({
      id: 'prod-1',
      name: 'Laptop',
      description: 'Gaming laptop',
      price: 1500,
      stock: 10
    })

    expect(product.id).toBe('prod-1')
    expect(product.stock).toBe(10)
  })

  it('should throw error if price is invalid', () => {
    expect(() => {
      new Product({
        id: 'prod-2',
        name: 'Phone',
        price: 0,
        stock: 5
      })
    }).toThrow('Product price must be greater than 0')
  })

  it('should throw error if stock is negative', () => {
    expect(() => {
      new Product({
        id: 'prod-3',
        name: 'Tablet',
        price: 500,
        stock: -1
      })
    }).toThrow('Product stock must be a non-negative integer')
  })

  it('should decrease stock correctly', () => {
    const product = new Product({
      id: 'prod-4',
      name: 'Monitor',
      price: 300,
      stock: 5
    })

    product.decreaseStock(2)

    expect(product.stock).toBe(3)
  })

  it('should throw error if stock is insufficient', () => {
    const product = new Product({
      id: 'prod-5',
      name: 'Keyboard',
      price: 100,
      stock: 1
    })

    expect(() => {
      product.decreaseStock(2)
    }).toThrow('Insufficient stock')
  })

  it('should throw error if id is missing', () => {
    expect(() => {
      new Product({
        name: 'Mouse',
        price: 50,
        stock: 10
      })
    }).toThrow('Product id is required')
  })

  it('should throw error if name is invalid', () => {
    expect(() => {
      new Product({
        id: 'prod-6',
        name: '',
        price: 50,
        stock: 10
      })
    }).toThrow('Product name is required')
  })
})
