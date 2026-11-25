const express = require('express');
const {
  getAllStudents,
  getStudentByRoll,
  createStudent,
  updateStudentByRoll,
  deleteStudentByRoll,
} = require('../controllers/studentController');

const router = express.Router();

router.get('/', getAllStudents);
router.get('/:roll', getStudentByRoll);
router.post('/', createStudent);
router.put('/:roll', updateStudentByRoll);
router.delete('/:roll', deleteStudentByRoll);

module.exports = router;
