import { useState } from 'react';

const INITIAL_FORM = {
  roll_no: '',
  name: '',
  course: 'BCA',
  semester: '1',
  email: '',
  phone: '',
};

function AddStudentForm({ onAddStudent }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      roll_no: formData.roll_no.trim(),
      name: formData.name.trim(),
      course: formData.course.trim(),
      semester: formData.semester.trim()
        ? parseInt(formData.semester.trim(), 10)
        : null,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
    };

    setSubmitting(true);
    const ok = await onAddStudent(payload);
    setSubmitting(false);

    if (ok) {
      setFormData(INITIAL_FORM);
    }
  }

  return (
    <section className="card">
      <div className="card-header">
        <h2>Add Student</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="addRollNo">
              Roll Number <span className="required">*</span>
            </label>
            <input
              type="text"
              id="addRollNo"
              name="roll_no"
              placeholder="e.g. 24BCA006"
              value={formData.roll_no}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="addName">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="addName"
              name="name"
              placeholder="e.g. Aman Sharma"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="addCourse">Course</label>
              <input
                type="text"
                id="addCourse"
                name="course"
                placeholder="e.g. BCA"
                value={formData.course}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="addSemester">Semester</label>
              <input
                type="number"
                id="addSemester"
                name="semester"
                min="1"
                max="8"
                placeholder="e.g. 4"
                value={formData.semester}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="addEmail">Email Address</label>
            <input
              type="email"
              id="addEmail"
              name="email"
              placeholder="e.g. aman@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="addPhone">Phone Number</label>
            <input
              type="tel"
              id="addPhone"
              name="phone"
              placeholder="e.g. 9876543215"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-success btn-block"
            disabled={submitting}
          >
            {submitting ? 'Adding...' : 'Add Student'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AddStudentForm;
