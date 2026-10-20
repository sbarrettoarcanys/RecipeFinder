import { queryOptions } from "@tanstack/react-query";
import { supabase } from "../Hooks/SupabaseClient.js";

export const getMealRatingsByMealId = async (mealId) => {
  const { data, error } = await supabase
    .from("meal_ratings")
    .select("rating")
    .eq("meal_id", mealId);

  if (error) throw error;
  return data;
};

export const getMealRatingsByUserId = async (userId) => {
  const { data, error } = await supabase
    .from("meal_ratings")
    .select("rating")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
};

export const getMealRatingsByRatingId = async (ratingId) => {
  const { data, error } = await supabase
    .from("meal_ratings")
    .select("rating")
    .eq("id", ratingId);

  if (error) throw error;
  return data;
};

export const getMealRatingAverageByMealId = async (mealId) => {
  const { data, error } = await supabase
    .from("meal_ratings")
    .select("rating")
    .eq("meal_id", mealId)
    .avg("rating");

  if (error) throw error;
  return data;
};

export const getMealRatingByUserId = async (ratingId, userId) => {
  const { data, error } = await supabase
    .from("meal_ratings")
    .select("rating")
    .eq("id", ratingId)
    .eq("user_id", userId);

  if (error) throw error;
  return data;
};

export const insertRating = async (userId, mealId, rating) => {
  const { error } = await supabase
    .from("meal_ratings")
    .insert({ user_id: userId, meal_id: mealId, rating: rating });

  if (error) throw error;
};

export const updateRating = async (ratingId, rating) => {
  const { error } = await supabase
    .from("meal_ratings")
    .update({ rating: rating })
    .eq("id", ratingId);

  if (error) throw error;
};

export const getMealRatingsByMealIdQueryOption = (mealId) =>
  queryOptions({
    queryKey: ["mealRatingsByMealId", mealId],
    queryFn: () => getMealRatingsByMealId(mealId),
    enabled: Boolean(mealId),
  });

export const getMealRatingsByUserIdQueryOption = (userId) =>
  queryOptions({
    queryKey: ["mealRatingsByUserId", userId],
    queryFn: () => getMealRatingsByUserId(userId),
    enabled: Boolean(userId),
  });

export const getMealRatingsByRatingIdQueryOption = (ratingId) =>
  queryOptions({
    queryKey: ["mealRatingsByRatingId", ratingId],
    queryFn: () => getMealRatingsByRatingId(ratingId),
    enabled: Boolean(ratingId),
  });

export const getMealRatingAverageByMealIdQueryOption = (mealId) =>
  queryOptions({
    queryKey: ["mealRatingAverageByMealId", mealId],
    queryFn: () => getMealRatingAverageByMealId(mealId),
    enabled: Boolean(mealId),
  });
