import React from 'react';
import { GraduationCap, PlusCircle, CheckCircle2 } from 'lucide-react';

const Header = ({ onOpenAddModal, backendOnline, totalCount }) => {
  return (
    <header className="header">
      <div className="container header-content">
        <div className="brand-wrapper">
          <div className="brand-icon">
            <GraduationCap size={26} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="brand-title">Student Record Management</h1>
            <div className="brand-subtitle">
              <span>Spring Boot REST API • H2 Database</span>
              <span>•</span>
              <span className="status-indicator">
                <span className="status-dot"></span>
                {backendOnline ? 'Backend Online' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button
            id="add-student-btn"
            className="btn btn-primary"
            onClick={onOpenAddModal}
          >
            <PlusCircle size={18} />
            <span>Add New Student</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
