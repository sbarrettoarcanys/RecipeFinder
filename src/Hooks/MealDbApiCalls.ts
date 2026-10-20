import {
  queryOptions,
  useQueries,
  type UseQueryResult,
} from "@tanstack/react-query";
import { Meal } from "../ViewModels/RecipeViewModel.ts";

// Free public sandbox key is '1'
const API_KEY = "1";
const BASE_URL = `https://themealdb.com/api/json/v1/${API_KEY}`;

const getRecipesBySearch = async (
  searchTerm: string | null,
  filter: string | null,
) => {
  filter = filter || "s"; // Default to search by name if no filter is provided
  const endpoint = filter === "s" ? "search.php" : "filter.php"; // Determine endpoint based on filter

  const response = await fetch(
    `${BASE_URL}/${endpoint}?${filter}=${searchTerm}`,
  );

  if (!response.ok) throw new Error("Network response failed");

  const data = await response.json();

  const meals: Meal[] = data.meals || [];
  return meals;
};

const getRecipeById = async (id: string) => {
  const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);

  if (!response.ok) throw new Error("Network response failed");

  const data = await response.json();
  const meal: Meal = data?.meals?.[0] || {};
  return meal;
};

const getRandomRecipe = async () => {
  const response = await fetch(`${BASE_URL}/random.php`);

  if (!response.ok) throw new Error("Network response failed");

  const data = await response.json();
  const meal: Meal = data || {};

  return meal;
};

const getAllCategories = async () => {
  const response = await fetch(`${BASE_URL}/categories.php`);

  if (!response.ok) throw new Error("Network response failed");

  const data = await response.json();
  const meals: Meal[] = data || [];

  return meals;
};

const getRecipesByCategory = async (category: string | null) => {
  const response = await fetch(`${BASE_URL}/filter.php?c=${category}`);

  if (!response.ok) throw new Error("Network response failed");

  const data = await response.json();
  const meals: Meal[] = data || [];

  return meals;
};

// Merges the per-id lookups into one result; kept at module level so the
// combined value stays referentially stable between renders
const combineRecipeResults = (results: UseQueryResult<Meal>[]) => ({
  recipes: results
    .map((result) => result.data)
    .filter((meal): meal is Meal => Boolean(meal?.idMeal)),
  isLoading: results.some((result) => result.isLoading),
  error: results.find((result) => result.error)?.error ?? null,
});

export function useRecipesByIdList(ids: string[]) {
  return useQueries({
    queries: ids.map((id) => getRecipeByIdQueryOption(id)),
    combine: combineRecipeResults,
  });
}

export function getRecipesQueryOption(
  searchTerm: string | null,
  filter: string | null,
) {
  return queryOptions({
    queryKey: ["getRecipeBySearchKey", searchTerm, filter],
    queryFn: () => getRecipesBySearch(searchTerm, filter),
    staleTime: 1000 * 60 * 5, // Keep fresh for 5 minutes
  });
}

export function getRecipesByCategoryQueryOption(category: string | null) {
  return queryOptions({
    queryKey: ["getRecipeByCategoriesKey", category],
    queryFn: () => getRecipesByCategory(category),
    staleTime: 1000 * 60 * 5, // Keep fresh for 5 minutes
  });
}

export function getAllCategoriesQueryOption() {
  return queryOptions({
    queryKey: ["categoriesKey"],
    queryFn: () => getAllCategories(),
    staleTime: 1000 * 60 * 5, // Keep fresh for 5 minutes
  });
}

export function getRecipeByIdQueryOption(id: string) {
  return queryOptions({
    queryKey: ["getRecipeByIdKey", id],
    queryFn: () => getRecipeById(id),
    staleTime: 1000 * 60 * 5, // Keep fresh for 5 minutes
  });
}

export function getRandomRecipeQueryOption() {
  return queryOptions({
    queryKey: ["getRandomRecipeKey"],
    queryFn: async () => {
      const data = await getRandomRecipe();
      return data;
    },
    staleTime: 1000 * 60 * 5, // Keep fresh for 5 minutes
  });
}
