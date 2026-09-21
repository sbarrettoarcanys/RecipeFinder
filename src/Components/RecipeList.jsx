import "@/Styles/HomePage.css";
import { memo } from "react";
import { NavLink } from "react-router";
import { useFavoriteRecipeContext } from "../Context/FavoriteRecipeContext.jsx";

import { getRecipeByIdQueryOption } from "../Hooks/ApiCalls.js";
import { useQueryClient } from "@tanstack/react-query";
import { logError } from "../Utils/ErrorLogger.js";

const RecipeList = memo(function RecipeList({ recipes }) {
  return (
    <>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.idMeal} recipe={recipe} />
      ))}
    </>
  );
});

const RecipeCard = memo(function RecipeCard({ recipe }) {
  //prefetch recipe data on hover, focus, or click to improve perceived performance
  const queryClient = useQueryClient();
  async function handlePrefetch(id) {
    await queryClient.query(getRecipeByIdQueryOption(id)).catch((error) => {
      logError(error, {
        route: "RecipeList",
        Action: "getRecipeByIdQueryOption",
      });
    });
  }

  return (
    <div
      onMouseEnter={() => handlePrefetch(recipe.idMeal)}
      onFocus={() => handlePrefetch(recipe.idMeal)}
      onClick={() => handlePrefetch(recipe.idMeal)}
    >
      <NavLink to={`/meal-detail/${recipe.idMeal}`} className="recipe-card">
        <div
          className="thumb"
          name={recipe.strMeal}
          role="img"
          aria-label={recipe.strMeal}
          style={{
            backgroundImage: `url(${recipe.strMealThumb})`,
          }}
        >
          <FavoriteButton recipe={recipe} />

          <div className="category-row">
            {recipe.strCategory && (
              <span className="category-chip">{recipe.strCategory}</span>
            )}

            {recipe.strArea && (
              <span className="category-chip">{recipe.strArea}</span>
            )}
          </div>
        </div>
        <div className="info">
          <h3>{recipe.strMeal}</h3>
        </div>
      </NavLink>
    </div>
  );
});

const FavoriteButton = memo(function FavoriteButton({ recipe }) {
  const { isFavoriteRecipe, addToFavoriteRecipes, removeFromFavoriteRecipes } =
    useFavoriteRecipeContext();
  const isfavoriteRecipe = isFavoriteRecipe(recipe.idMeal);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isfavoriteRecipe) removeFromFavoriteRecipes(recipe.idMeal);
    else addToFavoriteRecipes(recipe);
  };

  return (
    <span
      className={`badge ${isfavoriteRecipe ? "like" : "default"}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title={isfavoriteRecipe ? "Unfavorite" : "Favorite"}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 20.5c-1.1-1.1-7.5-5.9-9.2-9.2A5.2 5.2 0 0 1 7.6 4.5c1.7 0 2.8.8 3.4 1.8.6-1 1.7-1.8 3.4-1.8a5.2 5.2 0 0 1 4.8 6.8c-1.7 3.3-8.1 8.1-9.2 9.2Z" />
      </svg>
    </span>
  );
});

export default RecipeList;
export { RecipeList, RecipeCard, FavoriteButton };
