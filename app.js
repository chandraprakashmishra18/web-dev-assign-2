const path = require("path");
const express = require("express");
const requestLogger = require("./middleware/logger");
const { notFoundHandler, globalErrorHandler } = require("./middleware/errorHandler");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom request logger
app.use(requestLogger);

// Serve static interactive documentation dashboard
app.use(express.static(path.join(__dirname, "public")));

// REST API Routes
app.use("/students", studentRoutes);

// Health check / API status endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Management REST API is operational",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Documentation summary endpoint
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    name: "Student Management REST API",
    version: "1.0.0",
    author: "Chandra Prakash Mishra",
    description: "RESTful API for managing student records with CRUD operations",
    endpoints: {
      "GET /students": "Retrieve list of all students (supports ?course=, ?search=, ?sortBy=)",
      "GET /students/:id": "Retrieve a single student by numeric ID",
      "POST /students": "Create a new student record (Body: name, age, course, email?, semester?, gpa?)",
      "PUT /students/:id": "Update student record fields",
      "DELETE /students/:id": "Remove student record by ID",
      "GET /api/health": "Check API health status"
    }
  });
});

// 404 Route Not Found Middleware
app.use(notFoundHandler);

// Centralized Error Handling Middleware
app.use(globalErrorHandler);

// Start server if launched directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 Student Management API Server running`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api`);
    console.log(`📊 Interactive UI: http://localhost:${PORT}/`);
    console.log(`===================================================`);
  });
}

module.exports = app;
