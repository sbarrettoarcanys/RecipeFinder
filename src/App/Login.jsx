import { useState } from "react";
import "@/Styles/Login.css";

import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { auth } from "../../firebase-config.js";
import { logError } from "../Utils/ErrorLogger.js";
import { useFavoriteRecipeContext } from "../Context/FavoriteRecipeContext.jsx";
import { migrateFavoritesToSupabase } from "../DataAccess/FavoritesRepository.js";
import { ensureProfile } from "../DataAccess/ProfileRepository.js";

const authErrorMessages = {
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/invalid-credential": "Incorrect username or password.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Check your connection.",
};

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { favoriteRecipes, clearFavoriteRecipes } = useFavoriteRecipeContext();
  const queryClient = useQueryClient();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, username.trim(), password);

      if (favoriteRecipes.length > 0) {
        try {
          //favorites reference profiles, so the profile row must exist first
          await ensureProfile(
            auth.currentUser.uid,
            auth.currentUser.displayName,
          );
          await migrateFavoritesToSupabase(
            auth.currentUser.uid,
            favoriteRecipes,
          );

          clearFavoriteRecipes();
          //refetch so the migrated rows aren't missed by an earlier fetch
          queryClient.invalidateQueries({ queryKey: ["favoriteIds"] });
        } catch (err) {
          logError(`${err.code}: ${err.message}`, {
            route: "Login",
            Action: "migrateFavoritesToSupabase",
          });
        }
      }

      navigate("/");
    } catch (err) {
      logError(`${err.code}: ${err.message}`, {
        route: "Login",
        Action: "signInWithEmailAndPassword",
      });
      setError(
        authErrorMessages[err.code] || "Unable to log in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <div className="titles">
          <p className="eyebrow">Welcome back</p>
          <h1>Log in</h1>
        </div>

        <div className="login-field">
          <label htmlFor="login-username">Username</label>
          <div className="search-bar">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
            </svg>
            <input
              type="text"
              id="login-username"
              placeholder="you@example.com"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="login-field">
          <label htmlFor="login-password">Password</label>
          <div className="search-bar">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <input
              type={showPassword ? "text" : "password"}
              id="login-password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                <circle cx="12" cy="12" r="3" />
                {showPassword && <path d="M3 3l18 18" />}
              </svg>
            </button>
          </div>
        </div>

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="btn-primary login-submit"
          disabled={loading || !username || !password}
          aria-busy={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="login-footer">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="link-text">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
