const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config/config');

module.exports = {
  connectMongo: () => {
    try {
      mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
    } catch (err) {
      console.log(`Mongo Connection Error: ${err}`)
    }
  },  
  clearDatabase: async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
  },
}
