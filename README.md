# 🎓 Student Management REST API

A modular, production-ready RESTful API built with **Node.js** and **Express.js** for managing student academic records with full CRUD capabilities, custom middleware logging, data validation, and centralized error handling.

> **Course:** Web Dev III (Node.js & Express Backend)  
> **Assignment:** Lab Assignment 2 - Student Management REST API  
> **Author:** Chandra Prakash Mishra ([@chandraprakashmishra18](https://github.com/chandraprakashmishra18))

---

## 🚀 Key Features

- **Full RESTful CRUD Operations:** Create, Read (all/single with query filtering), Update, and Delete student records.
- **MVC Architecture:** Separation of concerns across Models, Controllers, Routes, and Middleware.
- **Custom Request Logger:** Intercepts HTTP traffic and outputs method, URL, status code, and latency in milliseconds.
- **Robust Input Validation:** Validates required fields, numerical bounds, string lengths, and email patterns before controller execution.
- **Centralized Error Handling:** Standardized JSON error structures for 400 (Bad Request), 404 (Not Found), and 500 (Internal Server Error).
- **Automated Integration Test Suite:** Built-in test runner executing 16 comprehensive automated integration tests.
- **Interactive Web API Console:** Built-in dashboard accessible directly from your browser at `http://localhost:3000`.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Runtime** | Node.js (v18+) | JavaScript execution runtime |
| **Framework** | Express.js 4.x | Fast, unopinionated web framework |
| **Data Layer** | In-Memory Repository | JavaScript Object Store in `models/studentModel.js` |
| **Testing** | Node.js Test Suite | Automated test runner in `tests/test-runner.js` |
| **Frontend UI** | HTML5 / Vanilla CSS / JS | Interactive API Explorer & Dashboard |

---

## 📁 Project Structure

```text
web-dev-assign-2/
├── app.js                      # Express application entry point & pipeline setup
├── package.json                # Project manifest and scripts
├── package-lock.json           # Locked dependency tree
├── .env.example                # Sample environment configuration
├── .gitignore                  # Git exclusions for dependencies and logs
├── controllers/
│   └── studentController.js    # Request/Response handlers and CRUD logic
├── data/
│   └── students.js             # Initial seed student records
├── middleware/
│   ├── errorHandler.js         # Centralized 404 and 500 error handlers
│   ├── logger.js               # Custom HTTP request logger middleware
│   └── validator.js            # Input validation middleware for POST / PUT
├── models/
│   └── studentModel.js         # In-memory data repository layer with query filters
├── public/                     # Interactive API web dashboard
│   ├── app.js                  # Frontend interactive controller
│   ├── index.html              # Modern dark-mode dashboard UI
│   └── style.css               # Styling and responsive design
├── tests/
│   └── test-runner.js          # Automated end-to-end integration test suite
└── README.md                   # Comprehensive project documentation
```

---

## ⚡ Quick Start & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/chandraprakashmishra18/web-dev-assign-2.git
cd web-dev-assign-2
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
# Start server
npm start

# Or start in watch/development mode
npm run dev
```

The server will initialize on:
- 🌐 **Interactive Dashboard:** [http://localhost:3000](http://localhost:3000)
- 📡 **API Documentation:** [http://localhost:3000/api](http://localhost:3000/api)
- 🩺 **Health Check:** [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 🧪 Automated Testing

Execute the automated test suite covering all endpoints, query filters, validation constraints, and error scenarios:

```bash
npm test
```

### Test Suite Execution Output:
```text
=========================================================
 🧪 Running Student Management REST API Test Suite
=========================================================

→ 1. System & Meta Endpoints:
  • GET /api/health returns 200 OK and status message ... ✓ PASSED
  • GET /api returns 200 OK and endpoint specification ... ✓ PASSED

→ 2. GET /students (Read Operations):
  • GET /students returns 200 OK and student list ... ✓ PASSED
  • GET /students?course=Computer returns filtered students ... ✓ PASSED

→ 3. GET /students/:id (Single Record):
  • GET /students/1 returns 200 OK with student record ... ✓ PASSED
  • GET /students/999 (non-existent) returns 404 Not Found ... ✓ PASSED
  • GET /students/invalid-id returns 400 Bad Request ... ✓ PASSED

→ 4. POST /students (Create Operations):
  • POST /students with valid payload returns 201 Created ... ✓ PASSED
  • POST /students missing required 'name' returns 400 Bad Request ... ✓ PASSED
  • POST /students with invalid negative age returns 400 Bad Request ... ✓ PASSED

→ 5. PUT /students/:id (Update Operations):
  • PUT /students/1 updates student record and returns 200 OK ... ✓ PASSED
  • PUT /students/999 (non-existent) returns 404 Not Found ... ✓ PASSED
  • PUT /students/1 with empty payload returns 400 Bad Request ... ✓ PASSED

→ 6. DELETE /students/:id (Delete Operations):
  • DELETE /students/2 removes student and returns 200 OK ... ✓ PASSED
  • DELETE /students/999 (non-existent) returns 404 Not Found ... ✓ PASSED

→ 7. Unmatched Routes & Error Handling:
  • Unmatched route GET /random-nonexistent-path returns 404 JSON ... ✓ PASSED

=========================================================
 Test Summary: 16 Passed, 0 Failed
=========================================================
```

---

## 📖 REST API Specification

### Endpoints Overview

| Method | Endpoint | Description | Status Codes |
|:-------|:---------|:------------|:-------------|
| `GET` | `/students` | Retrieve all student records (supports `?course=`, `?search=`, `?sortBy=`) | `200 OK` |
| `GET` | `/students/:id` | Retrieve single student by numeric ID | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `POST` | `/students` | Create a new student record | `201 Created`, `400 Bad Request` |
| `PUT` | `/students/:id` | Update an existing student record | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/students/:id` | Delete a student record by ID | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `GET` | `/api/health` | Service health and uptime status | `200 OK` |

---

### Detailed Endpoint Documentation

#### 1. `GET /students` - Retrieve All Students
Returns a list of all enrolled students. Supports optional query parameters.

**Query Parameters:**
- `course` (optional): Filter by course name (e.g. `?course=Computer`)
- `search` (optional): Search keyword across name, course, and email
- `sortBy` (optional): Sort by field (`name`, `age`, `gpa`, `id`)
- `sortOrder` (optional): `asc` or `desc`

**cURL Example:**
```bash
curl -X GET http://localhost:3000/students
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "name": "Aarav Sharma",
      "age": 20,
      "course": "Computer Science",
      "email": "aarav.sharma@example.com",
      "semester": 4,
      "gpa": 3.8
    },
    {
      "id": 2,
      "name": "Priya Patel",
      "age": 21,
      "course": "Information Technology",
      "email": "priya.patel@example.com",
      "semester": 6,
      "gpa": 3.9
    }
  ]
}
```

---

#### 2. `GET /students/:id` - Retrieve Single Student
Returns details of a specific student by ID.

**cURL Example:**
```bash
curl -X GET http://localhost:3000/students/1
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Aarav Sharma",
    "age": 20,
    "course": "Computer Science",
    "email": "aarav.sharma@example.com",
    "semester": 4,
    "gpa": 3.8
  }
}
```

**Error Response (`404 Not Found`):**
```json
{
  "success": false,
  "message": "Student with ID 999 not found"
}
```

---

#### 3. `POST /students` - Create Student Record
Creates a new student record. Auto-assigns an incremented ID and creation timestamp.

**Request Body (`application/json`):**
```json
{
  "name": "Rahul Verma",
  "age": 21,
  "course": "Computer Science",
  "email": "rahul.verma@example.com",
  "semester": 4,
  "gpa": 3.75
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"name": "Rahul Verma", "age": 21, "course": "Computer Science", "email": "rahul.verma@example.com"}'
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Student record created successfully",
  "data": {
    "id": 6,
    "name": "Rahul Verma",
    "age": 21,
    "course": "Computer Science",
    "email": "rahul.verma@example.com",
    "semester": 4,
    "gpa": 3.75,
    "createdAt": "2026-09-27T14:15:00.000Z"
  }
}
```

**Validation Error Response (`400 Bad Request`):**
```json
{
  "success": false,
  "message": "Field 'name' is required and must be a non-empty string.",
  "errors": [
    "Field 'name' is required and must be a non-empty string."
  ]
}
```

---

#### 4. `PUT /students/:id` - Update Student Record
Updates one or more fields of an existing student record.

**Request Body (`application/json`):**
```json
{
  "course": "Advanced Artificial Intelligence",
  "gpa": 3.95
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:3000/students/1 \
  -H "Content-Type: application/json" \
  -d '{"course": "Advanced Artificial Intelligence", "gpa": 3.95}'
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Student record updated successfully",
  "data": {
    "id": 1,
    "name": "Aarav Sharma",
    "age": 20,
    "course": "Advanced Artificial Intelligence",
    "email": "aarav.sharma@example.com",
    "semester": 4,
    "gpa": 3.95,
    "updatedAt": "2026-09-27T14:16:20.000Z"
  }
}
```

---

#### 5. `DELETE /students/:id` - Delete Student Record
Removes a student record from the repository by ID.

**cURL Example:**
```bash
curl -X DELETE http://localhost:3000/students/1
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Student record deleted successfully",
  "data": {
    "id": 1,
    "name": "Aarav Sharma",
    "age": 20,
    "course": "Computer Science"
  }
}
```

**Error Response (`404 Not Found`):**
```json
{
  "success": false,
  "message": "Student with ID 999 not found"
}
```

---

## 🛡️ HTTP Status Codes Reference

| Code | Status | Meaning in this API |
|:-----|:-------|:---------------------|
| `200` | **OK** | Standard success response for `GET`, `PUT`, and `DELETE`. |
| `201` | **Created** | Successful resource creation in `POST /students`. |
| `400` | **Bad Request** | Malformed request body, missing mandatory fields, or invalid types. |
| `404` | **Not Found** | Specified student ID or URL endpoint does not exist. |
| `500` | **Internal Server Error** | Unexpected exception caught by global error handling middleware. |

---

## 👨‍💻 Author

**Chandra Prakash Mishra**
- **GitHub:** [@chandraprakashmishra18](https://github.com/chandraprakashmishra18)
- **Course:** Web Dev III (Node.js & Express Backend)
- **Assignment:** Lab Assignment 2 - Student Management REST API
