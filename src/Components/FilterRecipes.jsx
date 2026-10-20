import { useState, memo } from "react";

function FilterRecipesImpl({ filter, onFilterChange, categoryFilters }) {
  const [activeFilter, setActiveFilter] = useState(filter);

  return (
    <>
      <div
        className="pill-row"
        role="group"
        aria-label="Filter recipes by category"
      >
        {categoryFilters.map((filter) => (
          <button
            type="button"
            key={filter.idCategory}
            id={filter.strCategory}
            className={`pill ${activeFilter === filter.strCategory ? "active" : ""}`}
            aria-pressed={activeFilter === filter.strCategory}
            onClick={() => {
              setActiveFilter(filter.strCategory);
              onFilterChange(filter.strCategory);
            }}
          >
            {filter.strCategory}
          </button>
        ))}
      </div>
    </>
  );
}

export const FilterRecipes = memo(FilterRecipesImpl);
