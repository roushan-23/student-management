function RecordsDirectory({ onViewAll, onHideTable, loading }) {
  return (
    <section className="card">
      <div className="card-header">
        <h2>Student Records Directory</h2>
      </div>
      <div className="card-body">
        <p className="section-desc">
          Manage all student records registered in the MongoDB database. You can
          view all records in a structured table, edit information, or delete
          records.
        </p>
        <div className="action-buttons-box">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={onViewAll}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'View All Students'}
          </button>
          <button
            type="button"
            className="btn btn-outline btn-lg"
            onClick={onHideTable}
          >
            Hide Table
          </button>
        </div>

        <div className="quick-tips-box">
          <h3>Demo Quick Guide:</h3>
          <ul>
            <li>
              <strong>Search:</strong> Try sample roll numbers{' '}
              <code>24BCA001</code> to <code>24BCA004</code> or{' '}
              <code>3474U35</code>.
            </li>
            <li>
              <strong>Create:</strong> Fill in the form and click{' '}
              <strong>Add Student</strong>.
            </li>
            <li>
              <strong>Update:</strong> Click <strong>Edit</strong> on any
              student card or row.
            </li>
            <li>
              <strong>Delete:</strong> Click <strong>Delete</strong> and
              confirm.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default RecordsDirectory;
