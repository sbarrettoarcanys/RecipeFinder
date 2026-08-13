// Free public sandbox key is '1'
const API_KEY = "1";
const BASE_URL = `https://themealdb.com/api/json/v1/${API_KEY}`;

export const getRecipesBySearch = async (searchTerm, filter) => {
  filter = filter || "s"; // Default to search by name if no filter is provided
  const endpoint = filter === "s" ? "search.php" : "filter.php"; // Determine endpoint based on filter

  const response = await fetch(
    `${BASE_URL}/${endpoint}?${filter}=${searchTerm}`,
  );

  if (!response.ok) throw new Error("Network response failed");

  const data = await response.json();

  return data;
};

export const getRecipeById = async (id) => {
  const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);

  if (!response.ok) throw new Error("Network response failed");

  const data = await response.json();

  return data;
};

export const getRandomRecipe = async () => {
  const response = await fetch(`${BASE_URL}/random.php`);

  if (!response.ok) throw new Error("Network response failed");

  const data = await response.json();

  return data;
};
