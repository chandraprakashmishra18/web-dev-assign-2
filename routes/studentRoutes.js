const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require("../controllers/studentController");
const {
  validateCreateStudent,
  validateUpdateStudent,
  validateStudentId
} = require("../middleware/validator");

/**
 * @route   /students
 */
router
  .route("/")
  .get(getAllStudents)
  .post(validateCreateStudent, createStudent);

/**
 * @route   /students/:id
 */
router
  .route("/:id")
  .get(validateStudentId, getStudentById)
  .put(validateUpdateStudent, updateStudent)
  .delete(validateStudentId, deleteStudent);

module.exports = router;
