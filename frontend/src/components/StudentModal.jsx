import React, { useState, useEffect } from 'react';
import { X, User, Hash, BookOpen, Award, AlertCircle, CheckCircle2 } from 'lucide-react';

const BRANCH_OPTIONS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Comm',
  'Mechanical Eng',
  'Civil Engineering',
  'Data Science & AI',
  'Electrical Engineering',
];

const StudentModal = ({ isOpen, onClose, onSave, studentToEdit, existingRollNumbers = [] }) => {
  const isEditMode = Boolean(studentToEdit);

  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    branch: 'Computer Science',
    marks: 75,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Initialize or reset form when modal opens or studentToEdit changes
  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        name: studentToEdit.name || '',
        rollNumber: studentToEdit.rollNumber || '',
        branch: studentToEdit.branch || 'Computer Science',
        marks: studentToEdit.marks !== undefined ? studentToEdit.marks : 75,
      });
    } else {
      setFormData({
        name: '',
        rollNumber: '',
        branch: 'Computer Science',
        marks: 75,
      });
    }
    setErrors({});
    setServerError('');
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  // Real-time validation helper
  const validateField = (field, value) => {
    let error = '';

    if (field === 'name') {
      if (!value.trim()) {
        error = 'Student name cannot be empty';
      } else if (value.trim().length < 2) {
        error = 'Name must be at least 2 characters';
      }
    }

    if (field === 'rollNumber') {
      const normalized = value.trim().toUpperCase();
      if (!normalized) {
        error = 'Roll number is required';
      } else if (!/^[A-Za-z0-9_-]+$/.test(normalized)) {
        error = 'Roll number can only contain letters, numbers, and hyphens';
      } else {
        // Check for duplicate roll number locally
        const isDuplicate = existingRollNumbers.some((r) => {
          if (isEditMode && studentToEdit && studentToEdit.rollNumber.toUpperCase() === normalized) {
            return false; // unchanged own roll number
          }
          return r.toUpperCase() === normalized;
        });

        if (isDuplicate) {
          error = `Roll number '${normalized}' is already registered. Please choose a unique one.`;
        }
      }
    }

    if (field === 'marks') {
      const num = Number(value);
      if (value === '' || isNaN(num)) {
        error = 'Marks are required';
      } else if (num < 0 || num > 100) {
        error = 'Marks must be strictly between 0 and 100';
      }
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setServerError('');
    validateField(field, value);
  };

  const calculateGradePreview = (m) => {
    const marks = Number(m);
    if (isNaN(marks)) return 'N/A';
    if (marks >= 90) return 'A+ (Outstanding)';
    if (marks >= 80) return 'A (Excellent)';
    if (marks >= 70) return 'B (Very Good)';
    if (marks >= 60) return 'C (Good)';
    if (marks >= 50) return 'D (Satisfactory)';
    if (marks >= 40) return 'E (Pass)';
    return 'F (Fail - Below 40)';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const isNameValid = validateField('name', formData.name);
    const isRollValid = validateField('rollNumber', formData.rollNumber);
    const isMarksValid = validateField('marks', formData.marks);

    if (!isNameValid || !isRollValid || !isMarksValid) {
      return;
    }

    const payload = {
      name: formData.name.trim(),
      rollNumber: formData.rollNumber.trim().toUpperCase(),
      branch: formData.branch.trim(),
      marks: parseInt(formData.marks, 10),
    };

    setSubmitting(true);
    try {
      await onSave(payload, isEditMode ? studentToEdit.id : null);
      onClose();
    } catch (err) {
      // Backend error returned
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...err.fieldErrors }));
      }
      setServerError(err.message || 'Failed to save student record');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Award size={22} color="var(--primary)" />
            <span>{isEditMode ? 'Edit Student Details' : 'Add New Student'}</span>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            title="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Server Error Alert Banner */}
            {serverError && (
              <div className="validation-alert" role="alert">
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Validation Notice:</strong> {serverError}
                </div>
              </div>
            )}

            {/* Student Name Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="student-name-input">
                <span>
                  Student Full Name <span className="required-star">*</span>
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  Letters only
                </span>
              </label>
              <div className="input-with-icon">
                <User className="input-icon" size={17} />
                <input
                  id="student-name-input"
                  type="text"
                  className={`form-input ${errors.name ? 'has-error' : ''}`}
                  placeholder="e.g. Aarav Sharma"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={submitting}
                  autoFocus
                />
              </div>
              {errors.name && (
                <div className="field-error-msg">
                  <AlertCircle size={13} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Roll Number Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="student-roll-input">
                <span>
                  Roll Number <span className="required-star">*</span>
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  Must be unique
                </span>
              </label>
              <div className="input-with-icon">
                <Hash className="input-icon" size={17} />
                <input
                  id="student-roll-input"
                  type="text"
                  className={`form-input ${errors.rollNumber ? 'has-error' : ''}`}
                  placeholder="e.g. CS101, IT205"
                  value={formData.rollNumber}
                  onChange={(e) => handleChange('rollNumber', e.target.value.toUpperCase())}
                  disabled={submitting}
                />
              </div>
              {errors.rollNumber && (
                <div className="field-error-msg">
                  <AlertCircle size={13} />
                  <span>{errors.rollNumber}</span>
                </div>
              )}
            </div>

            {/* Branch Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="student-branch-select">
                <span>
                  Department / Branch <span className="required-star">*</span>
                </span>
              </label>
              <div className="input-with-icon">
                <BookOpen className="input-icon" size={17} />
                <select
                  id="student-branch-select"
                  className="form-input"
                  value={formData.branch}
                  onChange={(e) => handleChange('branch', e.target.value)}
                  disabled={submitting}
                >
                  {BRANCH_OPTIONS.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Marks & Slider Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="student-marks-input">
                <span>
                  Marks Obtained (0 - 100) <span className="required-star">*</span>
                </span>
                <span style={{ color: Number(formData.marks) >= 40 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                  {calculateGradePreview(formData.marks)}
                </span>
              </label>

              <div className="marks-slider-wrapper">
                <div className="marks-slider-header">
                  <div className="marks-display-box">
                    <span className="marks-big-number" style={{ color: Number(formData.marks) >= 40 ? '#34d399' : '#f87171' }}>
                      {formData.marks !== '' ? formData.marks : 0}
                    </span>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>/ 100</span>
                  </div>

                  <input
                    id="student-marks-input"
                    type="number"
                    min="0"
                    max="100"
                    style={{ width: '80px', textAlign: 'center' }}
                    className={`form-input ${errors.marks ? 'has-error' : ''}`}
                    value={formData.marks}
                    onChange={(e) => handleChange('marks', e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isNaN(Number(formData.marks)) ? 0 : Number(formData.marks)}
                  onChange={(e) => handleChange('marks', parseInt(e.target.value, 10))}
                  className="marks-slider"
                  disabled={submitting}
                />
                <div className="marks-range-labels">
                  <span>0 (Min)</span>
                  <span>40 (Pass Threshold)</span>
                  <span>100 (Max)</span>
                </div>
              </div>

              {errors.marks && (
                <div className="field-error-msg">
                  <AlertCircle size={13} />
                  <span>{errors.marks}</span>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-student-btn"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving to Database...' : isEditMode ? 'Update Student Record' : 'Save Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
