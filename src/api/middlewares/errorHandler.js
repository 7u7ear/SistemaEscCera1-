const logger = require('../services/logger.service');

const errorHandler = (err, req, res, next) => {
  // Handle Zod Validation Errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: {
        message: 'Error de validación',
        details: err.errors.map(e => ({ path: e.path, message: e.message })),
        status: 400,
        timestamp: new Date().toISOString()
      }
    });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`${message} - ${req.originalUrl} - ${req.method} - ${req.ip} - Status: ${status}`);

  res.status(status).json({
    error: {
      message,
      status,
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = errorHandler;
