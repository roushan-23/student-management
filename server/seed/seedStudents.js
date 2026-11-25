const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Student = require('../models/Student');

dotenv.config();

const SAMPLE_STUDENTS = [
  {
    roll_no: '24BCA001',
    name: 'Rahul Kumar',
    course: 'BCA',
    semester: 5,
    email: 'rahul@gmail.com',
    phone: '9876543210',
  },
  {
    roll_no: '24BCA002',
    name: 'Aman Sharma',
    course: 'BCA',
    semester: 5,
    email: 'aman@gmail.com',
    phone: '9876543211',
  },
  {
    roll_no: '3474U35',
    name: 'Roushan Kumar',
    course: 'BCA',
    semester: 5,
    email: 'roushan@gmail.com',
    phone: '9876543212',
  },
  {
    roll_no: '24BCA003',
    name: 'Amit Patel',
    course: 'BCA',
    semester: 3,
    email: 'amit.patel@gmail.com',
    phone: '9876543213',
  },
  {
    roll_no: '24BCA004',
    name: 'Sneha Singh',
    course: 'BCA',
    semester: 1,
    email: 'sneha.singh@gmail.com',
    phone: '9876543214',
  },
];

/**
 * Idempotently seeds the 5 initial sample students into MongoDB.
 */
async function seedDatabase() {
  await connectDB();

  const operations = SAMPLE_STUDENTS.map((student) => ({
    updateOne: {
      filter: { roll_no: student.roll_no },
      update: { $set: student },
      upsert: true,
    },
  }));

  const result = await Student.bulkWrite(operations);
  console.log(
    `Seed completed: ${result.upsertedCount} inserted, ${result.modifiedCount} updated, ${result.matchedCount} matched.`
  );
}

seedDatabase()
  .catch((error) => {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
