import { useState } from "react";

export function FilterRecipes({ filter, onFilterChange, categoryFilters }) {
  const [activeFilter, setActiveFilter] = useState(filter);

  return (
    <>
      <div className="pill-row">
        {categoryFilters.map((filter) => (
          <div
            key={filter.idCategory}
            className={`pill ${activeFilter === filter.strCategory ? "active" : ""}`}
            onClick={() => {
              setActiveFilter(filter.strCategory);
              onFilterChange(filter.strCategory);
            }}
          >
            {filter.strCategory}
          </div>
        ))}
      </div>
    </>
  );
}
