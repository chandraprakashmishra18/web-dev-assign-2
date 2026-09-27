// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`);

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON format in request body"
    });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
};

module.exports = errorHandler;
