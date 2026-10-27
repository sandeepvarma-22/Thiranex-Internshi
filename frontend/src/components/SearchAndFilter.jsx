import React from 'react';
import { Search, X, Filter, ArrowUpDown } from 'lucide-react';

const BRANCH_OPTIONS = [
  'All Branches',
  'Computer Science',
  'Information Technology',
  'Electronics & Comm',
  'Mechanical Eng',
  'Civil Engineering',
];

const SearchAndFilter = ({
  searchQuery,
  onSearchChange,
  selectedBranch,
  onBranchChange,
  sortBy,
  onSortChange,
  onClearSearch,
  totalMatches,
  onQuickRollSearch,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      onQuickRollSearch(searchQuery.trim());
    }
  };

  return (
    <div className="control-panel">
      <div className="control-bar">
        {/* Search input for Roll Number or Name */}
        <div className="search-box-group">
          <div className="input-with-icon">
            <Search className="input-icon" size={18} />
            <input
              id="search-roll-input"
              type="text"
              className="input-field"
              placeholder="Search by Roll Number (e.g., CS101) or Name..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-btn"
                onClick={onClearSearch}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onQuickRollSearch(searchQuery)}
            disabled={!searchQuery.trim()}
            title="Search roll number"
          >
            Find
          </button>
        </div>

        {/* Filters and Sorting */}
        <div className="filter-group">
          {/* Branch Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              id="branch-filter-select"
              className="select-field"
              value={selectedBranch}
              onChange={(e) => onBranchChange(e.target.value)}
            >
              {BRANCH_OPTIONS.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={16} color="var(--text-muted)" />
            <select
              id="sort-select"
              className="select-field"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="roll-asc">Sort: Roll Number (Asc)</option>
              <option value="roll-desc">Sort: Roll Number (Desc)</option>
              <option value="name-asc">Sort: Student Name (A-Z)</option>
              <option value="marks-desc">Sort: Marks (High to Low)</option>
              <option value="marks-asc">Sort: Marks (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Branch filter pills */}
      <div className="branch-pills">
        {BRANCH_OPTIONS.map((branch) => {
          const isActive = selectedBranch === branch;
          return (
            <button
              key={branch}
              type="button"
              className={`pill ${isActive ? 'active' : ''}`}
              onClick={() => onBranchChange(branch)}
            >
              {branch}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchAndFilter;
