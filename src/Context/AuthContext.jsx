import { createContext, useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { ensureProfile } from "../DataAccess/ProfileRepository.js";
import { useUser } from "../Hooks/useUser.js";
import { logError } from "../Utils/ErrorLogger.js";

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components -- context hook lives alongside its provider
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Tracks the Firebase session (login, logout, session restore)
  const { user, loading } = useUser();

  useEffect(() => {
    // Make sure every signed-in user has a Supabase profile row
    if (user) {
      ensureProfile(user.uid, user.displayName).catch((err) =>
        logError(`${err.code}: ${err.message}`, {
          route: "AuthProvider",
          Action: "ensureProfile",
        }),
      );
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Show a loading spinner or screen while Firebase verifies the session
  if (loading) {
    return <div>Loading session...</div>;
  }

  // If no user is logged in, redirect to login page
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
