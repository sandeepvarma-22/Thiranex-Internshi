import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, student, deleting }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ color: 'var(--danger)' }}>
            <AlertTriangle size={22} />
            <span>Confirm Deletion</span>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            title="Cancel"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
            Are you sure you want to delete the student record for:
          </p>
          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              marginTop: '8px',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fca5a5' }}>
              {student.name}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Roll Number: <span style={{ fontFamily: 'monospace', color: '#fff' }}>{student.rollNumber}</span> • {student.branch}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Current Marks: {student.marks} / 100
            </div>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '12px' }}>
            This action cannot be undone. The student record will be permanently removed from the database.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            id="confirm-delete-btn"
            className="btn btn-danger"
            onClick={() => onConfirm(student.id)}
            disabled={deleting}
          >
            <Trash2 size={16} />
            <span>{deleting ? 'Deleting from Database...' : 'Yes, Delete Record'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
