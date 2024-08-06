/* eslint-disable no-undef */
require('dotenv').config();
const express = require('express');
const client  = require('./db/client.cjs');
const { getAllProducts } = require('./db/products.cjs')

const app = express();
const PORT = process.env.PORT;

client.connect();

app.use(express.json())

app.get('/api/v1/products', async(req, res, next) => {
  try {
    const products = await getAllProducts();
    console.log(products)
    res.send(products)
  } catch (error) {
    console.log('Error getting products - server.cjs', error);
    throw error;
  }
})

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})