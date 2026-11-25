import { useEffect, useState } from 'react';

function EditStudentModal({ student, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    semester: '',
    email: '',
    phone: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        course: student.course || '',
        semester:
          student.semester !== null && student.semester !== undefined
            ? String(student.semester)
            : '',
        email: student.email || '',
        phone: student.phone || '',
      });
    }
  }, [student]);

  useEffect(() => {
    if (!student) return undefined;
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [student, onClose]);

  if (!student) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await onSave(student.roll_no, {
      name: formData.name.trim(),
      course: formData.course.trim(),
      semester: formData.semester.trim()
        ? parseInt(formData.semester.trim(), 10)
        : null,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
    });
    setSaving(false);
  }

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h3>Edit Student Details</h3>
          <button
            type="button"
            className="close-btn"
            aria-label="Close modal"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="editRollNo">Roll Number (Cannot be changed)</label>
              <input
                type="text"
                id="editRollNo"
                value={student.roll_no}
                readOnly
                className="input-readonly"
              />
            </div>

            <div className="form-group">
              <label htmlFor="editName">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="editName"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="editCourse">Course</label>
                <input
                  type="text"
                  id="editCourse"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editSemester">Semester</label>
                <input
                  type="number"
                  id="editSemester"
                  name="semester"
                  min="1"
                  max="8"
                  value={formData.semester}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="editEmail">Email Address</label>
              <input
                type="email"
                id="editEmail"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="editPhone">Phone Number</label>
              <input
                type="tel"
                id="editPhone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditStudentModal;
