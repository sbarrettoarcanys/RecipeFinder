import { supabase } from "../Hooks/SupabaseClient.js";
import { queryOptions } from "@tanstack/react-query";

//Profiles
// Creates the profile, or overwrites display_name if it already exists.
export const upsertProfile = async (uid, displayName) => {
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: uid, display_name: displayName }, { onConflict: "id" });

  if (error) throw error;
};

// Creates the profile only if missing; never overwrites an existing display_name.
export const ensureProfile = async (uid, displayName) => {
  const { error } = await supabase
    .from("profiles")
    .upsert(
      { id: uid, display_name: displayName },
      { onConflict: "id", ignoreDuplicates: true },
    );

  if (error) throw error;
};

export const getProfileByUserId = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("Id", userId)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
};
export const getProfileByUserIdQueryOption = (userId) =>
  queryOptions({
    queryKey: ["profile", userId],
    queryFn: () => getProfileByUserId(userId),
    enabled: Boolean(userId),
  });
