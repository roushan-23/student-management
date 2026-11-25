import { forwardRef } from 'react';

const StudentsTable = forwardRef(function StudentsTable(
  { visible, students, onEdit, onDelete },
  ref
) {
  if (!visible) return null;

  const countText = `${students.length} Student${students.length === 1 ? '' : 's'}`;

  return (
    <section ref={ref} className="card">
      <div className="card-header flex-header">
        <h2>All Registered Students</h2>
        <span className="badge">{countText}</span>
      </div>
      <div className="card-body">
        {students.length === 0 ? (
          <div className="empty-state">
            No student records found in database.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="student-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Roll Number</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Semester</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student._id || student.roll_no}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>{student.roll_no}</strong>
                    </td>
                    <td>{student.name}</td>
                    <td>{student.course || '-'}</td>
                    <td>{student.semester ?? '-'}</td>
                    <td>{student.email || '-'}</td>
                    <td>{student.phone || '-'}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => onEdit(student.roll_no)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => onDelete(student.roll_no)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
});

export default StudentsTable;
