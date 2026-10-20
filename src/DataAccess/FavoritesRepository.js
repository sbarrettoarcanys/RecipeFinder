import { queryOptions } from "@tanstack/react-query";
import { supabase } from "../Hooks/SupabaseClient.js";
export const migrateFavoritesToSupabase = async (userId, favorites) => {
  if (!userId || !favorites || favorites.length === 0) return;
  const newFavorites = favorites.map((favorite) => ({
    user_id: userId,
    meal_id: favorite.idMeal,
    is_active: true,
  }));

  const { error } = await supabase.from("favorites").insert(newFavorites, {
    onConflict: "user_id,meal_id",
    ignoreDuplicates: true,
  });

  if (error) throw error;
};

export const getFavoritesByUserId = async (userId) => {
  const { data, error } = await supabase
    .from("favorites")
    .select("meal_id")
    .eq("user_id", userId)
    .eq("is_active", true);

  if (error) throw error;
  return data.map((item) => item.meal_id);
};

// Active favorite meal ids for a user; disabled until a user is signed in
export const getFavoriteIdsQueryOption = (userId) =>
  queryOptions({
    queryKey: ["favoriteIds", userId],
    queryFn: () => getFavoritesByUserId(userId),
    enabled: Boolean(userId),
  });

export const updateFavoriteStatus = async (userId, mealId, isActive) => {
  const { error } = await supabase
    .from("favorites")
    .upsert(
      { user_id: userId, meal_id: mealId, is_active: isActive },
      { onConflict: "user_id,meal_id" },
    );

  if (error) throw error;
};
