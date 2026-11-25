const API_BASE = '/api/students';

/**
 * Performs a JSON fetch request and throws an Error with the server message on failure.
 */
async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function fetchAllStudents() {
  return requestJson(API_BASE);
}

export async function fetchStudentByRoll(rollNo) {
  const response = await fetch(`${API_BASE}/${encodeURIComponent(rollNo)}`);
  if (response.status === 404) {
    return null;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Error occurred while searching');
  }

  return data;
}

export async function createStudent(studentData) {
  return requestJson(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData),
  });
}

export async function updateStudent(rollNo, studentData) {
  return requestJson(`${API_BASE}/${encodeURIComponent(rollNo)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData),
  });
}

export async function deleteStudent(rollNo) {
  return requestJson(`${API_BASE}/${encodeURIComponent(rollNo)}`, {
    method: 'DELETE',
  });
}
