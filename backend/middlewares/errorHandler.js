const responseHandler = require('../utils/responseHandler');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return responseHandler(res, 400, false, 'Validation Error', null, errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return responseHandler(res, 400, false, `${field} already exists`);
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    return responseHandler(res, 400, false, 'Invalid ID format');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return responseHandler(res, 401, false, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return responseHandler(res, 401, false, 'Token expired');
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  responseHandler(res, statusCode, false, message);
};

module.exports = errorHandler;
