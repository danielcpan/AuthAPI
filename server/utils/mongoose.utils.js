const mongoose = require('mongoose');

module.exports.clearDatabase = async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }

  await Counter.create({ _id: 'linkId', seq: 0 });
};
