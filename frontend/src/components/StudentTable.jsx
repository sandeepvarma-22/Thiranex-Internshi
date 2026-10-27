import React from 'react';
import { Edit3, Trash2, UserX, Award, Check, AlertTriangle } from 'lucide-react';

const StudentTable = ({
  students,
  loading,
  onEditStudent,
  onDeleteStudent,
  onClearFilters,
  onOpenAddModal,
}) => {
  // Helper to get grade badge styling
  const getGradeStyle = (grade, marks) => {
    if (marks >= 80) return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' };
    if (marks >= 60) return { bg: 'rgba(6, 182, 212, 0.15)', text: '#22d3ee', border: 'rgba(6, 182, 212, 0.3)' };
    if (marks >= 40) return { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' };
    return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' };
  };

  // Helper to get progress bar gradient
  const getBarGradient = (marks) => {
    if (marks >= 80) return 'linear-gradient(90deg, #10b981, #059669)';
    if (marks >= 60) return 'linear-gradient(90deg, #6366f1, #3b82f6)';
    if (marks >= 40) return 'linear-gradient(90deg, #f59e0b, #d97706)';
    return 'linear-gradient(90deg, #ef4444, #dc2626)';
  };

  // Helper for name initials
  const getInitials = (name) => {
    if (!name) return 'S';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="table-card">
      <div className="table-header-info">
        <h2 className="table-title">
          <span>Registered Student Records</span>
          <span className="badge-counter" id="table-record-count">
            {students.length} {students.length === 1 ? 'Record' : 'Records'}
          </span>
        </h2>
      </div>

      <div className="table-responsive">
        <table className="student-table" id="students-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Branch</th>
              <th>Marks & Score</th>
              <th>Grade</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Skeleton loading rows
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`}>
                  <td colSpan="7" style={{ padding: '20px' }}>
                    <div className="skeleton" style={{ height: '24px', width: '100%' }}></div>
                  </td>
                </tr>
              ))
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="7">
                  <div className="empty-state">
                    <div className="empty-icon">
                      <UserX size={32} />
                    </div>
                    <h3 className="empty-title">No Student Records Found</h3>
                    <p className="empty-desc">
                      We couldn't find any students matching your search criteria. Try searching with a different roll number or add a new record.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClearFilters}
                      >
                        Clear Filters
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={onOpenAddModal}
                      >
                        Add Student
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student) => {
                const gradeStyle = getGradeStyle(student.grade, student.marks);
                const isPassed = student.marks >= 40;

                return (
                  <tr key={student.id} id={`student-row-${student.id}`}>
                    {/* Roll Number */}
                    <td>
                      <span className="roll-badge" title="Unique Roll Number">
                        {student.rollNumber}
                      </span>
                    </td>

                    {/* Student Name with initials */}
                    <td>
                      <div className="student-profile">
                        <div className="avatar">{getInitials(student.name)}</div>
                        <div>
                          <div className="student-name">{student.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            ID #{student.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Branch */}
                    <td>
                      <span className="student-branch-cell">{student.branch}</span>
                    </td>

                    {/* Marks & visual bar */}
                    <td>
                      <div className="marks-container">
                        <span className="marks-score">{student.marks}</span>
                        <div className="marks-bar-bg" title={`${student.marks} / 100`}>
                          <div
                            className="marks-bar-fill"
                            style={{
                              width: `${Math.min(100, Math.max(0, student.marks))}%`,
                              background: getBarGradient(student.marks),
                            }}
                          ></div>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          / 100
                        </span>
                      </div>
                    </td>

                    {/* Grade */}
                    <td>
                      <span
                        className="grade-badge"
                        style={{
                          backgroundColor: gradeStyle.bg,
                          color: gradeStyle.text,
                          border: `1px solid ${gradeStyle.border}`,
                        }}
                      >
                        {student.grade || (student.marks >= 90 ? 'A+' : student.marks >= 80 ? 'A' : student.marks >= 70 ? 'B' : student.marks >= 60 ? 'C' : student.marks >= 50 ? 'D' : student.marks >= 40 ? 'E' : 'F')}
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td>
                      <span
                        className={`status-pill ${
                          isPassed ? 'status-passed' : 'status-failed'
                        }`}
                      >
                        {isPassed ? (
                          <>
                            <Check size={12} />
                            <span>Passed</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle size={12} />
                            <span>Failed</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="btn-action btn-edit"
                          id={`edit-student-${student.id}`}
                          onClick={() => onEditStudent(student)}
                          title="Edit student details"
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="btn-action btn-delete"
                          id={`delete-student-${student.id}`}
                          onClick={() => onDeleteStudent(student)}
                          title="Delete student record"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
