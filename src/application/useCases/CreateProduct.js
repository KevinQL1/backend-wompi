import { v4 as uuidv4 } from 'uuid';
import { ProductEntity } from '#/domain/entities/ProductEntity.js';

/**
 * Caso de uso encargado de crear productos
 */

export class CreateProduct {
    constructor(productRepository) {
        if (!productRepository) {
            throw new Error('ProductRepository is required');
        }
        this.productRepository = productRepository;
    }

    async execute({ name, description, price, stock }) {
        if (!name || !description || !price || !stock) {
            throw new Error('Invalid product data');
        }

        const now = new Date().toISOString();

        const product = new ProductEntity({
            id: uuidv4(),
            name,
            description,
            price,
            stock,
            createdAt: now,
            updatedAt: now,
        });

        await this.productRepository.save(product);

        return product;
    }
}
