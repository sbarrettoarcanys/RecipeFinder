// Free public sandbox key is '1'
const API_KEY = "1";
const BASE_URL = `https://themealdb.com/api/json/v1/${API_KEY}`;

export const getRecipesBySearch = async (searchTerm) => {
  const response = await fetch(`${BASE_URL}/search.php?s=${searchTerm}`);

  if (!response.ok) throw new Error("Network response failed");

  const data = await response.json();

  return data;
};
