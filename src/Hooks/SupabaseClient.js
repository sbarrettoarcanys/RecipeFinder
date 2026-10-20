import { createClient } from "@supabase/supabase-js";
import { auth } from "../../firebase-config.js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Supabase Third-Party Auth: every request carries the Firebase ID token,
// so RLS policies can read the Firebase UID via auth.jwt()->>'sub'.
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  db: { schema: "public" },
  accessToken: async () => {
    return (
      (await auth.currentUser?.getIdToken(/* forceRefresh */ false)) ?? null
    );
  },
});
