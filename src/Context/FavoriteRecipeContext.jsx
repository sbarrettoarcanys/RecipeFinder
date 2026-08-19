import { createContext, useState, useContext, useEffect } from "react";

const FavoriteRecipeContext = createContext(null);

export const useFavoriteRecipeContext = () => useContext(FavoriteRecipeContext);

export const FavoriteRecipeProvider = ({ children }) => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  //setting state if there are stored favorite recipes
  useEffect(() => {
    const storedFavoriteRecipes = getItem("favoriteRecipes");

    if (storedFavoriteRecipes) setFavoriteRecipes(storedFavoriteRecipes);
  }, []);

  //saving of favorite recipes to localStorage
  useEffect(() => {
    setItem("favoriteRecipes", favoriteRecipes);
  }, [favoriteRecipes]);

  // addin of recipes to state
  const addToFavoriteRecipes = (recipe) => {
    setFavoriteRecipes((recipes) => [...recipes, recipe]);
  };

  //removal of recipe on state
  //will trigger the useEffect to update recipe list in localStorage
  const removeFromFavoriteRecipes = (recipeId) => {
    setFavoriteRecipes((recipes) =>
      recipes.filter((recipe) => recipe.idMeal !== recipeId),
    );
  };

  const isFavoriteRecipe = (recipeId) => {
    return favoriteRecipes.some((recipe) => recipe.idMeal === recipeId);
  };

  const searchFavoriteRecipe = (searchTerm, category) => {
    const recipesByCategory =
      category && category !== "All"
        ? favoriteRecipes.filter((recipe) =>
            recipe.strCategory.toLowerCase().includes(category.toLowerCase()),
          )
        : favoriteRecipes;

    return searchTerm
      ? recipesByCategory.filter((recipe) =>
          recipe.strMeal.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : recipesByCategory;
  };

  const value = {
    favoriteRecipes,
    addToFavoriteRecipes,
    removeFromFavoriteRecipes,
    isFavoriteRecipe,
    searchFavoriteRecipe,
  };

  return (
    <FavoriteRecipeContext.Provider value={value}>
      {children}
    </FavoriteRecipeContext.Provider>
  );
};

//to extract to utils
function setItem(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
}
function getItem(key) {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : undefined;
  } catch (error) {
    console.log(error);
  }
}
