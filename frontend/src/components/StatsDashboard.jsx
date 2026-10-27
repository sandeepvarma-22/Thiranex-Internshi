import React from 'react';
import { Users, Award, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

const StatsDashboard = ({ stats, loading }) => {
  const {
    totalStudents = 0,
    averageMarks = 0,
    highestMarks = 0,
    lowestMarks = 0,
    passedCount = 0,
    failedCount = 0,
    passPercentage = 0,
  } = stats || {};

  return (
    <div className="stats-grid">
      {/* Total Students Registered */}
      <div className="stat-card stat-primary">
        <div className="stat-header">
          <span className="stat-label">Total Registered</span>
          <div className="stat-icon-wrap">
            <Users size={20} />
          </div>
        </div>
        <div className="stat-value" id="stat-total-students">
          {loading ? '...' : totalStudents}
        </div>
        <div className="stat-subtext">
          {totalStudents === 1 ? '1 student on record' : `${totalStudents} students on record`}
        </div>
      </div>

      {/* Class Average Marks */}
      <div className="stat-card stat-info">
        <div className="stat-header">
          <span className="stat-label">Class Average</span>
          <div className="stat-icon-wrap">
            <TrendingUp size={20} />
          </div>
        </div>
        <div className="stat-value" id="stat-average-marks">
          {loading ? '...' : `${averageMarks} / 100`}
        </div>
        <div className="stat-subtext">
          Overall performance metric
        </div>
      </div>

      {/* Highest Marks */}
      <div className="stat-card stat-success">
        <div className="stat-header">
          <span className="stat-label">Highest Score</span>
          <div className="stat-icon-wrap">
            <Award size={20} />
          </div>
        </div>
        <div className="stat-value" id="stat-highest-marks">
          {loading ? '...' : `${highestMarks}%`}
        </div>
        <div className="stat-subtext">
          Lowest score recorded: {loading ? '...' : `${lowestMarks}%`}
        </div>
      </div>

      {/* Pass Rate */}
      <div className="stat-card stat-warning">
        <div className="stat-header">
          <span className="stat-label">Pass Rate</span>
          <div className="stat-icon-wrap">
            <CheckCircle size={20} />
          </div>
        </div>
        <div className="stat-value" id="stat-pass-rate">
          {loading ? '...' : `${passPercentage}%`}
        </div>
        <div className="stat-subtext">
          {loading ? '...' : `${passedCount} Passed • ${failedCount} Failed (Passing mark: 40)`}
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
