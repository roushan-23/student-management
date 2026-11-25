# Student Management System – MERN Stack CRUD Application

A clean, full-stack **MERN (MongoDB, Express.js, React, Node.js)** web application for managing student records with complete **CRUD** operations and **Search by Roll Number**.

---

## 1. Features

- **Search by Roll Number:** Look up any student by `roll_no`, view details in a card with quick **Edit** and **Delete** actions, or see a clear `"Student not found."` message.
- **Add Student:** Create new student records with required validation (`roll_no`, `name`), semester range validation (`1–8`), and duplicate roll number protection.
- **View All Students:** Toggle the student directory table on demand, view total student count, and manage records inline.
- **Update Student:** Edit student details in a modal dialog while keeping `roll_no` immutable.
- **Delete Student:** Remove records with a confirmation prompt and automatic UI synchronization.

---

## 2. Technology Stack

- **Frontend (`client/`):** React 19, Vite 6, CSS3 (academic light theme)
- **Backend (`server/`):** Node.js, Express.js, Mongoose, CORS, dotenv
- **Database:** MongoDB (`student_management` database)

---

## 3. Project Structure

```text
student-management/
├── package.json                       # Root workspace scripts (dev, build, seed, install:all)
├── README.md
├── .gitignore
├── client/                            # React + Vite frontend
│   ├── index.html
│   ├── vite.config.js                 # Proxies /api requests to http://localhost:5000
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                    # Top-level state & CRUD orchestration
│       ├── index.css                  # Academic light theme stylesheet
│       ├── services/
│       │   └── studentApi.js          # Fetch wrappers for /api/students
│       └── components/
│           ├── Header.jsx
│           ├── AlertBanner.jsx
│           ├── SearchStudent.jsx
│           ├── AddStudentForm.jsx
│           ├── RecordsDirectory.jsx
│           ├── StudentsTable.jsx
│           ├── EditStudentModal.jsx
│           └── Footer.jsx
└── server/                            # Node.js + Express + Mongoose backend
    ├── server.js                      # Express app entry point
    ├── package.json
    ├── .env.example                   # PORT, CLIENT_URL, MONGO_URI template
    ├── config/
    │   └── db.js                      # Mongoose MongoDB connection
    ├── models/
    │   └── Student.js                 # Student Mongoose schema & validation
    ├── controllers/
    │   └── studentController.js       # CRUD handlers & error mapping
    ├── routes/
    │   └── studentRoutes.js           # /api/students route definitions
    └── seed/
        └── seedStudents.js            # Idempotent sample data seeder
```

---

## 4. Setup & Running Locally

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Server running locally on `127.0.0.1:27017` (or a MongoDB Atlas URI)

### 1. Install Dependencies
From the project root:
```bash
npm run install:all
```

### 2. Configure Environment Variables
Copy `server/.env.example` to `server/.env` and update values if needed:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/student_management
```

### 3. Seed Sample Students (Optional)
Inserts/updates the 5 sample student records (`24BCA001`, `24BCA002`, `3474U35`, `24BCA003`, `24BCA004`):
```bash
npm run seed
```

### 4. Start Development Servers
Run both Express backend (`http://localhost:5000`) and Vite React frontend (`http://localhost:5173`) concurrently from the root:
```bash
npm run dev
```

Or run them separately:
```bash
npm run dev:server
npm run dev:client
```

### 5. Build Frontend for Production
```bash
npm run build
```

---

## 5. REST API Reference

Base URL: `/api/students` (proxied from Vite on `http://localhost:5173` to Express on `http://localhost:5000`).

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/api/health` | Server & DB health check | None | `200 OK` |
| `GET` | `/api/students` | Fetch all students | None | `200 OK` (Array) |
| `GET` | `/api/students/:roll` | Search student by `roll_no` | None | `200 OK` or `404 Not Found` |
| `POST` | `/api/students` | Add new student | `{ roll_no, name, course, semester, email, phone }` | `201 Created` or `400 Bad Request` |
| `PUT` | `/api/students/:roll` | Update student (`roll_no` immutable) | `{ name, course, semester, email, phone }` | `200 OK`, `400`, or `404` |
| `DELETE` | `/api/students/:roll` | Delete student by `roll_no` | None | `200 OK` or `404 Not Found` |
