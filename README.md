# Student Management REST API

A production-ready Student Management REST API built using **Node.js** and **Express.js**. This API provides complete CRUD (Create, Read, Update, Delete) operations using an in-memory dataset, custom request logging middleware, robust request validation, 404 route handling, and centralized error handling.

---

## Author

| Field | Details |
|-------|---------|
| **Name** | Chandra Prakash Mishra |
| **GitHub** | [@chandraprakashmishra18](https://github.com/chandraprakashmishra18) |
| **Course** | Web Development III (Node.js & Express Backend) |
| **Assignment** | Lab Assignment 2 – Student Management REST API |

---

## Project Structure

```text
web-dev-assign-2/
├── app.js                    # Main application entry point & Express server setup
├── package.json              # Project configuration, scripts and dependencies
├── package-lock.json         # Locked dependency versions
├── test-api.js               # Automated integration verification test suite
├── test_api.js               # Dual test runner entry point
├── routes/
│   └── studentRoutes.js      # Express Router handling student CRUD endpoints
├── middleware/
│   ├── logger.js             # Custom middleware logging HTTP method, URL, and timestamp
│   └── errorHandler.js       # Centralized global error handling middleware
├── data/
│   └── students.js           # Initial in-memory array of student records
└── README.md                 # API documentation and usage guide
```

---

## Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on v24.x)
- **npm**: v9+

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/chandraprakashmishra18/web-dev-assign-2.git
cd web-dev-assign-2
npm install
```

### 3. Running the Server

#### Standard Start:
```bash
npm start
```
Starts the server on `http://localhost:3000`.

#### Development Start (Watch Mode):
```bash
npm run dev
```

#### Run Automated Test Suite:
```bash
npm test
```
*(or `node test-api.js` / `node test_api.js`)*

---

## API Endpoints & Specification

Base URL: `http://localhost:3000`

### 1. Root & Discovery
- **`GET /`**
  - **Description**: Returns API status, author, and overview of available endpoints.
  - **Status Code**: `200 OK`
  - **Response**:
```json
{
  "success": true,
  "message": "Welcome to the Student Management REST API",
  "author": "Chandra Prakash Mishra",
  "endpoints": {
    "getAllStudents": "GET /students",
    "getStudentById": "GET /students/:id",
    "createStudent": "POST /students",
    "updateStudent": "PUT /students/:id",
    "deleteStudent": "DELETE /students/:id"
  }
}
```

---

### 2. Student CRUD Endpoints

#### 1. Retrieve All Students
- **Endpoint**: `GET /students`
- **Optional Query**: `?course=Computer`
- **Status Code**: `200 OK`
- **Response**:
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": 1,
      "name": "Aarav Sharma",
      "age": 20,
      "course": "Computer Science",
      "email": "aarav.sharma@example.com"
    },
    {
      "id": 2,
      "name": "Priya Patel",
      "age": 22,
      "course": "Information Technology",
      "email": "priya.patel@example.com"
    }
  ]
}
```

#### 2. Retrieve Student by ID
- **Endpoint**: `GET /students/:id`
- **Status Code**: `200 OK` or `404 Not Found`
- **Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Aarav Sharma",
    "age": 20,
    "course": "Computer Science",
    "email": "aarav.sharma@example.com"
  }
}
```
- **Response (`404 Not Found`)**:
```json
{
  "success": false,
  "message": "Student with ID 999 not found."
}
```

#### 3. Create a New Student
- **Endpoint**: `POST /students`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "name": "Lucas Scott",
  "course": "Cybersecurity",
  "age": 21,
  "email": "lucas@example.com"
}
```
- **Validation**: `name` and `course` are required non-empty string fields.
- **Status Code**: `201 Created` or `400 Bad Request`
- **Response (`201 Created`)**:
```json
{
  "success": true,
  "message": "Student registered successfully.",
  "data": {
    "id": 5,
    "name": "Lucas Scott",
    "course": "Cybersecurity",
    "age": 21,
    "email": "lucas@example.com"
  }
}
```

#### 4. Update an Existing Student
- **Endpoint**: `PUT /students/:id`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "course": "Network Security",
  "age": 22
}
```
- **Status Code**: `200 OK`, `400 Bad Request`, or `404 Not Found`
- **Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Student with ID 1 updated successfully.",
  "data": {
    "id": 1,
    "name": "Aarav Sharma",
    "course": "Network Security",
    "age": 22,
    "email": "aarav.sharma@example.com"
  }
}
```

#### 5. Delete a Student
- **Endpoint**: `DELETE /students/:id`
- **Status Code**: `200 OK` or `404 Not Found`
- **Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Student with ID 1 deleted successfully.",
  "data": {
    "id": 1,
    "name": "Aarav Sharma",
    "course": "Computer Science",
    "age": 20,
    "email": "aarav.sharma@example.com"
  }
}
```

---

## Middlewares & Error Handling

1. **Custom Request Logger (`middleware/logger.js`)**:
   Logs each request's timestamp (ISO format), HTTP method, and requested URL. Example:
   ```text
   [2026-09-27T14:40:08.863Z] GET /students
   ```
2. **404 Route Handling**:
   Catches any requests to unregistered routes and returns:
   ```json
   {
     "success": false,
     "message": "Resource not found: GET /non-existent-endpoint"
   }
   ```
3. **Global Error Handling (`middleware/errorHandler.js`)**:
   Catches unexpected server errors and malformed JSON payloads gracefully, preventing unhandled server crashes.

---

## Automated Test Suite

Run the automated integration test suite:

```bash
npm test
```

### Test Suite Execution Output:
```text
=============================================================
 🧪 Running Student Management API Test Suite on port 60265
=============================================================

[2026-09-27T14:40:08.859Z] GET /
 ✓ PASS: GET / returns 200 OK and greeting
[2026-09-27T14:40:08.863Z] GET /students
 ✓ PASS: GET /students returns 200 and list of students
[2026-09-27T14:40:08.865Z] GET /students/1
 ✓ PASS: GET /students/1 returns 200 and student details
[2026-09-27T14:40:08.867Z] GET /students/999
 ✓ PASS: GET /students/999 returns 404 Not Found
[2026-09-27T14:40:08.878Z] POST /students
 ✓ PASS: POST /students without name/course returns 400 Bad Request
[2026-09-27T14:40:08.879Z] POST /students
 ✓ PASS: POST /students returns 201 Created and new student with unique ID
[2026-09-27T14:40:08.880Z] PUT /students/5
 ✓ PASS: PUT /students/:id returns 200 and updated fields
[2026-09-27T14:40:08.882Z] PUT /students/999
 ✓ PASS: PUT /students/999 returns 404 Not Found
[2026-09-27T14:40:08.883Z] DELETE /students/5
 ✓ PASS: DELETE /students/:id returns 200 and deleted student
[2026-09-27T14:40:08.883Z] DELETE /students/999
 ✓ PASS: DELETE /students/999 returns 404 Not Found
[2026-09-27T14:40:08.884Z] GET /non-existent-endpoint
 ✓ PASS: Unhandled route returns 404 Not Found

=============================================================
 Test Summary: 11 passed, 0 failed.
=============================================================
```
