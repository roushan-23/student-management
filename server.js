// ===============================================================
// Student Management System - Backend Server
// Technology: Node.js & Express.js with MySQL (mysql2)
// BCA Full Stack Development Project
// ===============================================================

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON request bodies
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// ===============================================================
// MySQL Database Configuration
// ===============================================================
// INSTRUCTIONS FOR STUDENT / FACULTY:
// - Default user: 'root'
// - Host: 'localhost'
// - Database: 'student_management'
// - Password: Use process.env.DB_PASSWORD or specify your password below.
// ===============================================================
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : (process.env.MYSQL_PASSWORD || ''),
    database: process.env.DB_NAME || 'student_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const db = mysql.createPool(dbConfig);

// Database Connection Test
db.getConnection((err, connection) => {
    if (err) {
        console.error('---------------------------------------------------------');
        console.error('❌ MySQL Connection Failed (' + (err.code || 'UNKNOWN') + '): ' + (err.message || 'Check the MySQL host, port, and credentials.'));
        console.error('👉 Please make sure:');
        console.error(`   1. MySQL server is running on ${dbConfig.host}:${dbConfig.port}.`);
        console.error('   2. Database "student_management" exists (run database.sql).');
        console.error('   3. Password in server.js matches your MySQL root password.');
        console.error('---------------------------------------------------------');
    } else {
        console.log('MySQL connected successfully');
        connection.release();
    }
});

// ===============================================================
// REST API ROUTES
// ===============================================================

// ---------------------------------------------------------------
// 1. GET /students : Fetch all students
// ---------------------------------------------------------------
app.get('/students', (req, res) => {
    const sql = 'SELECT * FROM students ORDER BY id ASC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching students:', err.message);
            return res.status(500).json({ message: 'Database error: ' + (err.message || err.code || 'Unknown database error') });
        }
        res.status(200).json(results);
    });
});

// ---------------------------------------------------------------
// 2. GET /students/:roll : Search student by Roll Number
// ---------------------------------------------------------------
app.get('/students/:roll', (req, res) => {
    const rawRoll = req.params.roll;
    if (!rawRoll) {
        return res.status(400).json({ message: 'Roll number is required' });
    }
    const rollNo = String(rawRoll).trim();
    const sql = 'SELECT * FROM students WHERE roll_no = ?';

    db.query(sql, [rollNo], (err, results) => {
        if (err) {
            console.error('Error searching student:', err.message);
            return res.status(500).json({ message: 'Database error: ' + (err.message || err.code || 'Unknown database error') });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Return student object
        res.status(200).json(results[0]);
    });
});

// ---------------------------------------------------------------
// 3. POST /students : Add a new student
// ---------------------------------------------------------------
app.post('/students', (req, res) => {
    const { roll_no, name, course, semester, email, phone } = req.body;

    // Basic Validation
    if (!roll_no || !name) {
        return res.status(400).json({ message: 'Roll Number and Name are required fields' });
    }

    const trimmedRoll = String(roll_no).trim();
    const trimmedName = String(name).trim();

    const sql = `
        INSERT INTO students (roll_no, name, course, semester, email, phone) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
        trimmedRoll,
        trimmedName,
        course ? String(course).trim() : '',
        semester !== undefined && semester !== null && semester !== '' ? parseInt(semester, 10) : null,
        email ? String(email).trim() : '',
        phone ? String(phone).trim() : ''
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Roll number already exists' });
            }
            console.error('Error adding student:', err.message);
            return res.status(500).json({ message: 'Database error: ' + (err.message || err.code || 'Unknown database error') });
        }

        res.status(201).json({
            message: 'Student added successfully.',
            studentId: result.insertId,
            student: {
                roll_no: trimmedRoll,
                name: trimmedName,
                course: values[2],
                semester: values[3],
                email: values[4],
                phone: values[5]
            }
        });
    });
});

// ---------------------------------------------------------------
// 4. PUT /students/:roll : Update student details (Roll No cannot be changed)
// ---------------------------------------------------------------
app.put('/students/:roll', (req, res) => {
    const rollNo = String(req.params.roll).trim();
    const { name, course, semester, email, phone } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Student Name is required' });
    }

    const sql = `
        UPDATE students 
        SET name = ?, course = ?, semester = ?, email = ?, phone = ? 
        WHERE roll_no = ?
    `;
    const values = [
        String(name).trim(),
        course ? String(course).trim() : '',
        semester !== undefined && semester !== null && semester !== '' ? parseInt(semester, 10) : null,
        email ? String(email).trim() : '',
        phone ? String(phone).trim() : '',
        rollNo
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating student:', err.message);
            return res.status(500).json({ message: 'Database error: ' + (err.message || err.code || 'Unknown database error') });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student updated successfully.' });
    });
});

// ---------------------------------------------------------------
// 5. DELETE /students/:roll : Delete a student by Roll Number
// ---------------------------------------------------------------
app.delete('/students/:roll', (req, res) => {
    const rollNo = String(req.params.roll).trim();
    const sql = 'DELETE FROM students WHERE roll_no = ?';

    db.query(sql, [rollNo], (err, result) => {
        if (err) {
            console.error('Error deleting student:', err.message);
            return res.status(500).json({ message: 'Database error: ' + (err.message || err.code || 'Unknown database error') });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student deleted successfully.' });
    });
});

// Fallback route for index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Express Server
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Use the running app at http://localhost:${PORT} or stop it before starting another copy.`);
        process.exit(1);
    }

    throw error;
});
