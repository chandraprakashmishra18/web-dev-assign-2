# Student Management REST API

A simple RESTful API built using **Node.js** and **Express.js** to perform CRUD (Create, Read, Update, Delete) operations on student records. Student data is stored in-memory using a JavaScript array, making the project lightweight and suitable for learning REST API fundamentals.

---

## Author

| Field | Details |
|-------|---------|
| **Name** | Chandra Prakash Mishra |
| **GitHub** | [@chandraprakashmishra18](https://github.com/chandraprakashmishra18) |
| **Course** | Web Development III (Node.js & Express Backend) |
| **Assignment** | Lab Assignment 2 – Student Management REST API |

---

## Project Overview

This project demonstrates the implementation of a REST API using Express.js. It includes CRUD operations, modular routing, custom middleware, and proper HTTP status codes without using any database.

---

## Features

- RESTful API design
- Express.js server
- CRUD operations (Create, Read, Update, Delete)
- Modular routing with `express.Router()`
- Custom logger middleware
- JSON request handling and validation
- Proper HTTP status codes (200, 201, 400, 404, 500)
- In-memory data storage
- Postman and Thunder Client compatible
- Automated test script (`test_api.js`)

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js

---

## Project Structure

```text
web-dev-assign-2/
├── app.js
├── package.json
├── package-lock.json
├── test_api.js
├── routes/
│   └── studentRoutes.js
├── middleware/
│   ├── logger.js
│   └── errorHandler.js
├── data/
│   └── students.js
└── README.md
```

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/chandraprakashmishra18/web-dev-assign-2.git
cd web-dev-assign-2
npm install
```

---

## Running the Server

Start the application with npm:

```bash
npm start
```

or using Node directly:

```bash
node app.js
```

The server will start on http://localhost:3000.

---

## API Endpoints

### 1. Root Endpoint (API Info)

```http
GET /
```

Returns API metadata and the list of available endpoints.

---

### 2. Get All Students

```http
GET /students
```

Returns a list of all enrolled students.

**Response (`200 OK`):**
```json
[
  { "id": 1, "name": "Aarav Sharma", "age": 20, "course": "Computer Science" },
  { "id": 2, "name": "Priya Patel", "age": 22, "course": "Information Technology" },
  { "id": 3, "name": "Rohan Mehta", "age": 21, "course": "Software Engineering" },
  { "id": 4, "name": "Ananya Iyer", "age": 19, "course": "Data Science" }
]
```

---

### 3. Get Student by ID

```http
GET /students/:id
```

**Success Response (`200 OK`):**
```json
{
  "id": 1,
  "name": "Aarav Sharma",
  "age": 20,
  "course": "Computer Science"
}
```

**Error Response (`404 Not Found`):**
```json
{
  "message": "Student not found"
}
```

---

### 4. Add Student

```http
POST /students
```

**Example Request Body (`application/json`):**
```json
{
  "name": "Rahul Verma",
  "age": 20,
  "course": "Computer Science"
}
```

**Success Response (`201 Created`):**
```json
{
  "id": 5,
  "name": "Rahul Verma",
  "age": 20,
  "course": "Computer Science"
}
```

**Validation Error Response (`400 Bad Request`):**
```json
{
  "message": "Name, age, and course are required"
}
```

---

### 5. Update Student

```http
PUT /students/:id
```

**Example Request Body (`application/json`):**
```json
{
  "course": "Software Engineering"
}
```

**Success Response (`200 OK`):**
```json
{
  "id": 1,
  "name": "Aarav Sharma",
  "age": 20,
  "course": "Software Engineering"
}
```

**Error Response (`404 Not Found`):**
```json
{
  "message": "Student not found"
}
```

---

### 6. Delete Student

```http
DELETE /students/:id
```

**Success Response (`200 OK`):**
```json
{
  "message": "Student deleted successfully"
}
```

**Error Response (`404 Not Found`):**
```json
{
  "message": "Student not found"
}
```

---

## Middleware

The application utilizes two custom middleware components:

- **Logger Middleware (`middleware/logger.js`)**  
  Logs incoming HTTP requests including the HTTP method, requested route, and timestamp, simplifying API request monitoring and debugging during development.

- **Global Error Handler (`middleware/errorHandler.js`)**  
  Centralizes error handling by returning clean JSON responses with standard HTTP status codes. It detects malformed JSON payloads and returns a **400 Bad Request** error instead of terminating the server.

---

## Testing

The project includes an automated API test suite in `test_api.js` that tests all endpoints and status codes:

```bash
npm test
```

or:

```bash
node test_api.js
```

### Automated Test Output:
```text
Running API tests...

[2026-09-27T14:18:50.383Z] GET /
✓ Root route
[2026-09-27T14:18:50.388Z] GET /students
✓ Get all students
[2026-09-27T14:18:50.389Z] GET /students/1
✓ Get student by ID
[2026-09-27T14:18:50.390Z] GET /students/999
✓ Invalid student returns 404
[2026-09-27T14:18:50.398Z] POST /students
✓ Create with missing fields
[2026-09-27T14:18:50.400Z] POST /students
✓ Create student
[2026-09-27T14:18:50.402Z] PUT /students/5
✓ Update student
[2026-09-27T14:18:50.403Z] PUT /students/999
✓ Update invalid student
[2026-09-27T14:18:50.404Z] DELETE /students/5
✓ Delete student
[2026-09-27T14:18:50.406Z] DELETE /students/999
✓ Delete invalid student
[2026-09-27T14:18:50.408Z] GET /random-route
✓ Unknown route

----------------------------
Passed : 11
Failed : 0
----------------------------
```

---

## Learning Outcomes

- Express.js application setup and structure
- REST API design principles
- CRUD operations on in-memory collections
- Modular routing with Express Router
- Custom logging middleware implementation
- Centralized error and 404 handling
- Automated API endpoint testing using Node.js
