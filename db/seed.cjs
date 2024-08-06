/* eslint-disable no-undef */
const client = require('./client.cjs');
const { seedUsers } = require('./users.cjs')
const { seedProducts } = require('./products.cjs')
const { seedReviews } = require('./reviews.cjs')

const dropTables = async() => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS products;
    `);
  } catch (error) {
    console.log('Error dropping tables - seed.cjs', error);
    throw error;
  }
}

const createTables = async() => {
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(30) UNIQUE NOT NULL,
        email VARCHAR(30) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL 
      );

      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(30) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        average_rating DECIMAL(3, 1) DEFAULT 0.0
      );

      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        product_id INTEGER REFERENCES products(id),
        rating DECIMAL(3, 1) CHECK (rating >= 0.0 AND rating <= 10.0),
        review_text TEXT,
        UNIQUE(user_id, product_id)
      );
    `);
  } catch (error) {
    console.log('Error creating tables - seed.cjs', error);
    throw error;
  }
}

const numIds = 5;

const syncAndSeed = async() => {

  // connect
  client.connect();
  console.log('Connected..');

  // drop tables
  await dropTables();
  console.log('Tables Dropped');

  // create tables 
  await createTables();
  console.log('Tables Created');

  // seed data
  await seedUsers(numIds);
  console.log('Users Created');

  await seedProducts(numIds);
  console.log('Products Created');

  await seedReviews(numIds);
  console.log('Reviews Created');


  // disconnect
  client.end();
  console.log('Connected terminated');

};

syncAndSeed();

