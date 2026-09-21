import { useState, memo } from "react";

function HomeFilterRecipesImpl({ filter, onFilterChange }) {
  const [activeFilter, setActiveFilter] = useState(filter);
  const filters = [
    { id: "dish-name", label: "Dish Name", value: "s" },
    { id: "category", label: "Category", value: "c" },
    { id: "ingredient", label: "Ingredient", value: "i" },
    { id: "area", label: "Area", value: "a" },
  ];

  return (
    <>
      <div className="pill-row">
        {filters.map((filter) => (
          <div
            id={filter.id}
            key={filter.id}
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

export const HomeFilterRecipes = memo(HomeFilterRecipesImpl);
