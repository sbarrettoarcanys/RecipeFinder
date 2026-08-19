import "@/Styles/HomePage.css";
import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { useFavoriteRecipeContext } from "../Context/FavoriteRecipeContext.jsx";

export default function RecipeList({ recipes }) {
  return (
    <>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.idMeal} recipe={recipe} />
      ))}
    </>
  );
}

function RecipeCard({ recipe }) {
  return (
    <div>
      <NavLink to={`/meal-detail/${recipe.idMeal}`} className="recipe-card">
        <div
          className="thumb"
          style={{ backgroundImage: `url(${recipe.strMealThumb})` }}
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
}

function FavoriteButton({ recipe }) {
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
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 20.5c-1.1-1.1-7.5-5.9-9.2-9.2A5.2 5.2 0 0 1 7.6 4.5c1.7 0 2.8.8 3.4 1.8.6-1 1.7-1.8 3.4-1.8a5.2 5.2 0 0 1 4.8 6.8c-1.7 3.3-8.1 8.1-9.2 9.2Z" />
      </svg>
    </span>
  );
}

export { RecipeList, RecipeCard, FavoriteButton };
