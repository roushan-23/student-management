const Student = require('../models/Student');

/**
 * Normalizes optional string fields into trimmed strings.
 */
function normalizeString(value) {
  return value !== undefined && value !== null ? String(value).trim() : '';
}

/**
 * Parses an optional semester value into an integer or null.
 * Returns { error } if a non-empty non-numeric value is provided.
 */
function parseSemester(rawSemester) {
  if (rawSemester === undefined || rawSemester === null || String(rawSemester).trim() === '') {
    return { value: null };
  }

  const parsed = Number(String(rawSemester).trim());
  if (!Number.isInteger(parsed)) {
    return { error: 'Semester must be a valid integer' };
  }

  return { value: parsed };
}

/**
 * Builds validated student fields shared across create and update operations.
 */
function extractStudentFields(body) {
  const { name, course, semester, email, phone } = body;
  const semesterResult = parseSemester(semester);
  if (semesterResult.error) {
    return { error: semesterResult.error };
  }

  return {
    fields: {
      name: normalizeString(name),
      course: normalizeString(course),
      semester: semesterResult.value,
      email: normalizeString(email),
      phone: normalizeString(phone),
    },
  };
}

/**
 * Maps Mongoose and unexpected errors to consistent HTTP responses.
 */
function handleControllerError(res, error, context) {
  if (error.code === 11000) {
    return res.status(400).json({ message: 'Roll number already exists' });
  }

  if (error.name === 'ValidationError') {
    const firstMessage = Object.values(error.errors)[0]?.message || 'Validation failed';
    return res.status(400).json({ message: firstMessage });
  }

  console.error(`Error ${context}:`, error.message);
  return res.status(500).json({ message: `Database error: ${error.message}` });
}

/**
 * GET /api/students - Fetch all students ordered chronologically.
 */
async function getAllStudents(req, res) {
  try {
    const students = await Student.find().sort({ createdAt: 1, _id: 1 });
    return res.status(200).json(students);
  } catch (error) {
    return handleControllerError(res, error, 'fetching students');
  }
}

/**
 * GET /api/students/:roll - Search student by Roll Number.
 */
async function getStudentByRoll(req, res) {
  const rollNo = normalizeString(req.params.roll);
  if (!rollNo) {
    return res.status(400).json({ message: 'Roll number is required' });
  }

  try {
    const student = await Student.findOne({ roll_no: rollNo });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    return res.status(200).json(student);
  } catch (error) {
    return handleControllerError(res, error, 'searching student');
  }
}

/**
 * POST /api/students - Add a new student.
 */
async function createStudent(req, res) {
  const rollNo = normalizeString(req.body.roll_no);
  const name = normalizeString(req.body.name);

  if (!rollNo || !name) {
    return res.status(400).json({ message: 'Roll Number and Name are required fields' });
  }

  const { fields, error } = extractStudentFields(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  try {
    const createdStudent = await Student.create({
      roll_no: rollNo,
      ...fields,
    });

    return res.status(201).json({
      message: 'Student added successfully.',
      studentId: createdStudent._id,
      student: createdStudent,
    });
  } catch (err) {
    return handleControllerError(res, err, 'adding student');
  }
}

/**
 * PUT /api/students/:roll - Update student details (Roll Number remains immutable).
 */
async function updateStudentByRoll(req, res) {
  const rollNo = normalizeString(req.params.roll);
  const name = normalizeString(req.body.name);

  if (!name) {
    return res.status(400).json({ message: 'Student Name is required' });
  }

  const { fields, error } = extractStudentFields(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { roll_no: rollNo },
      { $set: fields },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.status(200).json({
      message: 'Student updated successfully.',
      student: updatedStudent,
    });
  } catch (err) {
    return handleControllerError(res, err, 'updating student');
  }
}

/**
 * DELETE /api/students/:roll - Delete a student by Roll Number.
 */
async function deleteStudentByRoll(req, res) {
  const rollNo = normalizeString(req.params.roll);

  try {
    const deletedStudent = await Student.findOneAndDelete({ roll_no: rollNo });
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.status(200).json({ message: 'Student deleted successfully.' });
  } catch (error) {
    return handleControllerError(res, error, 'deleting student');
  }
}

module.exports = {
  getAllStudents,
  getStudentByRoll,
  createStudent,
  updateStudentByRoll,
  deleteStudentByRoll,
};
