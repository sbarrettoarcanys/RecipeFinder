import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { getItem, setItem } from "../Utils/LocalStorage.js";
import { logError } from "../Utils/ErrorLogger.js";
import { useAuth } from "./AuthContext.jsx";
import {
  getFavoriteIdsQueryOption,
  updateFavoriteStatus,
} from "../DataAccess/FavoritesRepository.js";
import { useRecipesByIdList } from "../Hooks/MealDbApiCalls.ts";

const FavoriteRecipeContext = createContext(null);

// shared empty list so query defaults keep a stable reference between renders
const EMPTY_IDS = [];

// eslint-disable-next-line react-refresh/only-export-components -- context hook lives alongside its provider
export const useFavoriteRecipeContext = () => useContext(FavoriteRecipeContext);

// Logged-in users read/write favorites in Supabase; guests use localStorage
export const FavoriteRecipeProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.uid;
  const queryClient = useQueryClient();

  //guest favorites, initialized from localStorage
  const [localFavorites, setLocalFavorites] = useState(
    () => getItem("favoriteRecipes") || [],
  );

  //saving of guest favorites to localStorage
  useEffect(() => {
    setItem("favoriteRecipes", localFavorites);
  }, [localFavorites]);

  //meal ids of the signed-in user's favorites (query is disabled for guests)
  const {
    data: favoriteIds = EMPTY_IDS,
    isLoading: idsLoading,
    error: idsError,
  } = useQuery(getFavoriteIdsQueryOption(userId));

  //full recipe details for those ids
  const {
    recipes: remoteRecipes,
    isLoading: recipesLoading,
    error: recipesError,
  } = useRecipesByIdList(userId ? favoriteIds : EMPTY_IDS);

  const favoriteRecipes = useMemo(
    () => (userId ? remoteRecipes : localFavorites),
    [userId, remoteRecipes, localFavorites],
  );

  const isLoading =
    authLoading || Boolean(userId && (idsLoading || recipesLoading));
  const error = userId ? idsError || recipesError : null;

  useEffect(() => {
    if (error) {
      logError(error, {
        route: "FavoriteRecipeProvider",
        Action: "getFavoriteRecipes",
      });
    }
  }, [error]);

  //updates the cached ids right away, rolls back if Supabase rejects the change
  const { mutate: updateFavorite } = useMutation({
    mutationFn: ({ mealId, isActive }) =>
      updateFavoriteStatus(userId, mealId, isActive),
    onMutate: async ({ mealId, isActive }) => {
      const { queryKey } = getFavoriteIdsQueryOption(userId);
      await queryClient.cancelQueries({ queryKey });

      const previousIds = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (ids = []) => {
        if (!isActive) return ids.filter((id) => id !== mealId);
        return ids.includes(mealId) ? ids : [...ids, mealId];
      });

      return { queryKey, previousIds };
    },
    onError: (err, _variables, context) => {
      if (context) {
        queryClient.setQueryData(context.queryKey, context.previousIds);
      }
      logError(`${err.code}: ${err.message}`, {
        route: "FavoriteRecipeProvider",
        Action: "updateFavoriteStatus",
      });
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
    },
  });

  // addin of recipes to favorites
  const addToFavoriteRecipes = useCallback(
    (recipe) => {
      if (userId) {
        updateFavorite({ mealId: recipe.idMeal, isActive: true });
      } else {
        setLocalFavorites((recipes) => [...recipes, recipe]);
      }
    },
    [userId, updateFavorite],
  );

  //removal of recipe from favorites
  const removeFromFavoriteRecipe = useCallback(
    (recipeId) => {
      if (userId) {
        updateFavorite({ mealId: recipeId, isActive: false });
      } else {
        setLocalFavorites((recipes) =>
          recipes.filter((recipe) => recipe.idMeal !== recipeId),
        );
      }
    },
    [userId, updateFavorite],
  );

  //removal of all guest favorites
  //will trigger the useEffect to clear recipe list in localStorage
  const clearFavoriteRecipes = useCallback(() => {
    setLocalFavorites([]);
  }, []);

  const favoriteIdSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  //logged-in users check ids so the button updates before details load
  const isFavoriteRecipe = useCallback(
    (recipeId) => {
      return userId
        ? favoriteIdSet.has(recipeId)
        : localFavorites.some((recipe) => recipe.idMeal === recipeId);
    },
    [userId, favoriteIdSet, localFavorites],
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
      isLoading,
      error,
      addToFavoriteRecipes,
      removeFromFavoriteRecipes: removeFromFavoriteRecipe,
      clearFavoriteRecipes,
      isFavoriteRecipe,
      searchFavoriteRecipe,
    }),
    [
      favoriteRecipes,
      isLoading,
      error,
      addToFavoriteRecipes,
      removeFromFavoriteRecipe,
      clearFavoriteRecipes,
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
