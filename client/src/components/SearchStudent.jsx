function SearchStudent({
  searchInput,
  onSearchInputChange,
  onSearch,
  onClear,
  searchState,
  onEdit,
  onDelete,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    onSearch(searchInput);
  }

  return (
    <section className="card search-card">
      <div className="card-header">
        <h2>Search Student by Roll Number</h2>
      </div>
      <div className="card-body">
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            id="searchRollNo"
            placeholder="Enter Roll Number (e.g. 24BCA001)"
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            required
            autoComplete="off"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={searchState.loading}
          >
            {searchState.loading ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClear}
          >
            Clear
          </button>
        </form>

        {searchState.status === 'not_found' && (
          <div className="search-result-area">
            <div className="not-found-message">Student not found.</div>
          </div>
        )}

        {searchState.status === 'error' && (
          <div className="search-result-area">
            <div className="not-found-message error-message-box">
              {searchState.errorMessage || 'Unable to connect to database.'}
            </div>
          </div>
        )}

        {searchState.status === 'found' && searchState.student && (
          <div className="search-result-area">
            <div className="student-detail-card">
              <h3>Student Details</h3>
              <ul className="detail-list">
                <li>
                  <span className="detail-label">Roll Number:</span>
                  <span className="detail-value">{searchState.student.roll_no}</span>
                </li>
                <li>
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{searchState.student.name}</span>
                </li>
                <li>
                  <span className="detail-label">Course:</span>
                  <span className="detail-value">
                    {searchState.student.course || 'N/A'}
                  </span>
                </li>
                <li>
                  <span className="detail-label">Semester:</span>
                  <span className="detail-value">
                    {searchState.student.semester ?? 'N/A'}
                  </span>
                </li>
                <li>
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">
                    {searchState.student.email || 'N/A'}
                  </span>
                </li>
                <li>
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">
                    {searchState.student.phone || 'N/A'}
                  </span>
                </li>
              </ul>
              <div className="card-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onEdit(searchState.student.roll_no)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(searchState.student.roll_no)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default SearchStudent;
