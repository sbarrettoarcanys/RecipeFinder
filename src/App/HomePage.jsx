import { useState, useEffect } from "react";
import "@/Styles/HomePage.css";

import { useDebounce } from "../Hooks/Debounce.js";
import { getRecipesQueryOption } from "../Hooks/MealDbApiCalls.ts";
import { RecipeList } from "../Components/RecipeList.jsx";
import { SearchBar } from "../Components/SearchBar.jsx";
import { HomeFilterRecipes } from "../Components/HomeFilterRecipes.jsx";
import { SurpriseMeLink } from "../Components/SurpriseMeLink.jsx";

import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { logError } from "../Utils/ErrorLogger.js";

export default function Homepage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [filter, setFilter] = useState(searchParams.get("filter") || "s");

  const debouncedSearch = useDebounce(search, 500);

  const {
    data,
    isPending: loading,
    error,
  } = useQuery(getRecipesQueryOption(debouncedSearch, filter));

  if (error) {
    logError(error, { route: "Homepage", Action: "getRecipesQueryOption" });
  }

  const recipes = data || [];

  useEffect(() => {
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
  }, [debouncedSearch, filter, setSearchParams]);

  return (
    <>
      <div className="topbar">
        <div className="titles">
          <p className="eyebrow">Discover</p>
          <h1>Recipes</h1>
        </div>

        <div
          role="search"
          aria-label="Search recipes"
          style={{ display: "flex", gap: "1rem" }}
        >
          <SearchBar search={search} onSearchChange={setSearch} />
          <HomeFilterRecipes filter={filter} onFilterChange={setFilter} />
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Recommended</h2>
          <SurpriseMeLink>
            <span className="link-text" id="surprise-me">
              Surprise Me! <span aria-hidden="true">→</span>
            </span>
          </SurpriseMeLink>
        </div>
        <div
          className="recommended-grid"
          aria-live="polite"
          aria-busy={loading}
        >
          {loading && <p>Loading recipes...</p>}

          {error && <p className="error">{error.message}</p>}

          {recipes.length === 0 && !loading && !error && (
            <p>No results for this query.</p>
          )}

          {!loading && !error && <RecipeList recipes={recipes} />}
        </div>
      </div>
    </>
  );
}
