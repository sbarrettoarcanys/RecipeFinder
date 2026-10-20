import "@/Styles/HomePage.css";
import { memo } from "react";
import { NavLink } from "react-router";
import { FavoriteButton } from "./FavoriteButton.jsx";

import { getRecipeByIdQueryOption } from "../Hooks/MealDbApiCalls.ts";
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

export default RecipeList;
export { RecipeList, RecipeCard };
