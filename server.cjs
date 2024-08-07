/* eslint-disable no-undef */
require('dotenv').config();
const express = require('express');
const client  = require('./db/client.cjs');
const { getAllProducts } = require('./db/products.cjs')
const { getReviewsById, createUser, userLogin } = require('./db/users.cjs')

const app = express();
const PORT = process.env.PORT;

client.connect();

app.use(express.json())

// Get all products
app.get('/api/v1/products', async(req, res) => {
  try {
    const products = await getAllProducts();
    console.log(products)
    res.send(products)
  } catch (error) {
    console.log('Error getting products - server.cjs', error);
    throw error;
  }
});

// Get single product by ID
app.get('/api/v1/products/:id', async(req, res) => {
  const singleID = req.params.id;
  try {
    const { rows } = await client.query(`
      SELECT * FROM products WHERE id=$1;
    `, [singleID]);
    console.log(rows)
    res.send(rows)
  } catch (error) {
    console.log('Error getting single product details - server.cjs', error);
    throw error;
  }
});

// Get all reviews from single user by ID
app.get('/api/v1/users/:id/reviews', async(req, res) => {
  const userID = req.params.id;

  try {
    const result = await getReviewsById(userID);
    console.log(result);
    res.send(result)
  } catch (error) {
    console.log('Error getting reviews for user by id - server.cjs', error);
    throw error;
  }
});

// User signup
app.post('/api/v1/users/signup', async(req, res) => {
  const { username, email, password } = req.body;

  try {
    const result = await createUser(username, email, password);
    console.log('User signed up!')
    res.send(result)

  } catch (error) {
    console.log('Error with user signup - server.cjs', error);
    throw error;
  } 
});

// User Login
app.post('/api/v1/users/login', async(req, res) => {
  const { email, password } = req.body;

  try {
    

  } catch (error) {
    console.log('Error with user login - server.cjs', error);
    throw error;
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})