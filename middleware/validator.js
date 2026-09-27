/**
 * Validation Middleware for Student API endpoints
 */

/**
 * Validates request body for student creation (POST /students)
 */
const validateCreateStudent = (req, res, next) => {
  const { name, age, course, email, gpa, semester } = req.body;

  const errors = [];

  // Check required fields
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Field 'name' is required and must be a non-empty string.");
  }

  if (age === undefined || age === null || age === "") {
    errors.push("Field 'age' is required.");
  } else {
    const numAge = Number(age);
    if (isNaN(numAge) || !Number.isInteger(numAge) || numAge <= 0 || numAge > 120) {
      errors.push("Field 'age' must be a valid positive integer between 1 and 120.");
    }
  }

  if (!course || typeof course !== "string" || course.trim().length === 0) {
    errors.push("Field 'course' is required and must be a non-empty string.");
  }

  // Validate optional fields if present
  if (email && (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email))) {
    errors.push("Field 'email' must be a valid email address.");
  }

  if (gpa !== undefined) {
    const numGpa = Number(gpa);
    if (isNaN(numGpa) || numGpa < 0 || numGpa > 4.0) {
      errors.push("Field 'gpa' must be a number between 0.0 and 4.0.");
    }
  }

  if (semester !== undefined) {
    const numSem = Number(semester);
    if (isNaN(numSem) || !Number.isInteger(numSem) || numSem < 1 || numSem > 12) {
      errors.push("Field 'semester' must be an integer between 1 and 12.");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.length === 1 ? errors[0] : "Validation failed for student creation",
      errors: errors
    });
  }

  next();
};

/**
 * Validates request body and params for student update (PUT /students/:id)
 */
const validateUpdateStudent = (req, res, next) => {
  const { id } = req.params;
  const numericId = Number(id);

  if (isNaN(numericId) || !Number.isInteger(numericId) || numericId <= 0) {
    return res.status(400).json({
      success: false,
      message: "Student ID must be a valid positive integer"
    });
  }

  const { name, age, course, email, gpa, semester } = req.body;

  // Ensure at least one updatable field is provided
  const hasUpdateFields =
    name !== undefined ||
    age !== undefined ||
    course !== undefined ||
    email !== undefined ||
    gpa !== undefined ||
    semester !== undefined;

  if (!hasUpdateFields) {
    return res.status(400).json({
      success: false,
      message: "Please provide at least one field to update (name, age, course, email, semester, gpa)"
    });
  }

  const errors = [];

  if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
    errors.push("Field 'name' cannot be empty.");
  }

  if (age !== undefined) {
    const numAge = Number(age);
    if (isNaN(numAge) || !Number.isInteger(numAge) || numAge <= 0 || numAge > 120) {
      errors.push("Field 'age' must be a valid positive integer between 1 and 120.");
    }
  }

  if (course !== undefined && (typeof course !== "string" || course.trim().length === 0)) {
    errors.push("Field 'course' cannot be empty.");
  }

  if (email !== undefined && (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email))) {
    errors.push("Field 'email' must be a valid email address.");
  }

  if (gpa !== undefined) {
    const numGpa = Number(gpa);
    if (isNaN(numGpa) || numGpa < 0 || numGpa > 4.0) {
      errors.push("Field 'gpa' must be a number between 0.0 and 4.0.");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.length === 1 ? errors[0] : "Validation failed for student update",
      errors: errors
    });
  }

  next();
};

/**
 * Validates route parameter :id
 */
const validateStudentId = (req, res, next) => {
  const { id } = req.params;
  const numericId = Number(id);

  if (isNaN(numericId) || !Number.isInteger(numericId) || numericId <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid student ID. ID must be a positive integer."
    });
  }

  next();
};

module.exports = {
  validateCreateStudent,
  validateUpdateStudent,
  validateStudentId
};
