const mongoose = require('mongoose');

/**
 * Student schema matching the original MySQL `students` table fields and constraints.
 */
const studentSchema = new mongoose.Schema(
  {
    roll_no: {
      type: String,
      required: [true, 'Roll Number is required'],
      unique: true,
      trim: true,
      maxlength: [20, 'Roll Number cannot exceed 20 characters'],
    },
    name: {
      type: String,
      required: [true, 'Student Name is required'],
      trim: true,
      maxlength: [100, 'Student Name cannot exceed 100 characters'],
    },
    course: {
      type: String,
      default: '',
      trim: true,
      maxlength: [50, 'Course cannot exceed 50 characters'],
    },
    semester: {
      type: Number,
      default: null,
      min: [1, 'Semester must be between 1 and 8'],
      max: [8, 'Semester must be between 1 and 8'],
    },
    email: {
      type: String,
      default: '',
      trim: true,
      maxlength: [100, 'Email cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      default: '',
      trim: true,
      maxlength: [15, 'Phone cannot exceed 15 characters'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Student', studentSchema);
