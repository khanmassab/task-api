const createError = require('http-errors');

function notFound(req, res, next) {
  return next(createError(404, 'Route not found'));
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const isClientError = status >= 400 && status < 500;
  const message = err.message || 'Internal server error';

  const payload = { message };
  if (process.env.NODE_ENV !== 'production' && !isClientError && err.stack) {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
}

module.exports = {
  notFound,
  errorHandler,
};
