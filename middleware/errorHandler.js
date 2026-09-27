/**
 * Centralized Error Handling Middlewares
 */

/**
 * 404 Route Not Found Handler
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  });
};

/**
 * Global 500 Internal Error Handler
 */
const globalErrorHandler = (err, req, res, next) => {
  console.error("[ERROR]", err.stack || err.message);

  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
