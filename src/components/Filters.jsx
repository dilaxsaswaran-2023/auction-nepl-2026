const selectGroups = [
  { key: "gender", label: "Gender", optionKey: "genders" },
  { key: "team2025", label: "2025 Team", optionKey: "teams" },
  { key: "battingStyle", label: "Batting Style", optionKey: "battingStyles" },
  { key: "bowlingStyle", label: "Bowling Style", optionKey: "bowlingStyles" },
];

const sortOptions = [
  { value: "name", label: "Name" },
  { value: "team2025", label: "Team" },
  { value: "battingStyle", label: "Batting Style" },
];

export default function Filters({ filters, onChange, onReset, options }) {
  const updateFilter = (key, value) => {
    onChange((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className="filters-panel" aria-label="Search and filters">
      <label className="search-field">
        <span>Search Player</span>
        <input
          type="search"
          value={filters.search}
          onChange={(event) => updateFilter("search", event.target.value)}
          placeholder="Search by player name"
        />
      </label>

      <div className="filter-controls">
        {selectGroups.map((group) => (
          <label className="select-field" key={group.key}>
            <span>{group.label}</span>
            <select
              value={filters[group.key]}
              onChange={(event) => updateFilter(group.key, event.target.value)}
            >
              <option value="All">All</option>
              {options[group.optionKey].map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <button type="button" className="reset-button" onClick={onReset}>
        Reset filters
      </button>

      <label className="select-field sort-field">
        <span>Sort By</span>
        <select
          value={filters.sortBy}
          onChange={(event) => updateFilter("sortBy", event.target.value)}
        >
          {sortOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}
