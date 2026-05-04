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

  const status = err.statusCode || err.status || 500;
  const internalMessage = err.message || 'Error desconocido';
  const displayMessage = status === 500 ? 'Error interno del sistema' : internalMessage;

  logger.error(`${internalMessage} - ${req.originalUrl} - ${req.method} - ${req.ip} - Status: ${status}`);
  if (err.stack) {
      logger.error(`Stack trace: ${err.stack}`);
  }

  res.status(status).json({
    message: displayMessage, // Sending standard "message" since most frontends consume this directly
    error: {
      message: displayMessage,
      status,
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = errorHandler;
