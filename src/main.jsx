import { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
// import HomePage from "./App/HomePage.jsx";
// import Favorites from "./App/Favorites.jsx";
// import MealDetail from "./App/MealDetail.jsx";
// import Category from "./App/Category.jsx";
// import RandomMeal from "./App/Random.jsx";

import Sidebar from "./App/Sidebar.jsx";
import { FavoriteRecipeProvider } from "./Context/FavoriteRecipeContext.jsx";
import { AuthProvider, ProtectedRoute } from "./Context/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const HomePage = lazy(() => import("./App/HomePage"));
const Favorites = lazy(() => import("./App/Favorites"));
const MealDetail = lazy(() => import("./App/MealDetail"));
const Category = lazy(() => import("./App/Category"));
const RandomMeal = lazy(() => import("./App/Random"));
const Login = lazy(() => import("./App/Login"));
const Register = lazy(() => import("./App/Register"));
const UserProfile = lazy(() => import("./App/UserProfile"));

const queryClient = new QueryClient();

// Expose queryClient to the browser window for Playwright
if (import.meta.env.DEV || window.isPlaywright) {
  window.queryClient = queryClient;
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoriteRecipeProvider>
          <PageLayout />
        </FavoriteRecipeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>,
);

const routesWithoutSidebar = ["/login", "/register"];

function PageLayout() {
  const { pathname } = useLocation();
  const showSidebar = !routesWithoutSidebar.includes(pathname);

  return (
    <>
      {/* <StrictMode> */}
      <ErrorBoundary fallback={<div>Failed to load</div>}>
        {showSidebar && <Sidebar />}
        <Suspense fallback={<div>Loading...</div>}>
          <main className="main">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/meal-detail/:id" element={<MealDetail />} />
              <Route path="/category" element={<Category />} />
              <Route path="/random" element={<RandomMeal />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<UserProfile />} />
              </Route>
            </Routes>
          </main>
        </Suspense>
      </ErrorBoundary>
      {/* </StrictMode> */}
    </>
  );
}
