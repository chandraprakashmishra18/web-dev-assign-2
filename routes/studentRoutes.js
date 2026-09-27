const express = require('express');
const router = express.Router();
let students = require('../data/students');

// GET /students - Retrieve all students
router.get('/', (req, res) => {
  res.status(200).json(students);
});

// GET /students/:id - Retrieve a student by ID
router.get('/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  res.status(200).json(student);
});

// POST /students - Create a new student
router.post('/', (req, res) => {
  const { name, age, course } = req.body;

  if (!name || !age || !course) {
    return res.status(400).json({ message: 'Name, age, and course are required' });
  }

  const numericAge = parseInt(age, 10);
  if (isNaN(numericAge) || numericAge <= 0) {
    return res.status(400).json({ message: 'Age must be a valid positive number' });
  }

  const newStudent = {
    id: students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1,
    name: name.trim(),
    age: numericAge,
    course: course.trim()
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});

// PUT /students/:id - Update an existing student
router.put('/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const { name, age, course } = req.body;

  if (!name && !age && !course) {
    return res.status(400).json({ message: 'At least one field (name, age, course) is required to update' });
  }

  if (name) student.name = name.trim();
  if (age) {
    const numericAge = parseInt(age, 10);
    if (isNaN(numericAge) || numericAge <= 0) {
      return res.status(400).json({ message: 'Age must be a valid positive number' });
    }
    student.age = numericAge;
  }
  if (course) student.course = course.trim();

  res.status(200).json(student);
});

// DELETE /students/:id - Delete a student
router.delete('/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const index = students.findIndex((s) => s.id === studentId);

  if (index === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  students.splice(index, 1);
  res.status(200).json({ message: 'Student deleted successfully' });
});

module.exports = router;
