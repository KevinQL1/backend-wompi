import { GetProducts } from '#/application/useCases/GetProducts.js'
import { ProductEntity } from '#/domain/entities/ProductEntity.js'

describe('GetProducts Use Case', () => {
  it('should return all products from repository', async () => {
    // Fake repository (NO DynamoDB)
    const fakeProductRepository = {
      findAll: async () => [
        new ProductEntity({
          id: 'prod-1',
          name: 'Laptop',
          price: 1500,
          stock: 10
        }),
        new ProductEntity({
          id: 'prod-2',
          name: 'Phone',
          price: 800,
          stock: 5
        })
      ]
    }

    const useCase = new GetProducts(fakeProductRepository)

    const products = await useCase.execute()

    expect(products).toHaveLength(2)
    expect(products[0].name).toBe('Laptop')
    expect(products[1].name).toBe('Phone')
  })

  it('should throw error if repository is not provided', () => {
    expect(() => {
      new GetProducts()
    }).toThrow('ProductRepository is required')
  })
})
