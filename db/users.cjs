/* eslint-disable no-undef */
const client = require('./client.cjs')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getRandomString = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';

  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const createUser = async(username, email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await client.query(`
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
      `, [username, email, hashedPassword]);
      
  } catch (error) {

    console.log('Error creating user - users.cjs', error);
    throw error;

  } 
};

const seedUsers = async(numUsers) => {

  

  for (let i = 0; i < numUsers; i++) {

    const username = `User${getRandomString()}`;
    const email = `${getRandomString()}@example.com`;
    const password = `password${getRandomString()}`;

    await createUser(username, email, password);
  }
};

const getReviewsById = async(userID) => {
  try {
    const { rows } = await client.query(`
      SELECT * FROM reviews WHERE user_id=$1; 
    `, [userID]);
    return rows;
  } catch (error) {
    console.log('Error getting reviews for user by id - users.cjs', error);
    throw error;
  }
};

const userLogin = async(email, password) => {
  try {
    const result = await client.query(`
      SELECT * FROM users WHERE email=$1;
    `,[email]);

    const user = result.rows[0]

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        {id: user.id, username: user.username, email: user.email},
        process.env.JWT_SECRET)
  
        return token;
    } else {
      throw new Error('Invalid credentials');
    }


  } catch (error) {
    console.log('Error with user login - users.cjs', error);
      throw error;
  }
}


module.exports = {
  createUser,
  seedUsers,
  getRandomString,
  getReviewsById,
  userLogin
}