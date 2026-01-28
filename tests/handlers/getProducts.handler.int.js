import { jest } from '@jest/globals'

const mockExecute = jest.fn()

jest.unstable_mockModule('#/application/useCases/GetProducts.js', () => ({
  GetProducts: jest.fn().mockImplementation(() => ({
    execute: mockExecute,
  })),
}))

const { handler } = await import('#/handlers/getProducts.handler.js')

describe('GetProducts Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 200 and products when use case succeeds', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1' },
      { id: '2', name: 'Product 2' },
    ]

    mockExecute.mockResolvedValue(mockProducts)

    const response = await handler({})

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({
      products: mockProducts,
    })
  })

  it('should return 500 when use case throws error', async () => {
    mockExecute.mockRejectedValue(new Error('Database error'))

    const response = await handler({})

    expect(response.statusCode).toBe(500)
    expect(JSON.parse(response.body)).toEqual({
      error: 'Database error',
    })
  })
})
