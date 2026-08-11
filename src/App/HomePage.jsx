import { useState, useEffect } from "react";
import "@/Styles/HomePage.css";
import { debounceInput } from "../Hooks/Debounce.js";
import { getRecipesBySearch } from "../Hooks/ApiCalls.js";

function FavoriteButton({ recipeId }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <span
      className={`badge ${isFavorite ? "like" : "default"}`}
      onClick={() => setIsFavorite((prev) => !prev)}
      role="button"
      tabIndex={0}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 20.5c-1.1-1.1-7.5-5.9-9.2-9.2A5.2 5.2 0 0 1 7.6 4.5c1.7 0 2.8.8 3.4 1.8.6-1 1.7-1.8 3.4-1.8a5.2 5.2 0 0 1 4.8 6.8c-1.7 3.3-8.1 8.1-9.2 9.2Z" />
      </svg>
    </span>
  );
}

function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card">
      <div
        className="thumb"
        style={{ backgroundImage: `url(${recipe.strMealThumb})` }}
      >
        <FavoriteButton recipeId={recipe.idMeal} />
        <span className="category-chip">{recipe.strCategory}</span>
      </div>
      <div className="info">
        <h3>{recipe.strMeal}</h3>
      </div>
    </div>
  );
}

function RecipeList({ recipes }) {
  return (
    <>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.idMeal} recipe={recipe} />
      ))}
    </>
  );
}

function SearchBar({ search, onSearchChange }) {
  return (
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
    </div>
  );
}

export default function Homepage() {
  const [search, setSearch] = useState("");
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
        const data = await getRecipesBySearch(debouncedSearch);
        if (!isCancelled) {
          setRecipes(data?.meals || []);
        }
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
  }, [debouncedSearch]);

  return (
    <>
      <div className="topbar">
        <div className="titles">
          <p className="eyebrow">Discover</p>
          <h1>Recipes</h1>
        </div>

        <SearchBar search={search} onSearchChange={setSearch} />
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
          {!loading && !error && <RecipeList recipes={recipes} />}
        </div>
      </div>
    </>
  );
}
