const mongoose = require('mongoose');
const { MONGODB_URI } = require('./config/config');

const connectMongo = () => {
  try {
    mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      debug: true
    })
  } catch (err) {
    console.log(`Mongo Connection Error: ${err}`)
  }
}

module.exports = connectMongo;