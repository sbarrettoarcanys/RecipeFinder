import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./App/HomePage.jsx";
import Favorites from "./App/Favorites.jsx";
import MealDetail from "./App/MealDetail.jsx";
import Category from "./App/Category.jsx";

import Sidebar from "./App/Sidebar.jsx";
import RandomMeal from "./App/Random.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Sidebar />
    <main className="main">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/meal-detail/:id" element={<MealDetail />} />
        <Route path="/category" element={<Category />} />
        <Route path="/random" element={<RandomMeal />} />
      </Routes>
    </main>
  </BrowserRouter>,
);
