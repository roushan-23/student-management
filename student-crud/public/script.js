// ===============================================================
// Student Management System - Frontend JavaScript (script.js)
// Vanilla JavaScript: Handles DOM manipulation, Fetch API calls & CRUD
// ===============================================================

// Base API URL
const API_URL = '/students';

// Variable to track the currently displayed student in search
let currentSearchedRoll = null;

// ===============================================================
// 1. HELPER: NOTIFICATION ALERTS
// ===============================================================
function showAlert(message, type = 'success') {
    const alertBox = document.getElementById('alertMessage');
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
    alertBox.classList.remove('hidden');

    // Auto-hide alert after 4 seconds
    setTimeout(() => {
        alertBox.classList.add('hidden');
    }, 4000);
}

// ===============================================================
// 2. SEARCH STUDENT BY ROLL NUMBER (READ)
// ===============================================================
async function handleSearch() {
    const searchInput = document.getElementById('searchRollNo');
    const rollNo = searchInput ? searchInput.value.trim() : '';
    const resultArea = document.getElementById('searchResultArea');

    if (!rollNo) {
        showAlert('Please enter a roll number to search', 'error');
        return;
    }

    try {
        // Send GET request to backend: /students/:roll
        const response = await fetch(`${API_URL}/${encodeURIComponent(rollNo)}`);

        if (response.status === 404) {
            // Student not found
            currentSearchedRoll = null;
            resultArea.classList.remove('hidden');
            resultArea.innerHTML = `
                <div class="not-found-message">
                    Student not found.
                </div>
            `;
            return;
        }

        if (!response.ok) {
            const errData = await response.json().catch(() => ({ message: 'Database error occurred' }));
            throw new Error(errData.message || 'Error occurred while searching');
        }

        const data = await response.json();

        // Student found: store current searched roll number
        currentSearchedRoll = data.roll_no;
        resultArea.classList.remove('hidden');

        // Render student details card
        resultArea.innerHTML = `
            <div class="student-detail-card">
                <h3>Student Details</h3>
                <ul class="detail-list">
                    <li><span class="detail-label">Roll Number:</span> <span class="detail-value">${escapeHtml(data.roll_no)}</span></li>
                    <li><span class="detail-label">Name:</span> <span class="detail-value">${escapeHtml(data.name)}</span></li>
                    <li><span class="detail-label">Course:</span> <span class="detail-value">${escapeHtml(data.course || 'N/A')}</span></li>
                    <li><span class="detail-label">Semester:</span> <span class="detail-value">${data.semester !== null && data.semester !== undefined ? data.semester : 'N/A'}</span></li>
                    <li><span class="detail-label">Email:</span> <span class="detail-value">${escapeHtml(data.email || 'N/A')}</span></li>
                    <li><span class="detail-label">Phone:</span> <span class="detail-value">${escapeHtml(data.phone || 'N/A')}</span></li>
                </ul>
                <div class="card-actions">
                    <button class="btn btn-primary btn-sm" onclick="openEditModalByRoll('${escapeJs(data.roll_no)}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="handleDeleteStudent('${escapeJs(data.roll_no)}')">Delete</button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Search error:', error);
        resultArea.classList.remove('hidden');
        resultArea.innerHTML = `
            <div class="not-found-message" style="background-color:#fee2e2; color:#b91c1c;">
                ${escapeHtml(error.message || 'Unable to connect to database.')}
            </div>
        `;
        showAlert(error.message || 'Failed to search student.', 'error');
    }
}

function clearSearchResult() {
    const searchInput = document.getElementById('searchRollNo');
    if (searchInput) searchInput.value = '';
    const resultArea = document.getElementById('searchResultArea');
    if (resultArea) {
        resultArea.innerHTML = '';
        resultArea.classList.add('hidden');
    }
    currentSearchedRoll = null;
}

// ===============================================================
// 3. ADD A NEW STUDENT (CREATE)
// ===============================================================
async function handleAddStudent() {
    const rollInput = document.getElementById('addRollNo');
    const nameInput = document.getElementById('addName');
    const courseInput = document.getElementById('addCourse');
    const semesterInput = document.getElementById('addSemester');
    const emailInput = document.getElementById('addEmail');
    const phoneInput = document.getElementById('addPhone');

    const roll_no = rollInput ? rollInput.value.trim() : '';
    const name = nameInput ? nameInput.value.trim() : '';
    const course = courseInput ? courseInput.value.trim() : '';
    const semester = semesterInput ? semesterInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';

    if (!roll_no || !name) {
        showAlert('Roll Number and Name are required fields.', 'error');
        return;
    }

    const newStudent = {
        roll_no,
        name,
        course,
        semester: semester ? parseInt(semester, 10) : null,
        email,
        phone
    };

    try {
        // Send POST request to backend: /students
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newStudent)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to add student');
        }

        showAlert(data.message || 'Student added successfully.', 'success');

        // Reset the form
        const form = document.getElementById('addStudentForm') || document.getElementById('studentForm');
        if (form) form.reset();
        if (courseInput) courseInput.value = 'BCA';
        if (semesterInput) semesterInput.value = '5';

        // Refresh table if currently open
        const tableSection = document.getElementById('studentsTableSection');
        if (tableSection && !tableSection.classList.contains('hidden')) {
            loadAllStudents();
        }

        // Set the search box so user can immediately search the newly added student
        const searchInput = document.getElementById('searchRollNo');
        if (searchInput) {
            searchInput.value = roll_no;
        }

    } catch (error) {
        console.error('Add student error:', error);
        showAlert(error.message || 'Failed to add student.', 'error');
    }
}

// ===============================================================
// 4. VIEW ALL STUDENTS (READ ALL)
// ===============================================================
async function loadAllStudents() {
    const tableSection = document.getElementById('studentsTableSection');
    const tableBody = document.getElementById('studentsTableBody');
    const badge = document.getElementById('studentCountBadge');
    const noData = document.getElementById('noDataMessage');

    try {
        // Send GET request to backend: /students
        const response = await fetch(API_URL);

        if (!response.ok) {
            const errData = await response.json().catch(() => ({ message: 'Database fetch failed' }));
            throw new Error(errData.message || 'Failed to load students');
        }

        const students = await response.json();

        if (tableSection) tableSection.classList.remove('hidden');
        if (tableBody) tableBody.innerHTML = '';

        if (!students || students.length === 0) {
            if (noData) noData.classList.remove('hidden');
            if (badge) badge.textContent = '0 Students';
            return;
        }

        if (noData) noData.classList.add('hidden');
        if (badge) badge.textContent = `${students.length} Student${students.length > 1 ? 's' : ''}`;

        students.forEach((student) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${student.id}</td>
                <td><strong>${escapeHtml(student.roll_no)}</strong></td>
                <td>${escapeHtml(student.name)}</td>
                <td>${escapeHtml(student.course || '-')}</td>
                <td>${student.semester !== null && student.semester !== undefined ? student.semester : '-'}</td>
                <td>${escapeHtml(student.email || '-')}</td>
                <td>${escapeHtml(student.phone || '-')}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-primary btn-sm" onclick="openEditModalByRoll('${escapeJs(student.roll_no)}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="handleDeleteStudent('${escapeJs(student.roll_no)}')">Delete</button>
                    </div>
                </td>
            `;
            if (tableBody) tableBody.appendChild(tr);
        });

        // Smooth scroll to table
        if (tableSection) {
            tableSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    } catch (error) {
        console.error('Fetch all students error:', error);
        showAlert(error.message || 'Unable to connect to database.', 'error');
    }
}

function hideStudentTable() {
    const tableSection = document.getElementById('studentsTableSection');
    if (tableSection) {
        tableSection.classList.add('hidden');
    }
}

// ===============================================================
// 5. UPDATE STUDENT (EDIT)
// ===============================================================
async function openEditModalByRoll(rollNo) {
    try {
        const response = await fetch(`${API_URL}/${encodeURIComponent(rollNo)}`);
        const student = await response.json();

        if (!response.ok) {
            throw new Error(student.message || 'Student details not found');
        }

        // Populate modal inputs
        document.getElementById('editRollNo').value = student.roll_no;
        document.getElementById('editName').value = student.name;
        document.getElementById('editCourse').value = student.course || '';
        document.getElementById('editSemester').value = student.semester !== null && student.semester !== undefined ? student.semester : '';
        document.getElementById('editEmail').value = student.email || '';
        document.getElementById('editPhone').value = student.phone || '';

        // Show modal
        const modal = document.getElementById('editModal');
        if (modal) modal.classList.remove('hidden');
    } catch (error) {
        console.error('Error opening edit modal:', error);
        showAlert(error.message || 'Failed to fetch student for editing.', 'error');
    }
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    if (modal) modal.classList.add('hidden');
}

async function handleSaveEdit() {
    const rollNo = document.getElementById('editRollNo').value.trim();
    const name = document.getElementById('editName').value.trim();
    const course = document.getElementById('editCourse').value.trim();
    const semester = document.getElementById('editSemester').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const phone = document.getElementById('editPhone').value.trim();

    if (!name) {
        showAlert('Student Name cannot be empty.', 'error');
        return;
    }

    const updatedData = {
        name,
        course,
        semester: semester ? parseInt(semester, 10) : null,
        email,
        phone
    };

    try {
        // Send PUT request to backend: /students/:roll
        const response = await fetch(`${API_URL}/${encodeURIComponent(rollNo)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to update student');
        }

        showAlert(data.message || 'Student updated successfully.', 'success');
        closeEditModal();

        // Refresh table if visible
        const tableSection = document.getElementById('studentsTableSection');
        if (tableSection && !tableSection.classList.contains('hidden')) {
            loadAllStudents();
        }

        // Update search view if currently showing this student
        if (currentSearchedRoll === rollNo) {
            const searchInput = document.getElementById('searchRollNo');
            if (searchInput) searchInput.value = rollNo;
            handleSearch();
        }
    } catch (error) {
        console.error('Save edit error:', error);
        showAlert(error.message || 'Error updating student record.', 'error');
    }
}

// ===============================================================
// 6. DELETE STUDENT (DELETE)
// ===============================================================
async function handleDeleteStudent(rollNo) {
    const isConfirmed = confirm('Are you sure you want to delete this student?');
    if (!isConfirmed) {
        return;
    }

    try {
        // Send DELETE request to backend: /students/:roll
        const response = await fetch(`${API_URL}/${encodeURIComponent(rollNo)}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete student');
        }

        showAlert(data.message || 'Student deleted successfully.', 'success');

        // Refresh table automatically if open
        const tableSection = document.getElementById('studentsTableSection');
        if (tableSection && !tableSection.classList.contains('hidden')) {
            loadAllStudents();
        }

        // Clear search view if deleted student was shown
        if (currentSearchedRoll === rollNo) {
            clearSearchResult();
        }
    } catch (error) {
        console.error('Delete error:', error);
        showAlert(error.message || 'Error deleting student record.', 'error');
    }
}

// ===============================================================
// 7. EVENT LISTENERS INITIALIZATION (DOM Ready)
// ===============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Attach submit event listener to Search Form
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSearch();
        });
    }

    // Attach submit event listener to Add Student Form
    const addForm = document.getElementById('addStudentForm') || document.getElementById('studentForm');
    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleAddStudent();
        });
    }

    // Attach submit event listener to Edit Student Form
    const editForm = document.getElementById('editStudentForm');
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSaveEdit();
        });
    }

    // Allow Enter key inside Search Box
    const searchInput = document.getElementById('searchRollNo');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
            }
        });
    }
});

// ===============================================================
// 8. UTILITY SANITIZATION FUNCTIONS
// ===============================================================
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function escapeJs(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/'/g, "\\'").replace(/"/g, '\\"');
}
