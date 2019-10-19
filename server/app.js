require('dotenv').config();
const express = require('express');
const httpStatus = require('http-status');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compress = require('compression');
const bodyParser = require('body-parser');
const expressWinston = require('express-winston');
const expressValidation = require('express-validation');
const winstonInstance = require('./winston');
const passport = require('./utils/passport.utils')
const routes = require('./routes/index.route');
const APIError = require('./utils/APIError.utils');
const { ENV } = require('./config/config');

const app = express();

// MIDDLEWARE
if (ENV === 'developmet') app.use(morgan);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compress());
app.use(helmet());
app.use(cors());
app.use(passport.initialize())

// ENABLE DETAILED API LOGGING IN DEV ENV
if (ENV === 'development') {
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true,
  }));
}

// MOUNT ALL ROUTES ON API
app.use('/api', routes);

// IF ERROR IS NOT AN INSTANCE OF APIERROR, CONVERT IT
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    const unifiedErrorMessage = err.errors.map((error) => error.messages.join('. ')).join(' and ');
    const validationError = new APIError(unifiedErrorMessage, err.status, true);
    return next(validationError);
  } if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status);
    return next(apiError);
  }
  return next(err);
});

// CATCH 404 AND FORWARD TO ERROR HANDLER
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// ERROR HANDLER
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(err.status || 500).json({
    name: err.name,
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: ENV === 'development' ? err.stack : {},
  });
});

module.exports = app;
