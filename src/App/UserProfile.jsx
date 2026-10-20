import { useQuery } from "@tanstack/react-query";
import { logError } from "../Utils/ErrorLogger.js";
import { useAuth } from "../Context/AuthContext.jsx";

import { getProfileByUserIdQueryOption } from "../DataAccess/ProfileRepository.js";
export function UserProfile() {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.uid;

  const {
    data: profile,
    isPending: profileLoading,
    error: profileError,
  } = useQuery({
    ...getProfileByUserIdQueryOption(userId),
    enabled: Boolean(userId),
  });

  if (authLoading || profileLoading) {
    return <p>Loading profile...</p>;
  }

  if (profileError) {
    logError(profileError, {
      route: "UserProfile",
      Action: "getProfileByUserIdQueryOption",
    });
    return <p className="error">{profileError}</p>;
  }

  if (!profile) {
    return (
      <div className="meal-detail-error" role="alert">
        Error: No profile found.
      </div>
    );
  }
}
