const initialStudents = require("../data/students");

/**
 * In-Memory Student Repository Model
 * Handles data store manipulation and query filtering.
 */
class StudentModel {
  constructor() {
    // Clone initial seed data to prevent mutation of raw file
    this.students = JSON.parse(JSON.stringify(initialStudents));
  }

  /**
   * Fetch all students with optional filtering and sorting
   * @param {Object} query - Filtering and sorting options
   * @returns {Array} List of matching student objects
   */
  getAll(query = {}) {
    let result = [...this.students];

    // Filter by course (case-insensitive substring or exact match)
    if (query.course) {
      const courseFilter = query.course.toLowerCase().trim();
      result = result.filter(student =>
        student.course.toLowerCase().includes(courseFilter)
      );
    }

    // Keyword search across name, course, and email
    if (query.search) {
      const searchKey = query.search.toLowerCase().trim();
      result = result.filter(
        student =>
          student.name.toLowerCase().includes(searchKey) ||
          student.course.toLowerCase().includes(searchKey) ||
          (student.email && student.email.toLowerCase().includes(searchKey))
      );
    }

    // Sort by field (e.g., id, name, age, gpa)
    if (query.sortBy) {
      const field = query.sortBy;
      const order = query.sortOrder === "desc" ? -1 : 1;

      result.sort((a, b) => {
        if (a[field] < b[field]) return -1 * order;
        if (a[field] > b[field]) return 1 * order;
        return 0;
      });
    }

    return result;
  }

  /**
   * Find a single student by numeric ID
   * @param {number} id - Student ID
   * @returns {Object|null} Student object or null
   */
  getById(id) {
    const numericId = Number(id);
    return this.students.find(student => student.id === numericId) || null;
  }

  /**
   * Compute next auto-incrementing ID
   * @returns {number} Next unique ID
   */
  generateNextId() {
    if (this.students.length === 0) return 1;
    const maxId = Math.max(...this.students.map(s => s.id));
    return maxId + 1;
  }

  /**
   * Create a new student record
   * @param {Object} studentData - Student details
   * @returns {Object} Newly created student object
   */
  create({ name, age, course, email, semester, gpa }) {
    const newStudent = {
      id: this.generateNextId(),
      name: name.trim(),
      age: Number(age),
      course: course.trim(),
      email: email ? email.trim().toLowerCase() : `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      semester: semester !== undefined ? Number(semester) : 1,
      gpa: gpa !== undefined ? Number(gpa) : 3.5,
      createdAt: new Date().toISOString()
    };

    this.students.push(newStudent);
    return newStudent;
  }

  /**
   * Update an existing student record by ID
   * @param {number} id - Student ID
   * @param {Object} updateData - Fields to update
   * @returns {Object|null} Updated student object or null if not found
   */
  update(id, updateData) {
    const numericId = Number(id);
    const index = this.students.findIndex(s => s.id === numericId);

    if (index === -1) {
      return null;
    }

    const current = this.students[index];

    const updatedStudent = {
      ...current,
      name: updateData.name !== undefined ? updateData.name.trim() : current.name,
      age: updateData.age !== undefined ? Number(updateData.age) : current.age,
      course: updateData.course !== undefined ? updateData.course.trim() : current.course,
      email: updateData.email !== undefined ? updateData.email.trim().toLowerCase() : current.email,
      semester: updateData.semester !== undefined ? Number(updateData.semester) : current.semester,
      gpa: updateData.gpa !== undefined ? Number(updateData.gpa) : current.gpa,
      updatedAt: new Date().toISOString()
    };

    this.students[index] = updatedStudent;
    return updatedStudent;
  }

  /**
   * Delete a student record by ID
   * @param {number} id - Student ID
   * @returns {Object|null} Deleted student object or null if not found
   */
  delete(id) {
    const numericId = Number(id);
    const index = this.students.findIndex(s => s.id === numericId);

    if (index === -1) {
      return null;
    }

    const [deletedStudent] = this.students.splice(index, 1);
    return deletedStudent;
  }

  /**
   * Reset repository state to initial seed data (useful for test isolation)
   */
  reset() {
    this.students = JSON.parse(JSON.stringify(initialStudents));
  }
}

// Singleton instance
module.exports = new StudentModel();
