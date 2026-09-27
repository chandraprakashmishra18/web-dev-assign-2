const studentModel = require("../models/studentModel");

/**
 * Controller handling Student REST API endpoints logic
 */

/**
 * @desc    Get all students (supports optional filtering/sorting)
 * @route   GET /students
 * @access  Public
 */
const getAllStudents = (req, res, next) => {
  try {
    const students = studentModel.getAll(req.query);

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single student by ID
 * @route   GET /students/:id
 * @access  Public
 */
const getStudentById = (req, res, next) => {
  try {
    const { id } = req.params;
    const student = studentModel.getById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new student record
 * @route   POST /students
 * @access  Public
 */
const createStudent = (req, res, next) => {
  try {
    const { name, age, course, email, semester, gpa } = req.body;

    const newStudent = studentModel.create({
      name,
      age,
      course,
      email,
      semester,
      gpa
    });

    return res.status(201).json({
      success: true,
      message: "Student record created successfully",
      data: newStudent
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing student record
 * @route   PUT /students/:id
 * @access  Public
 */
const updateStudent = (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedStudent = studentModel.update(id, req.body);

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student record updated successfully",
      data: updatedStudent
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a student record
 * @route   DELETE /students/:id
 * @access  Public
 */
const deleteStudent = (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedStudent = studentModel.delete(id);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student record deleted successfully",
      data: deletedStudent
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
