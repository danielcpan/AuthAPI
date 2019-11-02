/* eslint no-console: 0 */
const app = require('./app');
const config = require('./config/config');
const { connectMongo } = require('./utils/mongoose.utils');

// Database
connectMongo();

app.listen(config.PORT, () => console.log(`🚀 Server ready at ${config.PUBLIC_URL}`));
