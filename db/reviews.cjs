/* eslint-disable no-undef */
const client = require('./client.cjs')
const { getRandomString } = require('./users.cjs')

const createReview = async (userId, productId, rating, reviewText) => {
  try {
    await client.query(`
      INSERT INTO reviews (user_id, product_id, rating, review_text)
      VALUES ($1, $2, $3, $4)
    `, [userId, productId, rating, reviewText]);
  } catch (error) {
    console.log('Error creating review - reviews.cjs', error);    
    throw error;
  }
};

const seedReviews = async(numIds) => {

  for (let i = 1; i <= numIds; i++) {

    let user_id = i;

    for (let j = 1; j <= numIds; j++) {

      let product_id = j;

      const rating = (Math.floor(Math.random() * 99) + 1) / 10; 
      const review_text = `${getRandomString()} ${getRandomString()} ${getRandomString()}${getRandomString()} ${getRandomString()}`;

      await createReview(user_id, product_id, rating, review_text)
    }
  }
}

module.exports = {
  createReview,
  seedReviews
}