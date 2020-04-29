require('dotenv').config();
const { NODE_ENV, DATABASE_URL, TEST_DATABASE_URL } = require('./src/config');
console.log(' PROCESS.ENV.SSL:', process.env.SSL)
console.log('DATABASE_URL:', DATABASE_URL)
console.log('NODE_ENV:', NODE_ENV)
module.exports = {
  'migrationDirectory': 'migrations',
  'driver': 'pg',
  'connectionString': NODE_ENV === 'test'
    ? TEST_DATABASE_URL
    : DATABASE_URL,
    "ssl": !!process.env.SSL,
};