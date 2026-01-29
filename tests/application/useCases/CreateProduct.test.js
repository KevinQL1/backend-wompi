import { CreateProduct } from '#/application/useCases/CreateProduct.js';
import { ProductEntity } from '#/domain/entities/ProductEntity.js';
import { jest } from '@jest/globals';

describe('CreateProduct Use Case', () => {
  let productRepositoryMock;

  beforeEach(() => {
    productRepositoryMock = {
      save: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('should throw error if productRepository is missing', () => {
    expect(() => new CreateProduct()).toThrow('ProductRepository is required');
  });

  it('should throw error if product data is invalid', async () => {
    const useCase = new CreateProduct(productRepositoryMock);

    // Probamos con campos vacíos / inválidos
    await expect(
      useCase.execute({ name: '', description: '', price: 0, stock: 0 })
    ).rejects.toThrow('Invalid product data');

    await expect(
      useCase.execute({ name: 'Prod', description: '', price: 100, stock: 1 })
    ).rejects.toThrow('Invalid product data');

    await expect(
      useCase.execute({ name: 'Prod', description: 'Desc', price: 0, stock: 1 })
    ).rejects.toThrow('Invalid product data');

    await expect(
      useCase.execute({ name: 'Prod', description: 'Desc', price: 100, stock: 0 })
    ).rejects.toThrow('Invalid product data');
  });

  it('should create and save a valid product', async () => {
    const useCase = new CreateProduct(productRepositoryMock);

    const productData = {
      name: 'Laptop',
      description: 'Laptop gamer',
      price: 2500,
      stock: 10,
    };

    const product = await useCase.execute(productData);

    // Validamos la instancia de ProductEntity
    expect(product).toBeInstanceOf(ProductEntity);

    // El ID debe existir y ser un string
    expect(product.id).toBeDefined();
    expect(typeof product.id).toBe('string');

    // Validamos que los demás campos se hayan seteado correctamente
    expect(product.name).toBe(productData.name);
    expect(product.description).toBe(productData.description);
    expect(product.price).toBe(productData.price);
    expect(product.stock).toBe(productData.stock);

    // Validamos que save del repositorio se haya llamado una vez
    expect(productRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(productRepositoryMock.save).toHaveBeenCalledWith(product);
  });
});
