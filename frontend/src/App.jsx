import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import StatsDashboard from './components/StatsDashboard';
import SearchAndFilter from './components/SearchAndFilter';
import StudentTable from './components/StudentTable';
import StudentModal from './components/StudentModal';
import DeleteModal from './components/DeleteModal';
import Toast from './components/Toast';
import { studentApi, extractErrorMessage } from './services/api';

function App() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [sortBy, setSortBy] = useState('roll-asc');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch all students and statistics from Spring Boot backend
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [studentsData, statsData] = await Promise.all([
        studentApi.getAll(),
        studentApi.getStats(),
      ]);
      setStudents(studentsData);
      setStats(statsData);
      setBackendOnline(true);
    } catch (err) {
      console.error('Failed to connect to backend:', err);
      const errInfo = extractErrorMessage(err);
      setBackendOnline(false);
      showToast(errInfo.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Roll numbers list for local duplicate detection helper
  const existingRollNumbers = useMemo(() => {
    return students.map((s) => s.rollNumber);
  }, [students]);

  // Handle Add or Edit student submission
  const handleSaveStudent = async (studentData, id = null) => {
    try {
      if (id) {
        // Update existing record
        const updated = await studentApi.update(id, studentData);
        setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
        showToast(`Student ${updated.name} (${updated.rollNumber}) updated successfully!`, 'success');
      } else {
        // Create new record
        const created = await studentApi.create(studentData);
        setStudents((prev) => [created, ...prev]);
        showToast(`Student ${created.name} (${created.rollNumber}) registered successfully!`, 'success');
      }

      // Refresh stats from backend
      try {
        const updatedStats = await studentApi.getStats();
        setStats(updatedStats);
      } catch (e) {
        console.error('Could not refresh stats:', e);
      }

      setIsModalOpen(false);
      setStudentToEdit(null);
    } catch (err) {
      const formatted = extractErrorMessage(err);
      throw formatted; // Re-throw so modal can display inline error
    }
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async (id) => {
    setDeleting(true);
    try {
      await studentApi.delete(id);
      const deletedStudent = studentToDelete;
      setStudents((prev) => prev.filter((s) => s.id !== id));
      showToast(`Record for ${deletedStudent?.name || 'student'} deleted successfully.`, 'info');

      // Refresh stats
      try {
        const updatedStats = await studentApi.getStats();
        setStats(updatedStats);
      } catch (e) {
        console.error('Could not refresh stats:', e);
      }

      setStudentToDelete(null);
    } catch (err) {
      const errInfo = extractErrorMessage(err);
      showToast(errInfo.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Search by Roll Number explicitly via backend endpoint
  const handleQuickRollSearch = async (roll) => {
    if (!roll || !roll.trim()) return;
    try {
      setLoading(true);
      const student = await studentApi.getByRollNumber(roll.trim());
      showToast(`Found student: ${student.name} (${student.rollNumber}) with ${student.marks} marks.`, 'success');
      setSearchQuery(student.rollNumber);
      setSelectedBranch('All Branches');
    } catch (err) {
      const errInfo = extractErrorMessage(err);
      showToast(errInfo.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter & Sort students
  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        // Roll number or name search
        const query = searchQuery.trim().toLowerCase();
        const matchesQuery =
          !query ||
          student.rollNumber.toLowerCase().includes(query) ||
          student.name.toLowerCase().includes(query);

        // Branch filter
        const matchesBranch =
          selectedBranch === 'All Branches' ||
          student.branch.toLowerCase() === selectedBranch.toLowerCase();

        return matchesQuery && matchesBranch;
      })
      .sort((a, b) => {
        if (sortBy === 'roll-asc') return a.rollNumber.localeCompare(b.rollNumber);
        if (sortBy === 'roll-desc') return b.rollNumber.localeCompare(a.rollNumber);
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'marks-desc') return b.marks - a.marks;
        if (sortBy === 'marks-asc') return a.marks - b.marks;
        return 0;
      });
  }, [students, searchQuery, selectedBranch, sortBy]);

  return (
    <>
      <Header
        onOpenAddModal={() => {
          setStudentToEdit(null);
          setIsModalOpen(true);
        }}
        backendOnline={backendOnline}
        totalCount={stats?.totalStudents || students.length}
      />

      <main className="dashboard-main">
        <div className="container">
          {/* Key Metrics & Statistics Banner */}
          <StatsDashboard stats={stats} loading={loading} />

          {/* Search by Roll Number, Branch Pills & Filters */}
          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedBranch={selectedBranch}
            onBranchChange={setSelectedBranch}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearSearch={() => setSearchQuery('')}
            totalMatches={filteredStudents.length}
            onQuickRollSearch={handleQuickRollSearch}
          />

          {/* Students Table */}
          <StudentTable
            students={filteredStudents}
            loading={loading}
            onEditStudent={(student) => {
              setStudentToEdit(student);
              setIsModalOpen(true);
            }}
            onDeleteStudent={(student) => {
              setStudentToDelete(student);
            }}
            onClearFilters={() => {
              setSearchQuery('');
              setSelectedBranch('All Branches');
            }}
            onOpenAddModal={() => {
              setStudentToEdit(null);
              setIsModalOpen(true);
            }}
          />
        </div>
      </main>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setStudentToEdit(null);
        }}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
        existingRollNumbers={existingRollNumbers}
      />

      {/* Confirm Delete Modal */}
      <DeleteModal
        isOpen={Boolean(studentToDelete)}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleConfirmDelete}
        student={studentToDelete}
        deleting={deleting}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <footer className="app-footer">
        <div className="container">
          Student Record Management System • React & Spring Boot REST API • H2 Database
        </div>
      </footer>
    </>
  );
}

export default App;
