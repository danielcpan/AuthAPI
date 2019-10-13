require('dotenv').config();
const express = require('express');
const httpStatus = require('http-status');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compress = require('compression');
const bodyParser = require('body-parser');
const expressWinston = require('express-winston');
const winstonInstance = require('./winston');
const routes = require('./routes/index.route');
const APIError = require('./utils/APIError.utils');

const app = express();

// Middleware
if (process.env.NODE_ENV === 'developmet') {
  app.use(morgan);
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(compress());

// enable detailed API logging in dev env
if (process.env.NODE_ENV === 'development') {
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true, // optional: log meta data about request (defaults to true)
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
  }));
}

// Mount all routes on api
app.use('/api', routes);

// If error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  // Format Validation Errors into one msg
  if (err.name === 'ValidationError') {
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const validationError = new APIError(unifiedErrorMessage, err.status, true);[]
    return next(validationError);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status);
    return next(apiError);
  }
  return next(err);
});

// Catch 404 and forward to Error Handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// Error Handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(err.status || 500).json({
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
});

module.exports = app;
