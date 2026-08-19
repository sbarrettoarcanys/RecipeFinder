export function SearchBar({ search, onSearchChange }) {
  return (
    <>
      <div className="search-bar">
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          type="text"
          placeholder="Search recipes"
          id="search-input"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </>
  );
}
