import { useState, useEffect } from "react";
import "@/Styles/HomePage.css";
import { debounceInput } from "../Hooks/Debounce.js";
import { getRecipesBySearch } from "../Hooks/ApiCalls.js";

export default function Favorites() {
  return (
    <>
      <h1>Favorites</h1>
    </>
  );
}
