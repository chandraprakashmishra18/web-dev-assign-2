require('dotenv').config();
const express = require('express');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const studentRoutes = require('./routes/studentRoutes');

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Built-in body parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global request logger middleware
app.use(logger);

// Root route - API health and documentation overview
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Student Management REST API',
    author: 'Chandra Prakash Mishra',
    endpoints: {
      getAllStudents: 'GET /students',
      getStudentById: 'GET /students/:id',
      createStudent: 'POST /students',
      updateStudent: 'PUT /students/:id',
      deleteStudent: 'DELETE /students/:id'
    }
  });
});

// Mount student CRUD routes under /students prefix
app.use('/students', studentRoutes);

// 404 Route Not Found handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized error handling middleware
app.use(errorHandler);

// Start Express server if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 Student Management API running on port ${PORT}`);
    console.log(`📡 Server URL: http://localhost:${PORT}`);
    console.log(`===============================================`);
  });
}

module.exports = app;
