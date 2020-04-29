const { PORT, NODE_ENV, DATABASE_URL, TEST_DATABASE_URL } = process.env;

module.exports = {
  PORT: PORT || 8080,
  NODE_ENV,
  DATABASE_URL,
  TEST_DATABASE_URL
};