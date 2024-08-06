/* eslint-disable no-undef */
const client = require('./client.cjs')
const bcrypt = require('bcrypt');

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

    await client.query(`
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
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
}

module.exports = {
  createUser,
  seedUsers,
  getRandomString
}