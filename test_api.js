const http = require("http");
const app = require("./app");

const PORT = 3001;

function sendRequest(path, method = "GET", body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: PORT,
      path,
      method,
      headers: {
        "Content-Type": "application/json"
      }
    };

    const req = http.request(options, (res) => {
      let response = "";

      res.on("data", (chunk) => {
        response += chunk;
      });

      res.on("end", () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(response)
          });
        } catch {
          resolve({
            status: res.statusCode,
            body: response
          });
        }
      });
    });

    req.on("error", reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

const server = app.listen(PORT, async () => {
  console.log("Running API tests...\n");

  let passed = 0;
  let failed = 0;

  function check(testName, condition) {
    if (condition) {
      console.log(`✓ ${testName}`);
      passed++;
    } else {
      console.log(`✗ ${testName}`);
      failed++;
    }
  }

  try {
    const home = await sendRequest("/");
    check("Root route", home.status === 200);

    const allStudents = await sendRequest("/students");
    check(
      "Get all students",
      allStudents.status === 200 && Array.isArray(allStudents.body)
    );

    const student = await sendRequest("/students/1");
    check(
      "Get student by ID",
      student.status === 200 && student.body.id === 1
    );

    const invalidStudent = await sendRequest("/students/999");
    check("Invalid student returns 404", invalidStudent.status === 404);

    const invalidPost = await sendRequest("/students", "POST", {});
    check("Create with missing fields", invalidPost.status === 400);

    const create = await sendRequest("/students", "POST", {
      name: "Rahul",
      age: 20,
      course: "Computer Science"
    });

    check("Create student", create.status === 201 && create.body.name === "Rahul");

    const id = create.body.id;

    const update = await sendRequest(`/students/${id}`, "PUT", {
      course: "Software Engineering"
    });

    check(
      "Update student",
      update.status === 200 &&
      update.body.course === "Software Engineering"
    );

    const updateInvalid = await sendRequest("/students/999", "PUT", {
      name: "Unknown"
    });

    check("Update invalid student", updateInvalid.status === 404);

    const remove = await sendRequest(`/students/${id}`, "DELETE");
    check("Delete student", remove.status === 200);

    const removeInvalid = await sendRequest("/students/999", "DELETE");
    check("Delete invalid student", removeInvalid.status === 404);

    const unknownRoute = await sendRequest("/random-route");
    check("Unknown route", unknownRoute.status === 404);

    console.log("\n----------------------------");
    console.log(`Passed : ${passed}`);
    console.log(`Failed : ${failed}`);
    console.log("----------------------------");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test Error:", err.message);
    process.exit(1);
  } finally {
    server.close();
  }
});
