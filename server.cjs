/* eslint-disable no-undef */
require('dotenv').config();
const express = require('express');
const client  = require('./db/client.cjs');
const { getAllProducts } = require('./db/products.cjs')
const { createReview } = require('./db/reviews.cjs')
const { getReviewsByToken, createUser, userLogin } = require('./db/users.cjs')
const jwt = require('jsonwebtoken');

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

// Get all reviews from single user by token
app.get('/api/v1/users/reviews', async(req, res) => {

  const token = req.headers.auth;

  if (token) {    

    try {
      const result = await getReviewsByToken(token);
      console.log('you did it!', result);
      res.send('you did it!')

    } catch (error) {

      console.log('Error getting reviews for user by id - server.cjs', error);
      throw error;
    }

  } else {
    console.log('You need to login first');
    res.send('You need to login first')  
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
    token = await userLogin(email, password);
    console.log('User logged in!')
    res.send(token)
  } catch (error) {
    console.log('Error with user login - server.cjs', error);
    throw error;
  }
});

// User writes a review
app.post('/api/v1/reviews', async(req, res) => {
  const token = req.headers.auth;
  const { productId, reviewText, rating } = req.body;

  if (token) {
    try {
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id; 

      const newReview = await createReview(userId, productId, rating, reviewText);
      console.log('New REVIEW ADDED!', newReview)
      res.send(newReview);
      
    } catch (error) {
      console.log('Error creating new review - server.cjs', error);
    }
  } else {
    console.log('You need to login first');
    res.send('You need to login first') 
  }
});


// User Edits a review



// User Deletes a review

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})