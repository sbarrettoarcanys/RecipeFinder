import { useState } from "react";

export function HomeFilterRecipes({ filter, onFilterChange }) {
  const [activeFilter, setActiveFilter] = useState(filter);
  const filters = [
    { label: "Dish Name", value: "s" },
    { label: "Category", value: "c" },
    { label: "Ingredient", value: "i" },
    { label: "Area", value: "a" },
  ];

  return (
    <>
      <div className="pill-row">
        {filters.map((filter) => (
          <div
            key={filter.value}
            className={`pill ${activeFilter === filter.value ? "active" : ""}`}
            onClick={() => {
              setActiveFilter(filter.value);
              onFilterChange(filter.value);
            }}
          >
            {filter.label}
          </div>
        ))}
      </div>
    </>
  );
}
