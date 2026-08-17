import { useState, useEffect } from "react";
import "@/Styles/HomePage.css";
import { debounceInput } from "../Hooks/Debounce.js";
import { getRecipesBySearch } from "../Hooks/ApiCalls.js";
import { RecipeList } from "../Components/RecipeList.jsx";

import { useSearchParams } from "react-router";

function SearchBar({ search, onSearchChange }) {
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

        {/* <svg
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
          className="filter-icon"
        >
          <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
        </svg> */}
      </div>
    </>
  );
}

function FilterRecipes({ filter, onFilterChange }) {
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

export default function Homepage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [filter, setFilter] = useState(searchParams.get("filter") || "s");

  const debouncedSearch = debounceInput(search, 500);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRecipesBySearch(debouncedSearch, filter);
        if (!isCancelled) {
          setRecipes(data?.meals || []);
        }

        setSearchParams((prevParams) => {
          if (debouncedSearch) {
            prevParams.set("search", debouncedSearch);
          } else {
            prevParams.delete("search");
          }

          if (!filter) {
            prevParams.delete("filter");
          } else {
            prevParams.set("filter", filter); // Reset page when changing sort order
          }

          // 2. Return it to update the URL
          return prevParams;
        });
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchRecipes();

    return () => {
      isCancelled = true;
    };
  }, [debouncedSearch, filter]);

  return (
    <>
      <div className="topbar">
        <div className="titles">
          <p className="eyebrow">Discover</p>
          <h1>Recipes</h1>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <SearchBar search={search} onSearchChange={setSearch} />
          <FilterRecipes filter={filter} onFilterChange={setFilter} />
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Recommended</h2>
          <a className="see-all" href="#">
            See all →
          </a>
        </div>
        <div className="recommended-grid">
          {loading && <p>Loading recipes...</p>}

          {error && <p className="error">{error}</p>}

          {recipes.length === 0 && !loading && !error && (
            <p>No results for this query.</p>
          )}

          {!loading && !error && <RecipeList recipes={recipes} />}
        </div>
      </div>
    </>
  );
}
