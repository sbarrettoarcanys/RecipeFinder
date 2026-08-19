import { useState, useEffect } from "react";
import "@/Styles/HomePage.css";
import { debounceInput } from "../Hooks/Debounce.js";
import { getRecipesBySearch } from "../Hooks/ApiCalls.js";
import { useFavoriteRecipeContext } from "../Context/FavoriteRecipeContext.jsx";
import { RecipeList } from "../Components/RecipeList.jsx";
import { SearchBar } from "../Components/SearchBar.jsx";
import { FilterRecipes } from "../Components/FilterRecipes.jsx";
import { useSearchParams } from "react-router";
import { getAllCategories } from "../Hooks/ApiCalls.js";

export default function Favorites() {
  const { favoriteRecipes, searchFavoriteRecipe } = useFavoriteRecipeContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const [favorites, setFavorites] = useState(favoriteRecipes);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = debounceInput(search, 500);

  const defaultCategory = {
    idCategory: "0",
    strCategory: "All",
    strCategoryThumb: "",
    strCategoryDescription: "",
  };
  const [filter, setFilter] = useState(searchParams.get("filter"));
  const [categories, setCategories] = useState([defaultCategory]);

  //get all categories
  useEffect(() => {
    let isCancelled = false;
    console.log(categories[0]);

    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllCategories();
        if (!isCancelled) {
          setCategories([defaultCategory, ...(data?.categories || [])]);
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

    fetchCategories();

    return () => {
      isCancelled = true;
    };
  }, []);

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
  }, [debouncedSearch, filter]);

  return (
    <>
      <div className="topbar">
        <div className="titles">
          <h1>Favorites</h1>
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
        <div className="section-head"></div>
        <div className="recommended-grid">
          {loading && <p>Loading recipes...</p>}

          {error && <p className="error">{error}</p>}

          {favorites.length === 0 && !loading && !error && (
            <p>No results for this query.</p>
          )}

          {!loading && !error && <RecipeList recipes={favorites} />}
        </div>
      </div>
    </>
  );
}
