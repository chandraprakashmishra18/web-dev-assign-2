const express = require('express');
const studentRoutes = require('./routes/studentRoutes');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Built-in Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Logger Middleware
app.use(logger);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Student Management REST API',
    author: 'Chandra Prakash Mishra',
    availableRoutes: {
      'GET /students': 'Retrieve all students',
      'GET /students/:id': 'Retrieve a student by ID',
      'POST /students': 'Create a new student',
      'PUT /students/:id': 'Update an existing student',
      'DELETE /students/:id': 'Delete a student'
    }
  });
});

// Mount student routes
app.use('/students', studentRoutes);

// 404 Route Not Found handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use(errorHandler);

// Start the server if launched directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
