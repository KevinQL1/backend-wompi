import { GetProducts } from '#/application/useCases/GetProducts.js';
import { ProductRepository } from '#/domain/repositories/ProductRepository.js';

/*
 * Obtiene todos los procutos
 */

const productRepo = new ProductRepository();
const getProducts = new GetProducts(productRepo);

export const handler = async (event) => {
  try {
    const products = await getProducts.execute();
    return {
      statusCode: 200,
      body: JSON.stringify({ products }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
