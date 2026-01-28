import { ProductEntity } from '#/domain/entities/ProductEntity.js'

describe('ProductEntity', () => {
  it('should throw error if price is invalid', () => {
    expect(() => {
      new ProductEntity({
        id: 'p1',
        name: 'Producto Test',
        price: 0,
        stock: 5
      })
    }).toThrow('Product price must be greater than 0')
  })

  it('should throw error if stock is negative', () => {
    expect(() => {
      new ProductEntity({
        id: 'p1',
        name: 'Producto Test',
        price: 100,
        stock: -1
      })
    }).toThrow('Product stock must be a non-negative integer')
  })

  it('should throw error if id is missing', () => {
    expect(() => {
      new ProductEntity({
        id: '',
        name: 'Producto Test',
        price: 100,
        stock: 10
      })
    }).toThrow('Product id is required')
  })

  it('should throw error if name is invalid', () => {
    expect(() => {
      new ProductEntity({
        id: 'p1',
        name: '',
        price: 100,
        stock: 10
      })
    }).toThrow('Product name is required')
  })

  it('should decrease stock correctly', () => {
    const product = new ProductEntity({
      id: 'p1',
      name: 'Producto Test',
      price: 100,
      stock: 5
    })
    product.decreaseStock(2)
    expect(product.stock).toBe(3)
  })
})
