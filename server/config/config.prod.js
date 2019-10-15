module.exports = {
  ENV: 'production',
  MONGODB_URI: 'mongodb://heroku_j3npvbjk:clh9dgs21qhlns7g4fcpv1vujc@ds163757.mlab.com:63757/heroku_j3npvbjk',
  PORT: process.env.PORT || 5000,
  PUBLIC_URL: 'http://localhost:5000', // TO BE CHANGED
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_MAILER_USER: 'danielcpan.dev@gmail.com',
  NODE_MAILER_PASS: process.env.NODE_MAILER_PASS,
  EMAIL_SECRET: process.env.EMAIL_SECRET
}
