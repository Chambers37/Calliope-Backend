/* eslint-disable no-undef */
const client = require('./client.cjs')
const { getRandomString } = require('./users.cjs')

const createProduct = async(name, description, average_rating = 0.0) => {
try {
  await client.query(`
    INSERT INTO products (name, description, average_rating)
    VALUES ($1, $2, $3)
  `, [name, description, average_rating])
} catch (error) {
    console.log('Error creating product - products.cjs', error);
    throw error;
}
};

const seedProducts = async(numProducts) => {

  for (let i = 0; i < numProducts; i++) {

    const name = `Product:${getRandomString()}`;

    const description = `${getRandomString()}${getRandomString()}${getRandomString()}${getRandomString()}${getRandomString()}`;

    const average_rating = (Math.floor(Math.random() * 99) + 1) / 10; 

    await createProduct(name, description, average_rating);
  }
};

const getAllProducts = async() => {
  try {
    const { rows } = await client.query(`
      SELECT * FROM products;  
    `);
    return rows;
  } catch (error) {
    console.log('Error getting products - products.cjs', error);
    throw error;
  }
}

module.exports = {
  createProduct,
  seedProducts,
  getAllProducts
}