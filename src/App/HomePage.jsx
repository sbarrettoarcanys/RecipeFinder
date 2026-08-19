import { useState, useEffect } from "react";
import "@/Styles/HomePage.css";
import "@/Styles/App.css";

import { debounceInput } from "../Hooks/Debounce.js";
import { getRecipesBySearch } from "../Hooks/ApiCalls.js";
import { RecipeList } from "../Components/RecipeList.jsx";
import { SearchBar } from "../Components/SearchBar.jsx";
import { HomeFilterRecipes } from "../Components/HomeFilterRecipes.jsx";

import { useSearchParams } from "react-router";

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
          <SearchBar search={debouncedSearch} onSearchChange={setSearch} />
          <HomeFilterRecipes filter={filter} onFilterChange={setFilter} />
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Recommended</h2>
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
