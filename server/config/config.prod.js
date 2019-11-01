module.exports = {
  ENV: 'production',
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT || 5000,
  PUBLIC_URL: 'http://localhost:5000', // TO BE CHANGED
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_MAILER_USER: 'danielcpan.dev@gmail.com',
  NODE_MAILER_PASS: process.env.NODE_MAILER_PASS,
  EMAIL_SECRET: process.env.EMAIL_SECRET,
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,  
};
