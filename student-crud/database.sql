-- =======================================================
-- Student Management System - Database Setup
-- Project: BCA Full Stack Development CRUD Assignment
-- Database: MySQL
-- =======================================================

-- Step 1: Create Database if it does not already exist
CREATE DATABASE IF NOT EXISTS student_management;

-- Step 2: Use the database
USE student_management;

-- Step 3: Create students table
CREATE TABLE IF NOT EXISTS students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    roll_no VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    course VARCHAR(50),
    semester INT,
    email VARCHAR(100),
    phone VARCHAR(15)
);

-- Step 4: Insert required sample student records for testing
-- Includes: 24BCA001, 24BCA002, 3474U35, 24BCA003, 24BCA004
INSERT INTO students (roll_no, name, course, semester, email, phone) VALUES
('24BCA001', 'Rahul Kumar', 'BCA', 5, 'rahul@gmail.com', '9876543210'),
('24BCA002', 'Aman Sharma', 'BCA', 5, 'aman@gmail.com', '9876543211'),
('3474U35', 'Roushan Kumar', 'BCA', 5, 'roushan@gmail.com', '9876543212'),
('24BCA003', 'Amit Patel', 'BCA', 3, 'amit.patel@gmail.com', '9876543213'),
('24BCA004', 'Sneha Singh', 'BCA', 1, 'sneha.singh@gmail.com', '9876543214')
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    course = VALUES(course),
    semester = VALUES(semester),
    email = VALUES(email),
    phone = VALUES(phone);

-- Step 5: Verify inserted records
SELECT * FROM students;
