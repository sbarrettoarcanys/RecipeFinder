import { queryOptions } from "@tanstack/react-query";
import { supabase } from "../Hooks/SupabaseClient.js";

export const getMealCommentsByMealId = async (mealId) => {
  const { data, error } = await supabase
    .from("meal_comments")
    .select("comment")
    .eq("meal_id", mealId);

  if (error) throw error;
  return data;
};

export const getMealCommentsByUserId = async (userId) => {
  const { data, error } = await supabase
    .from("meal_comments")
    .select("comment")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
};

export const getMealCommentsByCommentId = async (commentId) => {
  const { data, error } = await supabase
    .from("meal_comments")
    .select("comment")
    .eq("id", commentId);

  if (error) throw error;
  return data;
};

export const insertComment = async (userId, mealId, comment) => {
  const { error } = await supabase
    .from("meal_comments")
    .insert({ user_id: userId, meal_id: mealId, comment: comment });

  if (error) throw error;
};

export const updateComment = async (commentId, comment) => {
  const { error } = await supabase
    .from("meal_comments")
    .update({ comment: comment })
    .eq("id", commentId);

  if (error) throw error;
};

export const getMealCommentsByMealIdQueryOption = (mealId) =>
  queryOptions({
    queryKey: ["mealCommentsByMealId", mealId],
    queryFn: () => getMealCommentsByMealId(mealId),
    enabled: Boolean(mealId),
  });

export const getMealCommentsByUserIdQueryOption = (userId) =>
  queryOptions({
    queryKey: ["mealCommentsByUserId", userId],
    queryFn: () => getMealCommentsByUserId(userId),
    enabled: Boolean(userId),
  });

export const getMealCommentsByCommentIdQueryOption = (commentId) =>
  queryOptions({
    queryKey: ["mealCommentsByCommentId", commentId],
    queryFn: () => getMealCommentsByCommentId(commentId),
    enabled: Boolean(commentId),
  });
