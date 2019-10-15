module.exports = {
  ENV: 'development',
  MONGODB_URI: 'mongodb://127.0.0.1:27017/auth_development',
  PORT: process.env.PORT || 5000,
  PUBLIC_URL: 'http://localhost:5000',
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_MAILER_USER: 'baylee.hauck53@ethereal.email',
  NODE_MAILER_PASS: process.env.ETHEREAL_PASS
}