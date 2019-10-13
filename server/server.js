/* eslint no-console: 0 */
const app = require('./app');
const { PORT, PUBLIC_URL } = require('./config/config');
const { connectMongo } = require('./utils/mongoose.utils');

// Database
connectMongo();

app.listen(PORT, () => console.log(`🚀 Server ready at ${PUBLIC_URL}`));
