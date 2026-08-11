import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./index.css";
import App from "./App/App.jsx";
import HomePage from "./App/HomePage.jsx";
import Sidebar from "./App/Sidebar.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Sidebar />
    <main className="main">
      <HomePage />
    </main>
  </StrictMode>,
);
