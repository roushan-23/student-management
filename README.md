# Student Management System – CRUD Web Application

A clean, beginner-friendly Full Stack Web Application built for the **BCA Full Stack Development Assignment**.

This project implements complete **CRUD (Create, Read, Update, Delete)** operations and a dedicated **Search by Roll Number** feature using only core web technologies without complex frameworks.

---

## 1. Project Introduction

The **Student Management System** is designed for educational institutions to manage student records efficiently. It allows an administrator or faculty member to:
- **Search** for any student quickly by Roll Number.
- **Add** new student records with validation.
- **View** all students in a structured, responsive table.
- **Update / Edit** student information (protecting the unique Roll Number).
- **Delete** a student record with safety confirmation.

The code is intentionally structured to be simple and readable so any BCA student can comfortably explain it to their faculty examiner.

---

## 2. Technologies Used

- **Frontend:**
  - `HTML5`: Clean semantic structure
  - `CSS3`: Custom light academic styling, responsive grid & table layout
  - `Vanilla JavaScript (ES6)`: Fetch API calls, asynchronous async/await, DOM manipulation
- **Backend:**
  - `Node.js`: JavaScript runtime environment
  - `Express.js`: Minimal REST API framework
- **Database:**
  - `MySQL`: Relational database management system
  - `mysql2`: Fast MySQL driver for Node.js

---

## 3. Project Structure

```text
student-crud/
│
├── server.js          # Express backend server, MySQL connection & REST API endpoints
├── package.json       # Project metadata, scripts, and dependencies (express, mysql2, cors)
├── database.sql       # SQL script to create database, table, and sample student records
├── README.md          # Comprehensive beginner guide and documentation
│
└── public/            # Frontend static files served by Express
    ├── index.html     # Main user interface (Search bar, Add form, Table, Edit modal)
    ├── style.css      # Academic light theme design, responsive layout
    └── script.js      # Frontend logic, Fetch API requests to backend, dynamic rendering
```

---

## 4. How to Install Node.js Dependencies

Open your command prompt or terminal in the `student-crud` folder and run:

```bash
npm install
```

This installs the 3 required packages specified in `package.json`:
- `express`: Web server and route handler
- `mysql2`: Connects Node.js to MySQL
- `cors`: Cross-Origin Resource Sharing middleware

---

## 5. How to Create the MySQL Database & Run database.sql

You can run `database.sql` using either **MySQL Command Line Client**, **MySQL Workbench**, or **phpMyAdmin (XAMPP)**.

### Option A: Using MySQL Command Line Client / Terminal
1. Open MySQL Command Line:
   ```bash
   mysql -u root -p
   ```
2. Enter your MySQL password.
3. Run the SQL script:
   ```sql
   source database.sql;
   ```
   *(Or copy and paste the contents of `database.sql` into the MySQL prompt and hit Enter).*

### Option B: Using phpMyAdmin (XAMPP / WAMP)
1. Open your browser and go to `http://localhost/phpmyadmin`.
2. Click on the **Import** tab at the top.
3. Click **Choose File**, select `database.sql`, and click **Go** / **Import**.

### Option C: Using MySQL Workbench
1. Open MySQL Workbench and connect to your local MySQL instance.
2. Go to **File -> Open SQL Script...** and select `database.sql`.
3. Click the yellow ⚡ (Execute) button to run the script.

This creates the database `student_management` and inserts 5 initial sample students (`24BCA001` to `24BCA005`).

---

## 6. Database Connection Configuration

Database credentials are read from a local `.env` file, which is excluded from version control. The application uses the `student_app` account rather than the MySQL root account. Do not put database passwords in `server.js`.

---

## 7. How to Start the Server

In your terminal inside the `student-crud` folder, run:

```bash
npm run dev
```

Or:

```bash
npm start
```

Both commands load the local `.env` file before starting the server.

Both commands start the Express server. `npm run dev` does not automatically restart the server when files change.
If the port is already in use, open the existing app at `http://localhost:3001` or stop it before starting another copy.

You should see:
```text
=======================================================
🚀 Student Management Server running on port 3001
🌐 Open in your browser: http://localhost:3001
=======================================================
✅ Connected to MySQL Database (student_management) successfully!
```

---

## 8. How to Open the Website

Open any web browser (Chrome, Edge, Firefox) and navigate to:

```text
http://localhost:3001
```

---

## 9. CRUD Operations & Faculty Demonstration Flow

| Operation | Action in UI | Backend Route | SQL Query Executed |
|---|---|---|---|
| **CREATE** | Fill Add Student form & click **Add Student** | `POST /students` | `INSERT INTO students (...) VALUES (...)` |
| **READ** (Search) | Enter roll number & click **Search** | `GET /students/:roll` | `SELECT * FROM students WHERE roll_no = ?` |
| **READ** (All) | Click **View All Students** button | `GET /students` | `SELECT * FROM students ORDER BY id ASC` |
| **UPDATE** | Click **Edit**, modify details, click **Save Changes** | `PUT /students/:roll` | `UPDATE students SET ... WHERE roll_no = ?` |
| **DELETE** | Click **Delete**, confirm alert dialog | `DELETE /students/:roll` | `DELETE FROM students WHERE roll_no = ?` |

### Step-by-Step Viva / Demo Flow:
1. **Open Website:** Go to `http://localhost:3001`.
2. **Search by Roll Number:**
   - Type `24BCA001` and press **Enter** (or click **Search**).
   - The card appears showing Rahul Kumar's details with [Edit] and [Delete] buttons.
   - Try searching an invalid roll number like `99XYZ999`. The UI displays: `"Student not found."`
3. **Add a Student:**
   - Fill out the form: Roll No: `24BCA006`, Name: `Kavita Roy`, Course: `BCA`, Semester: `2`, Email: `kavita@gmail.com`, Phone: `9876500000`.
   - Click **Add Student**. A green success message appears: `"Student added successfully"`.
4. **View All Students:**
   - Click **View All Students**.
   - The table renders all records currently in MySQL, including the newly added student.
5. **Update Student:**
   - Click **Edit** next to `24BCA006`.
   - The edit modal opens. Notice Roll Number is locked/read-only.
   - Change Semester from `2` to `3` and click **Save Changes**.
   - Notice the table and notification update instantly.
6. **Delete Student:**
   - Click **Delete** next to `24BCA006`.
   - A confirmation dialog appears: *"Are you sure you want to delete this student?"*
   - Click OK. The record is removed from MySQL and disappears from the table.
7. **Verify in Search:**
   - Search `24BCA006` again. The system now reports `"Student not found."` proving the database deletion was real-time and successful!

---

## 10. REST API Reference

| Method | Endpoint | Description | Request Body | Response (Success / Error) |
|---|---|---|---|---|
| `GET` | `/students` | Get all students | None | `200 OK` (Array of student objects) |
| `GET` | `/students/:roll` | Search student by roll | None | `200 OK` (Student object) or `404 Not Found` |
| `POST` | `/students` | Add new student | JSON `{ roll_no, name, course, semester, email, phone }` | `201 Created` or `400 Bad Request` (Duplicate roll) |
| `PUT` | `/students/:roll` | Update student details | JSON `{ name, course, semester, email, phone }` | `200 OK` or `404 Not Found` |
| `DELETE` | `/students/:roll` | Delete a student | None | `200 OK` or `404 Not Found` |

---

## 11. Student Explanation Guide for Faculty Viva

When explaining the architecture:
- **HTML (`index.html`)**: Defines the structure (forms, tables, modal dialogs).
- **CSS (`style.css`)**: Handles the styling, clean card layouts, colors, and responsive tables.
- **JavaScript (`script.js`)**: Executes in the user's browser; handles button clicks, sends HTTP requests (`fetch()`) to backend without reloading the page, and updates the HTML DOM dynamically.
- **Express.js (`server.js`)**: Runs on the server; defines REST API routes, receives HTTP requests from the frontend, queries MySQL safely using prepared statements (`?`), and returns JSON data.
- **MySQL (`database.sql`)**: Stores the permanent student data in a relational table with a unique primary key and unique roll number constraint.
