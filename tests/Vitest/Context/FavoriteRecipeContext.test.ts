import { expect, it, describe, beforeEach } from "vitest";
import { createElement, type ReactNode } from "react";
import { renderHook, act } from "@testing-library/react";
import {
  FavoriteRecipeProvider,
  useFavoriteRecipeContext,
} from "../../../src/Context/FavoriteRecipeContext.jsx";

type Meal = { idMeal: string; strMeal: string; strCategory?: string | null };

type FavoriteRecipeContextValue = {
  favoriteRecipes: Meal[];
  addToFavoriteRecipes: (recipe: Meal) => void;

  removeFromFavoriteRecipes: (recipeId: string) => null;
  isFavoriteRecipe: (recipeId: string) => false;
  searchFavoriteRecipe(
    searchTerm: string | null,
    category: string | null,
  ): Meal[];
};

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(FavoriteRecipeProvider, null, children);

describe("FavoriteRecipeContext", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts with an empty favoriteRecipes list", () => {
    const { result } = renderHook(
      () => useFavoriteRecipeContext() as unknown as FavoriteRecipeContextValue,
      { wrapper },
    );

    expect(result.current.favoriteRecipes).toEqual([]);
  });

  it("is not empty after adding a recipe", () => {
    const { result } = renderHook(
      () => useFavoriteRecipeContext() as unknown as FavoriteRecipeContextValue,
      { wrapper },
    );

    const mockMeal: Meal = {
      idMeal: "52772",
      strMeal: "Teriyaki Chicken Casserole",
    };

    expect(result.current.favoriteRecipes).toEqual([]);

    act(() => {
      result.current.addToFavoriteRecipes(mockMeal);
    });

    expect(result.current.favoriteRecipes).not.toEqual([]);
    expect(result.current.favoriteRecipes).toContainEqual(mockMeal);
  });

  it("is empty after removing a recipe", () => {
    const { result } = renderHook(
      () => useFavoriteRecipeContext() as unknown as FavoriteRecipeContextValue,
      { wrapper },
    );

    const mockMeal: Meal = {
      idMeal: "52772",
      strMeal: "Teriyaki Chicken Casserole",
    };

    expect(result.current.favoriteRecipes).toEqual([]);

    act(() => {
      result.current.addToFavoriteRecipes(mockMeal);
    });

    expect(result.current.favoriteRecipes).not.toEqual([]);
    expect(result.current.favoriteRecipes).toContainEqual(mockMeal);

    act(() => {
      result.current.removeFromFavoriteRecipes("52772");
    });

    expect(result.current.favoriteRecipes).toEqual([]);
  });

  it("is not empty after removing a different recipe Id", () => {
    const { result } = renderHook(
      () => useFavoriteRecipeContext() as unknown as FavoriteRecipeContextValue,
      { wrapper },
    );

    const mockMeal: Meal = {
      idMeal: "52772",
      strMeal: "Teriyaki Chicken Casserole",
    };

    expect(result.current.favoriteRecipes).toEqual([]);

    act(() => {
      result.current.addToFavoriteRecipes(mockMeal);
    });

    expect(result.current.favoriteRecipes).not.toEqual([]);
    expect(result.current.favoriteRecipes).toContainEqual(mockMeal);

    act(() => {
      result.current.removeFromFavoriteRecipes("52773");
    });

    expect(result.current.favoriteRecipes).not.toEqual([]);
    expect(result.current.favoriteRecipes).toContainEqual(mockMeal);
  });

  it("returns isFavoriteRecipe true when in FavoriteRecipes", () => {
    const { result } = renderHook(
      () => useFavoriteRecipeContext() as unknown as FavoriteRecipeContextValue,
      { wrapper },
    );

    const mockMeal: Meal = {
      idMeal: "52772",
      strMeal: "Teriyaki Chicken Casserole",
    };

    expect(result.current.favoriteRecipes).toEqual([]);

    act(() => {
      result.current.addToFavoriteRecipes(mockMeal);
    });

    expect(result.current.favoriteRecipes).not.toEqual([]);
    expect(result.current.favoriteRecipes).toContainEqual(mockMeal);

    let isFavorite: boolean = false;
    act(() => {
      isFavorite = result.current.isFavoriteRecipe("52772");
    });

    expect(isFavorite).toEqual(true);
  });

  it("returns isFavoriteRecipe false when not in FavoriteRecipes", () => {
    const { result } = renderHook(
      () => useFavoriteRecipeContext() as unknown as FavoriteRecipeContextValue,
      { wrapper },
    );

    const mockMeal: Meal = {
      idMeal: "52772",
      strMeal: "Teriyaki Chicken Casserole",
    };

    expect(result.current.favoriteRecipes).toEqual([]);

    act(() => {
      result.current.addToFavoriteRecipes(mockMeal);
    });

    expect(result.current.favoriteRecipes).not.toEqual([]);
    expect(result.current.favoriteRecipes).toContainEqual(mockMeal);

    let isFavorite: boolean = false;
    act(() => {
      isFavorite = result.current.isFavoriteRecipe("52771");
    });

    expect(isFavorite).toEqual(false);
  });

  it("returns empty when search term is not in FavoriteRecipes", () => {
    const { result } = renderHook(
      () => useFavoriteRecipeContext() as unknown as FavoriteRecipeContextValue,
      { wrapper },
    );

    const mockMeal: Meal = {
      idMeal: "52772",
      strMeal: "Teriyaki Chicken Casserole",
    };

    expect(result.current.favoriteRecipes).toEqual([]);

    act(() => {
      result.current.addToFavoriteRecipes(mockMeal);
    });

    expect(result.current.favoriteRecipes).not.toEqual([]);
    expect(result.current.favoriteRecipes).toContainEqual(mockMeal);

    let recipes: Meal[] = [];
    act(() => {
      recipes = result.current.searchFavoriteRecipe("beef", "chicken");
    });

    expect(recipes).toEqual([]);
  });

  it("returns data when search term is in FavoriteRecipes", () => {
    const { result } = renderHook(
      () => useFavoriteRecipeContext() as unknown as FavoriteRecipeContextValue,
      { wrapper },
    );

    const mockMeals: Meal[] = [
      {
        idMeal: "52772",
        strMeal: "Teriyaki Chicken Casserole",
        strCategory: "Chicken",
      },

      {
        idMeal: "53443",
        strMeal: "Satee",
        strCategory: "Beef",
      },
    ];

    expect(result.current.favoriteRecipes).toEqual([]);

    act(() => {
      mockMeals.forEach((mockMeal) =>
        result.current.addToFavoriteRecipes(mockMeal),
      );
    });

    expect(result.current.favoriteRecipes).not.toEqual([]);
    expect(result.current.favoriteRecipes).toEqual(mockMeals);

    let recipes: Meal[] = [];
    act(() => {
      recipes = result.current.searchFavoriteRecipe("satee", null);
    });

    let resultMeal: Meal = {
      idMeal: "53443",
      strMeal: "Satee",
      strCategory: "Beef",
    };

    expect(recipes).not.toEqual([]);
    expect(recipes[0]).toEqual(resultMeal);
  });
});
