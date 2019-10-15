module.exports = {
  ENV: 'test',
  MONGODB_URI: 'mongodb://127.0.0.1:27017/auth_test',
  PORT: process.env.PORT || 5000,
  PUBLIC_URL: process.env.PUBLIC_URL,
  JWT_SECRET: process.env.JWT_SECRET,
}