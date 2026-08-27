import { queryOptions, useQuery } from "@tanstack/react-query";

// Free public sandbox key is '1'
const API_KEY = "1";
const BASE_URL = `https://themealdb.com/api/json/v1/${API_KEY}`;

const getRecipesBySearch = async (searchTerm, filter) => {
  filter = filter || "s"; // Default to search by name if no filter is provided
  const endpoint = filter === "s" ? "search.php" : "filter.php"; // Determine endpoint based on filter

  const response = await fetch(
    `${BASE_URL}/${endpoint}?${filter}=${searchTerm}`,
  );

  if (!response.ok) throw new Error("Network response failed");

  const data = await response.json();

  return data;
};

const getRecipeById = async (id) => {
  const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);

  if (!response.ok) throw new Error("Network response failed");

  const data = await response.json();

  return data;
};

const getRandomRecipe = async () => {
  const response = await fetch(`${BASE_URL}/random.php`);

  if (!response.ok) throw new Error("Network response failed");

  const data = await response.json();

  return data;
};

const getAllCategories = async () => {
  const response = await fetch(`${BASE_URL}/categories.php`);

  if (!response.ok) throw new Error("Network response failed");

  const data = await response.json();

  return data;
};

const getRecipesByCategory = async (category) => {
  const response = await fetch(`${BASE_URL}/filter.php?c=${category}`);

  if (!response.ok) throw new Error("Network response failed");

  const data = await response.json();

  return data;
};

export function getRecipesQueryOption(searchTerm, filter) {
  return queryOptions({
    queryKey: ["getRecipeBySearchKey", searchTerm, filter],
    queryFn: () => getRecipesBySearch(searchTerm, filter),
  });
}

export function getRecipesByCategoryQueryOption(category) {
  return queryOptions({
    queryKey: ["getRecipeByCategoriesKey", category],
    queryFn: () => getRecipesByCategory(category),
  });
}

export function getAllCategoriesQueryOption() {
  return queryOptions({
    queryKey: ["categoriesKey"],
    queryFn: () => getAllCategories(),
  });
}

export function getRecipeByIdQueryOption(id) {
  return queryOptions({
    queryKey: ["getRecipeByIdKey", id],
    queryFn: () => getRecipeById(id),
  });
}

export function getRandomRecipeQueryOption() {
  return queryOptions({
    queryKey: ["getRandomRecipeKey"],
    queryFn: async () => {
      const data = await getRandomRecipe();
      return data;
    },
  });
}
