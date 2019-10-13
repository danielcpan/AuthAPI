/* eslint no-console: 0 */
const app = require('./app');
const { PORT, PUBLIC_URL } = require('./config/config');

// Database
require('./database')();

app.listen(PORT, () => console.log(`🚀 Server ready at ${PUBLIC_URL}`));
