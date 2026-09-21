import { useState, useEffect } from "react";
import "@/Styles/HomePage.css";
import { useDebounce } from "../Hooks/Debounce.js";
import {
  getAllCategoriesQueryOption,
  getRecipesByCategoryQueryOption,
} from "../Hooks/ApiCalls.js";
import { RecipeList } from "../Components/RecipeList.jsx";
import { SearchBar } from "../Components/SearchBar.jsx";
import { FilterRecipes } from "../Components/FilterRecipes.jsx";

import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { logError } from "../Utils/ErrorLogger.js";

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

  const debouncedSearch = useDebounce(search, 500);

  //get all categories
  const { data: categoriesData } = useQuery(getAllCategoriesQueryOption());
  const categories = categoriesData?.categories || [];

  //get all recipes by category
  const {
    data: recipesData,
    isPending: loading,
    error,
  } = useQuery(getRecipesByCategoryQueryOption(filter));

  if (error) {
    logError(error, {
      route: "Category",
      Action: "getRecipesByCategoryQueryOption",
    });
  }

  const recipes = searchFromRecipes(search, recipesData?.meals || []);

  // keep the URL in sync with the debounced search/filter
  useEffect(() => {
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
  }, [filter, debouncedSearch, setSearchParams]);

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
        </div>
        <div className="recommended-grid">
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
