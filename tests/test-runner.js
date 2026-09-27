/**
 * Automated REST API Integration Test Suite
 * Tests all endpoints, status codes, validations, and edge cases.
 */

const http = require("http");
const app = require("../app");
const studentModel = require("../models/studentModel");

let server;
let BASE_URL;
let passedCount = 0;
let failedCount = 0;

// Color helpers for terminal output
const green = (text) => `\x1b[32m${text}\x1b[0m`;
const red = (text) => `\x1b[31m${text}\x1b[0m`;
const cyan = (text) => `\x1b[36m${text}\x1b[0m`;
const yellow = (text) => `\x1b[33m${text}\x1b[0m`;
const bold = (text) => `\x1b[1m${text}\x1b[0m`;

async function makeRequest(method, path, body = null) {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  let json = null;
  try {
    json = await res.json();
  } catch (e) {
    json = null;
  }

  return {
    status: res.status,
    headers: res.headers,
    body: json
  };
}

async function runTest(title, testFn) {
  process.stdout.write(`  • ${title} ... `);
  try {
    await testFn();
    passedCount++;
    console.log(green("✓ PASSED"));
  } catch (err) {
    failedCount++;
    console.log(red("✗ FAILED"));
    console.log(red(`    Error: ${err.message}`));
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

async function runAllTests() {
  console.log("\n" + bold(cyan("=========================================================")));
  console.log(bold(cyan(" 🧪 Running Student Management REST API Test Suite")));
  console.log(bold(cyan("=========================================================\n")));

  // Start temporary test server on ephemeral port
  server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, () => {
      const port = server.address().port;
      BASE_URL = `http://localhost:${port}`;
      resolve();
    });
  });

  // Reset in-memory database before running suite
  studentModel.reset();

  try {
    // 1. Health check & Documentation
    console.log(bold(yellow("→ 1. System & Meta Endpoints:")));
    await runTest("GET /api/health returns 200 OK and status message", async () => {
      const res = await makeRequest("GET", "/api/health");
      assert(res.status === 200, `Expected status 200, got ${res.status}`);
      assert(res.body.success === true, "Expected success: true");
    });

    await runTest("GET /api returns 200 OK and endpoint specification", async () => {
      const res = await makeRequest("GET", "/api");
      assert(res.status === 200, `Expected status 200, got ${res.status}`);
      assert(res.body.endpoints && res.body.endpoints["GET /students"], "Expected endpoint catalog in response");
    });

    // 2. GET /students
    console.log("\n" + bold(yellow("→ 2. GET /students (Read Operations):")));
    await runTest("GET /students returns 200 OK and student list", async () => {
      const res = await makeRequest("GET", "/students");
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.body.success === true, "Expected success: true");
      assert(Array.isArray(res.body.data), "Expected data to be an array");
      assert(res.body.count === res.body.data.length, "Expected count to equal data length");
      assert(res.body.data.length >= 5, "Expected at least 5 initial seed students");
    });

    await runTest("GET /students?course=Computer returns filtered students", async () => {
      const res = await makeRequest("GET", "/students?course=Computer");
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.body.data.every(s => s.course.toLowerCase().includes("computer")), "Expected all students to match course filter");
    });

    // 3. GET /students/:id
    console.log("\n" + bold(yellow("→ 3. GET /students/:id (Single Record):")));
    await runTest("GET /students/1 returns 200 OK with student record", async () => {
      const res = await makeRequest("GET", "/students/1");
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.body.success === true, "Expected success: true");
      assert(res.body.data.id === 1, `Expected ID 1, got ${res.body.data.id}`);
      assert(res.body.data.name === "Aarav Sharma", `Expected Aarav Sharma, got ${res.body.data.name}`);
    });

    await runTest("GET /students/999 (non-existent) returns 404 Not Found", async () => {
      const res = await makeRequest("GET", "/students/999");
      assert(res.status === 404, `Expected 404, got ${res.status}`);
      assert(res.body.success === false, "Expected success: false");
      assert(res.body.message.includes("not found"), "Expected not found message");
    });

    await runTest("GET /students/invalid-id returns 400 Bad Request", async () => {
      const res = await makeRequest("GET", "/students/invalid-id");
      assert(res.status === 400, `Expected 400, got ${res.status}`);
      assert(res.body.success === false, "Expected success: false");
    });

    // 4. POST /students
    console.log("\n" + bold(yellow("→ 4. POST /students (Create Operations):")));
    await runTest("POST /students with valid payload returns 201 Created", async () => {
      const payload = {
        name: "Karan Singh",
        age: 22,
        course: "Artificial Intelligence",
        email: "karan.singh@example.com",
        semester: 5,
        gpa: 3.85
      };
      const res = await makeRequest("POST", "/students", payload);
      assert(res.status === 201, `Expected 201, got ${res.status}`);
      assert(res.body.success === true, "Expected success: true");
      assert(res.body.data.name === "Karan Singh", "Expected name to match payload");
      assert(typeof res.body.data.id === "number", "Expected numeric ID to be generated");
    });

    await runTest("POST /students missing required 'name' returns 400 Bad Request", async () => {
      const payload = { age: 20, course: "Civil" };
      const res = await makeRequest("POST", "/students", payload);
      assert(res.status === 400, `Expected 400, got ${res.status}`);
      assert(res.body.success === false, "Expected success: false");
    });

    await runTest("POST /students with invalid negative age returns 400 Bad Request", async () => {
      const payload = { name: "Test Student", age: -5, course: "Physics" };
      const res = await makeRequest("POST", "/students", payload);
      assert(res.status === 400, `Expected 400, got ${res.status}`);
      assert(res.body.success === false, "Expected success: false");
    });

    // 5. PUT /students/:id
    console.log("\n" + bold(yellow("→ 5. PUT /students/:id (Update Operations):")));
    await runTest("PUT /students/1 updates student record and returns 200 OK", async () => {
      const updatePayload = {
        course: "Advanced Artificial Intelligence",
        gpa: 3.98
      };
      const res = await makeRequest("PUT", "/students/1", updatePayload);
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.body.success === true, "Expected success: true");
      assert(res.body.data.course === "Advanced Artificial Intelligence", "Course not updated");
      assert(res.body.data.gpa === 3.98, "GPA not updated");
      assert(res.body.data.name === "Aarav Sharma", "Existing name should remain intact");
    });

    await runTest("PUT /students/999 (non-existent) returns 404 Not Found", async () => {
      const res = await makeRequest("PUT", "/students/999", { name: "Nobody" });
      assert(res.status === 404, `Expected 404, got ${res.status}`);
      assert(res.body.success === false, "Expected success: false");
    });

    await runTest("PUT /students/1 with empty payload returns 400 Bad Request", async () => {
      const res = await makeRequest("PUT", "/students/1", {});
      assert(res.status === 400, `Expected 400, got ${res.status}`);
      assert(res.body.success === false, "Expected success: false");
    });

    // 6. DELETE /students/:id
    console.log("\n" + bold(yellow("→ 6. DELETE /students/:id (Delete Operations):")));
    await runTest("DELETE /students/2 removes student and returns 200 OK", async () => {
      const res = await makeRequest("DELETE", "/students/2");
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.body.success === true, "Expected success: true");
      assert(res.body.data.id === 2, "Expected deleted student ID to be 2");

      // Verify record is gone
      const verifyRes = await makeRequest("GET", "/students/2");
      assert(verifyRes.status === 404, "Deleted student should now return 404");
    });

    await runTest("DELETE /students/999 (non-existent) returns 404 Not Found", async () => {
      const res = await makeRequest("DELETE", "/students/999");
      assert(res.status === 404, `Expected 404, got ${res.status}`);
      assert(res.body.success === false, "Expected success: false");
    });

    // 7. 404 Route Catch-all
    console.log("\n" + bold(yellow("→ 7. Unmatched Routes & Error Handling:")));
    await runTest("Unmatched route GET /random-nonexistent-path returns 404 JSON", async () => {
      const res = await makeRequest("GET", "/random-nonexistent-path");
      assert(res.status === 404, `Expected 404, got ${res.status}`);
      assert(res.body.success === false, "Expected success: false");
    });

  } finally {
    // Teardown test server
    server.close();
  }

  // Summary report
  console.log("\n" + bold(cyan("=========================================================")));
  console.log(bold(` Test Summary: ${green(`${passedCount} Passed`)}, ${failedCount > 0 ? red(`${failedCount} Failed`) : "0 Failed"}`));
  console.log(bold(cyan("=========================================================\n")));

  if (failedCount > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error("Test runner encountered critical error:", err);
  process.exit(1);
});
