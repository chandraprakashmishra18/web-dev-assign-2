const express = require('express');
const router = express.Router();
let students = require('../data/students');

/**
 * @route   GET /students
 * @desc    Retrieve all students with optional course filter
 * @access  Public
 */
router.get('/', (req, res) => {
  const { course } = req.query;

  if (course) {
    const filtered = students.filter(s =>
      s.course.toLowerCase().includes(course.toLowerCase().trim())
    );
    return res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  }

  return res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

/**
 * @route   GET /students/:id
 * @desc    Retrieve a single student by numeric ID
 * @access  Public
 */
router.get('/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);

  if (isNaN(studentId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid student ID format. ID must be an integer.'
    });
  }

  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${studentId} not found.`
    });
  }

  return res.status(200).json({
    success: true,
    data: student
  });
});

/**
 * @route   POST /students
 * @desc    Create a new student record
 * @access  Public
 */
router.post('/', (req, res) => {
  const { name, course, age, email } = req.body;

  // Validation: require name and course as non-empty strings
  if (
    !name ||
    !course ||
    typeof name !== 'string' ||
    typeof course !== 'string' ||
    name.trim() === '' ||
    course.trim() === ''
  ) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. "name" and "course" are required non-empty string fields.'
    });
  }

  // Validate age if provided
  if (age !== undefined) {
    const numAge = Number(age);
    if (isNaN(numAge) || numAge <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Field "age" must be a valid positive number.'
      });
    }
  }

  // Generate unique auto-increment ID
  const newId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;

  const newStudent = {
    id: newId,
    name: name.trim(),
    course: course.trim(),
    ...(age !== undefined ? { age: Number(age) } : { age: 20 }),
    ...(email && typeof email === 'string' ? { email: email.trim().toLowerCase() } : { email: `${name.trim().toLowerCase().replace(/\s+/g, '.')}@example.com` })
  };

  students.push(newStudent);

  return res.status(201).json({
    success: true,
    message: 'Student registered successfully.',
    data: newStudent
  });
});

/**
 * @route   PUT /students/:id
 * @desc    Update an existing student record by ID
 * @access  Public
 */
router.put('/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);

  if (isNaN(studentId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid student ID format. ID must be an integer.'
    });
  }

  const studentIndex = students.findIndex((s) => s.id === studentId);

  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${studentId} not found.`
    });
  }

  const { name, course, age, email } = req.body;

  if (name === undefined && course === undefined && age === undefined && email === undefined) {
    return res.status(400).json({
      success: false,
      message: 'At least one field (name, course, age, email) is required for update.'
    });
  }

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '"name" must be a non-empty string when provided.'
      });
    }
    students[studentIndex].name = name.trim();
  }

  if (course !== undefined) {
    if (typeof course !== 'string' || course.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '"course" must be a non-empty string when provided.'
      });
    }
    students[studentIndex].course = course.trim();
  }

  if (age !== undefined) {
    const numAge = Number(age);
    if (isNaN(numAge) || numAge <= 0) {
      return res.status(400).json({
        success: false,
        message: '"age" must be a valid positive number.'
      });
    }
    students[studentIndex].age = numAge;
  }

  if (email !== undefined) {
    students[studentIndex].email = typeof email === 'string' ? email.trim() : email;
  }

  return res.status(200).json({
    success: true,
    message: `Student with ID ${studentId} updated successfully.`,
    data: students[studentIndex]
  });
});

/**
 * @route   DELETE /students/:id
 * @desc    Remove a student record by ID
 * @access  Public
 */
router.delete('/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);

  if (isNaN(studentId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid student ID format. ID must be an integer.'
    });
  }

  const studentIndex = students.findIndex((s) => s.id === studentId);

  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${studentId} not found.`
    });
  }

  const [deletedStudent] = students.splice(studentIndex, 1);

  return res.status(200).json({
    success: true,
    message: `Student with ID ${studentId} deleted successfully.`,
    data: deletedStudent
  });
});

module.exports = router;
