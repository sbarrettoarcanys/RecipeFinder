import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";

import { getItem, setItem } from "../Utils/LocalStorage.js";

const FavoriteRecipeContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components -- context hook lives alongside its provider
export const useFavoriteRecipeContext = () => useContext(FavoriteRecipeContext);

export const FavoriteRecipeProvider = ({ children }) => {
  //initializing state from any stored favorite recipes
  const [favoriteRecipes, setFavoriteRecipes] = useState(
    () => getItem("favoriteRecipes") || [],
  );

  //saving of favorite recipes to localStorage
  useEffect(() => {
    setItem("favoriteRecipes", favoriteRecipes);
  }, [favoriteRecipes]);

  // addin of recipes to state
  const addToFavoriteRecipes = useCallback((recipe) => {
    setFavoriteRecipes((recipes) => [...recipes, recipe]);
  }, []);

  //removal of recipe on state
  //will trigger the useEffect to update recipe list in localStorage
  const removeFromFavoriteRecipes = useCallback((recipeId) => {
    setFavoriteRecipes((recipes) =>
      recipes.filter((recipe) => recipe.idMeal !== recipeId),
    );
  }, []);

  const isFavoriteRecipe = useCallback(
    (recipeId) => {
      return favoriteRecipes.some((recipe) => recipe.idMeal === recipeId);
    },
    [favoriteRecipes],
  );

  const searchFavoriteRecipe = useCallback(
    (searchTerm, category) => {
      const recipesByCategory =
        category && category !== "All"
          ? favoriteRecipes.filter((recipe) =>
              recipe.strCategory
                ?.toLowerCase()
                .includes(category.toLowerCase()),
            )
          : favoriteRecipes;

      return searchTerm
        ? recipesByCategory.filter((recipe) =>
            recipe.strMeal.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : recipesByCategory;
    },
    [favoriteRecipes],
  );

  const value = useMemo(
    () => ({
      favoriteRecipes,
      addToFavoriteRecipes,
      removeFromFavoriteRecipes,
      isFavoriteRecipe,
      searchFavoriteRecipe,
    }),
    [
      favoriteRecipes,
      addToFavoriteRecipes,
      removeFromFavoriteRecipes,
      isFavoriteRecipe,
      searchFavoriteRecipe,
    ],
  );

  return (
    <FavoriteRecipeContext.Provider value={value}>
      {children}
    </FavoriteRecipeContext.Provider>
  );
};
