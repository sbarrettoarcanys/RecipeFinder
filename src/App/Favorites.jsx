import { useState, useEffect } from "react";
import "@/Styles/HomePage.css";
import { useDebounce } from "../Hooks/Debounce.js";
import { getAllCategoriesQueryOption } from "../Hooks/MealDbApiCalls.ts";
import { useFavoriteRecipeContext } from "../Context/FavoriteRecipeContext.jsx";
import { RecipeList } from "../Components/RecipeList.jsx";
import { SearchBar } from "../Components/SearchBar.jsx";
import { FilterRecipes } from "../Components/FilterRecipes.jsx";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { logError } from "../Utils/ErrorLogger.js";

export default function Favorites() {
  const {
    favoriteRecipes,
    searchFavoriteRecipe,
    isLoading: favoritesLoading,
    error: favoritesError,
  } = useFavoriteRecipeContext();

  const [searchParams, setSearchParams] = useSearchParams();

  const [favorites, setFavorites] = useState(favoriteRecipes);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 500);

  const defaultCategory = {
    idCategory: "0",
    strCategory: "All",
    strCategoryThumb: "",
    strCategoryDescription: "",
  };
  const [filter, setFilter] = useState(searchParams.get("filter") || "All");

  //get all categories
  const { data: categoriesData, error: categoriesError } = useQuery(
    getAllCategoriesQueryOption(),
  );
  const categories = [defaultCategory, ...(categoriesData?.categories || [])];

  if (categoriesError) {
    logError(categoriesError, {
      route: "Favorites",
      Action: "searchFavoriteRecipe",
    });
  }

  useEffect(() => {
    let isCancelled = false;

    const searchRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!isCancelled) {
          const recipes = searchFavoriteRecipe(debouncedSearch, filter);
          setFavorites(recipes);
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

    searchRecipe();

    return () => {
      isCancelled = true;
    };
  }, [debouncedSearch, filter, searchFavoriteRecipe, setSearchParams]);

  //include the context's remote favorites status in what the page shows
  const isLoading = loading || favoritesLoading;
  const errorMessage = error || favoritesError?.message;

  return (
    <>
      <div className="topbar">
        <div className="titles">
          <h1>Favorites</h1>
        </div>

        <div
          role="search"
          aria-label="Search recipes"
          style={{ display: "flex", gap: "1rem" }}
        >
          <SearchBar search={search} onSearchChange={setSearch} />
          <FilterRecipes
            filter={filter}
            onFilterChange={setFilter}
            categoryFilters={categories}
          />
        </div>
      </div>

      <div className="section">
        <div className="section-head"></div>
        <div
          className="recommended-grid"
          aria-live="polite"
          aria-busy={isLoading}
        >
          {isLoading && <p>Loading recipes...</p>}

          {errorMessage && <p className="error">{errorMessage}</p>}

          {favorites.length === 0 && !isLoading && !errorMessage && (
            <p>No results for this query.</p>
          )}

          {!isLoading && !errorMessage && <RecipeList recipes={favorites} />}
        </div>
      </div>
    </>
  );
}
