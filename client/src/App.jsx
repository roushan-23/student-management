import { useCallback, useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import AlertBanner from './components/AlertBanner';
import SearchStudent from './components/SearchStudent';
import AddStudentForm from './components/AddStudentForm';
import RecordsDirectory from './components/RecordsDirectory';
import StudentsTable from './components/StudentsTable';
import EditStudentModal from './components/EditStudentModal';
import Footer from './components/Footer';
import {
  createStudent,
  deleteStudent,
  fetchAllStudents,
  fetchStudentByRoll,
  updateStudent,
} from './services/studentApi';

const INITIAL_SEARCH_STATE = {
  status: 'idle',
  student: null,
  loading: false,
  errorMessage: '',
};

function App() {
  const [alert, setAlert] = useState(null);
  const alertTimerRef = useRef(null);

  const [searchInput, setSearchInput] = useState('');
  const [currentSearchedRoll, setCurrentSearchedRoll] = useState(null);
  const [searchState, setSearchState] = useState(INITIAL_SEARCH_STATE);

  const [tableVisible, setTableVisible] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const tableRef = useRef(null);

  const [editingStudent, setEditingStudent] = useState(null);

  const showAlert = useCallback((message, type = 'success') => {
    if (alertTimerRef.current) {
      clearTimeout(alertTimerRef.current);
    }
    setAlert({ message, type });
    alertTimerRef.current = setTimeout(() => {
      setAlert(null);
    }, 4000);
  }, []);

  useEffect(() => {
    return () => {
      if (alertTimerRef.current) {
        clearTimeout(alertTimerRef.current);
      }
    };
  }, []);

  const loadAllStudents = useCallback(
    async (shouldScroll = false) => {
      setLoadingTable(true);
      try {
        const list = await fetchAllStudents();
        setStudents(list);
        setTableVisible(true);

        if (shouldScroll) {
          requestAnimationFrame(() => {
            tableRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
            });
          });
        }
      } catch (error) {
        showAlert(error.message || 'Unable to connect to database.', 'error');
      } finally {
        setLoadingTable(false);
      }
    },
    [showAlert]
  );

  const handleSearch = useCallback(
    async (rawRoll) => {
      const rollNo = String(rawRoll || '').trim();
      if (!rollNo) {
        showAlert('Please enter a roll number to search', 'error');
        return;
      }

      setSearchState((prev) => ({ ...prev, loading: true, errorMessage: '' }));

      try {
        const student = await fetchStudentByRoll(rollNo);
        if (!student) {
          setCurrentSearchedRoll(null);
          setSearchState({
            status: 'not_found',
            student: null,
            loading: false,
            errorMessage: '',
          });
          return;
        }

        setCurrentSearchedRoll(student.roll_no);
        setSearchState({
          status: 'found',
          student,
          loading: false,
          errorMessage: '',
        });
      } catch (error) {
        const msg = error.message || 'Unable to connect to database.';
        setSearchState({
          status: 'error',
          student: null,
          loading: false,
          errorMessage: msg,
        });
        showAlert(msg, 'error');
      }
    },
    [showAlert]
  );

  function handleClearSearch() {
    setSearchInput('');
    setCurrentSearchedRoll(null);
    setSearchState(INITIAL_SEARCH_STATE);
  }

  async function handleAddStudent(payload) {
    if (!payload.roll_no || !payload.name) {
      showAlert('Roll Number and Name are required fields.', 'error');
      return false;
    }

    try {
      const data = await createStudent(payload);
      showAlert(data.message || 'Student added successfully.', 'success');
      setSearchInput(payload.roll_no);

      if (tableVisible) {
        await loadAllStudents(false);
      }
      return true;
    } catch (error) {
      showAlert(error.message || 'Failed to add student.', 'error');
      return false;
    }
  }

  async function handleOpenEdit(rollNo) {
    try {
      const student = await fetchStudentByRoll(rollNo);
      if (!student) {
        showAlert('Student details not found', 'error');
        return;
      }
      setEditingStudent(student);
    } catch (error) {
      showAlert(
        error.message || 'Failed to fetch student for editing.',
        'error'
      );
    }
  }

  async function handleSaveEdit(rollNo, payload) {
    if (!payload.name) {
      showAlert('Student Name cannot be empty.', 'error');
      return;
    }

    try {
      const data = await updateStudent(rollNo, payload);
      showAlert(data.message || 'Student updated successfully.', 'success');
      setEditingStudent(null);

      if (tableVisible) {
        await loadAllStudents(false);
      }

      if (currentSearchedRoll === rollNo) {
        setSearchInput(rollNo);
        await handleSearch(rollNo);
      }
    } catch (error) {
      showAlert(error.message || 'Error updating student record.', 'error');
    }
  }

  async function handleDeleteStudent(rollNo) {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this student?'
    );
    if (!isConfirmed) return;

    try {
      const data = await deleteStudent(rollNo);
      showAlert(data.message || 'Student deleted successfully.', 'success');

      if (tableVisible) {
        await loadAllStudents(false);
      }

      if (currentSearchedRoll === rollNo) {
        handleClearSearch();
      }
    } catch (error) {
      showAlert(error.message || 'Error deleting student record.', 'error');
    }
  }

  return (
    <div>
      <Header />
      <AlertBanner alert={alert} />

      <main className="container">
        <SearchStudent
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          searchState={searchState}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteStudent}
        />

        <div className="grid-2col">
          <AddStudentForm onAddStudent={handleAddStudent} />
          <RecordsDirectory
            onViewAll={() => loadAllStudents(true)}
            onHideTable={() => setTableVisible(false)}
            loading={loadingTable}
          />
        </div>

        <StudentsTable
          ref={tableRef}
          visible={tableVisible}
          students={students}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteStudent}
        />
      </main>

      <EditStudentModal
        student={editingStudent}
        onClose={() => setEditingStudent(null)}
        onSave={handleSaveEdit}
      />

      <Footer />
    </div>
  );
}

export default App;
