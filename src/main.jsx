import { StrictMode, Suspense, lazy, createContext, useContext } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
// import HomePage from "./App/HomePage.jsx";
// import Favorites from "./App/Favorites.jsx";
// import MealDetail from "./App/MealDetail.jsx";
// import Category from "./App/Category.jsx";
// import RandomMeal from "./App/Random.jsx";

import Sidebar from "./App/Sidebar.jsx";
import { FavoriteRecipeProvider } from "./Context/FavoriteRecipeContext.jsx";

const HomePage = lazy(() => import("./App/HomePage"));
const Favorites = lazy(() => import("./App/Favorites"));
const MealDetail = lazy(() => import("./App/MealDetail"));
const Category = lazy(() => import("./App/Category"));
const RandomMeal = lazy(() => import("./App/Random"));

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* add context provider here */}
    <FavoriteRecipeProvider>
      <PageLayout />
    </FavoriteRecipeProvider>

    {/* <PageLayout /> */}
  </BrowserRouter>,
);

function PageLayout() {
  return (
    <>
      <Sidebar />
      <Suspense fallback={<div>Loading...</div>}>
        <main className="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/meal-detail/:id" element={<MealDetail />} />
            <Route path="/category" element={<Category />} />
            <Route path="/random" element={<RandomMeal />} />
          </Routes>
        </main>
      </Suspense>
    </>
  );
}
