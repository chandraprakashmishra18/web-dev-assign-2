/**
 * Custom Request Logger Middleware
 * Logs incoming HTTP requests with timestamp, method, URL, status code, and latency.
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");

  // Intercept response finish event to capture status code and duration
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - Status: ${statusCode} (${duration}ms)`);
  });

  next();
};

module.exports = requestLogger;
