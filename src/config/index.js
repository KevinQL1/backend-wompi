import dotenv from 'dotenv';
dotenv.config();

export const config = {
  stage: process.env.STAGE || 'local',
  encryptionKey: process.env.ENCRYPTION_KEY,
  encryptionIV: process.env.ENCRYPTION_IV,
  wompiPrivateKey: process.env.WOMPI_PRIVATE_KEY,
  wompiPublicKey: process.env.WOMPI_PUBLIC_KEY,
  productTable: process.env.PRODUCT_TABLE,
  customerTable: process.env.CUSTOMER_TABLE,
  transactionTable: process.env.TRANSACTION_TABLE,
  deliveryTable: process.env.DELIVERY_TABLE,
};
