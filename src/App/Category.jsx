import { useState, useEffect } from "react";
import "@/Styles/HomePage.css";
import { debounceInput } from "../Hooks/Debounce.js";
import { getAllCategories, getRecipesByCategory } from "../Hooks/ApiCalls.js";
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

function FilterRecipes({ filter, onFilterChange, categoryFilters }) {
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

function searchFromRecipes(searchTerm, recipes) {
  if (!searchTerm) return recipes ?? [];

  const lowerSearchTerm = searchTerm.toLowerCase();

  return (recipes || []).filter((recipe) =>
    recipe.strMeal?.toLowerCase().includes(lowerSearchTerm),
  );
}

export default function Homepage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [filter, setFilter] = useState(searchParams.get("filter") || "Beef");

  const debouncedSearch = debounceInput(search, 500);

  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //get all categories
  useEffect(() => {
    let isCancelled = false;

    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllCategories();
        if (!isCancelled) {
          setCategories(data?.categories || []);
        }

        setSearchParams((prevParams) => {
          if (debouncedSearch) {
            prevParams.set("search", debouncedSearch);
          } else {
            prevParams.delete("search");
          }

          if (!filter || filter === "s") {
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

    fetchCategories();

    return () => {
      isCancelled = true;
    };
  }, []);

  //get all recipes by categories
  useEffect(() => {
    let isCancelled = false;

    const fetchRecipesByCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRecipesByCategory(filter);
        if (!isCancelled) {
          // setRecipes(data?.meals || []);

          const recipeData = await searchFromRecipes(search, data?.meals || []);

          setRecipes(recipeData ?? []);
        }

        setSearchParams((prevParams) => {
          if (debouncedSearch) {
            prevParams.set("search", debouncedSearch);
          } else {
            prevParams.delete("search");
          }

          if (!filter || filter === "s") {
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

    fetchRecipesByCategories();

    return () => {
      isCancelled = true;
    };
  }, [filter, debouncedSearch]);

  return (
    <>
      <div className="topbar">
        <div className="titles">
          <h1>Category</h1>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <SearchBar search={search} onSearchChange={setSearch} />
          <FilterRecipes
            filter={filter}
            onFilterChange={setFilter}
            categoryFilters={categories}
          />
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
