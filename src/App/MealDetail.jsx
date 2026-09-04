import { useState, useEffect } from "react";
import { useParams } from "react-router";
import "@/Styles/MealDetail.css";
import { getRecipeByIdQueryOption } from "../Hooks/ApiCalls.js";
import IngredientList from "../Components/IngredientsList.jsx";
import StepList from "../Components/StepList.jsx";
import { FavoriteButton } from "../Components/RecipeList.jsx";
import { useQuery } from "@tanstack/react-query";
import { logError } from "../Utils/ErrorLogger.js";

export default function MealDetail() {
  const params = useParams();

  if (!params || !params.id || params.id.trim() === "" || params.id == 0) {
    return <div className="meal-detail-error">Error: No recipe found.</div>;
  }
  const id = params.id;

  const {
    data,
    isPending: loading,
    error,
  } = useQuery(getRecipeByIdQueryOption(id));

  const recipe = data?.meals?.[0] || null;

  if (loading) {
    return <p>Loading recipe...</p>;
  }

  if (error) {
    logError(error, {
      route: "MealDetail",
      Action: "getRecipeByIdQueryOption",
    });
    return <p className="error">{error}</p>;
  }

  if (!recipe) {
    return <div className="meal-detail-error">Error: No recipe found.</div>;
  }

  return (
    <div className="meal-detail">
      <div className="meal-detail-head">
        <div className="meal-detail-titles">
          <h1>{recipe.strMeal}</h1>
          <p className="meal-detail-subtitle">
            {[recipe.strCategory, recipe.strArea].filter(Boolean).join(" · ")}
          </p>

          <div className="meal-detail-favorite">
            <FavoriteButton recipe={recipe} />
          </div>
        </div>

        <div className="meal-detail-meta">
          {recipe.strCategory && (
            <span className="meta-item">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 2v20M7 2a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3M17 2v8a3 3 0 1 1-6 0V2M17 12v10" />
              </svg>
              {recipe.strCategory}
            </span>
          )}
          {recipe.strArea && (
            <span className="meta-item">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9z" />
              </svg>
              {recipe.strArea}
            </span>
          )}
        </div>
      </div>

      <div className="meal-detail-image">
        <img src={recipe.strMealThumb} alt={recipe.strMeal} />
      </div>

      <div className="meal-detail-body">
        <IngredientList recipe={recipe} />
        <StepList recipe={recipe} />
      </div>
    </div>
  );
}
