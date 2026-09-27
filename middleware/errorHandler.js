/**
 * Centralized Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('[Error Details]:', err.stack || err.message);

  // Handle malformed JSON body payload errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON payload provided in request body.'
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
