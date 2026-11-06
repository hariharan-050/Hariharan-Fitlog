import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchFilterBar = ({
  onSearch,
  onFilterGoal,
  currentGoal = '',
  loading = false,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [goal, setGoal] = useState(currentGoal);

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (onSearch) {
      onSearch({ query, goal });
    }
  };

  const handleGoalChange = (e) => {
    const selectedGoal = e.target.value;
    setGoal(selectedGoal);
    if (onFilterGoal) {
      onFilterGoal(selectedGoal);
    }
  };

  return (
    <form className="search-filter-bar" onSubmit={handleSearchSubmit}>
      <div className="search-input-group">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search master titles or descriptions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search master titles or descriptions..."
        />
      </div>

      <div className="filter-select-group">
        <select
          className="filter-select"
          value={goal}
          onChange={handleGoalChange}
          aria-label="Filter by training goal"
        >
          <option value="">All Master Goals</option>
          <option value="STRENGTH">Strength Baseline</option>
          <option value="HYPERTROPHY">Hypertrophy Surge</option>
          <option value="ENDURANCE">Endurance Capacity</option>
          <option value="POWERLIFTING">Powerlifting Focus</option>
        </select>
      </div>

      <button
        type="submit"
        className="btn btn-primary search-submit-btn"
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
};

export default SearchFilterBar;
