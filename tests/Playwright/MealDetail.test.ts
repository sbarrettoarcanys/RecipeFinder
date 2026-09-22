import { test, expect } from "@playwright/test";
test.describe("Meal Detail", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");

    // Wait for the recipe cards to be visible
    const recipeCardsLocator = await page.locator(".recipe-card");
    await expect(recipeCardsLocator.first()).toBeVisible();
  });

  test("should display meal details when a recipe card is clicked", async ({
    page,
  }) => {
    // Click on the first recipe card
    const recipeCard = await page.locator(".recipe-card").first();
    await recipeCard.click();

    //check if the page contains the meal details
    await expect(page.locator(".meal-detail")).toBeVisible();

    await expect(page.locator(".meal-detail-image")).toBeVisible();

    await expect(page.locator(".meal-detail-body")).toBeVisible();
  });

  test("should display error message when meal details are not found", async ({
    page,
  }) => {
    //navigate to a non-existing meal detail page
    await page.goto("http://localhost:5173/meal-detail/533229");

    // Wait for the meal details to load
    await page.locator(".meal-detail-error");

    // Check if the error message is displayed
    await expect(page.locator(".meal-detail-error")).toHaveText(
      "Error: No recipe found.",
    );
  });

  test("Back button return to previous page with URL", async ({ page }) => {
    // Select the "Ingredient" filter
    const ingredientBtn = await page.locator("#ingredient");
    await ingredientBtn.click();

    // Set search bar to chicken
    const searchInput = await page.locator("#search-input");
    await searchInput.fill("chicken");

    // Wait for the recipe cards to be visible
    await page.waitForURL(/search=chicken/);

    // Click on the first recipe card
    const recipeCard = await page.locator(".recipe-card").first();
    await expect(recipeCard).toBeVisible();
    await recipeCard.click();

    //wait for back button to be visible
    const backBtn = await page.locator("#backBtn");

    //click back button
    await backBtn.click();

    // Wait for the recipe cards to be visible

    const newRecipeCardsLocator = await page.locator(".recipe-card");
    await expect(newRecipeCardsLocator.first()).toBeVisible();

    //check if the URL contains the filters
    await expect(page).toHaveURL((url) => {
      const params = url.searchParams;
      return (
        params.has("search") &&
        params.has("filter") &&
        params.get("search") === "chicken" &&
        params.get("filter") === "i"
      );
    });
  });

  test("should save a recipe to favorites when the favorite button is clicked", async ({
    page,
  }) => {
    // Click on the first recipe card
    const recipeCard = await page.locator(".recipe-card").first();
    await recipeCard.click();

    // Wait for the meal details to load
    const favoriteBtn = await page.locator(".meal-detail-favorite");
    await expect(favoriteBtn).toBeVisible();

    // Click on the favorite button of the first recipe card
    await page.getByRole("button", { name: "Favorite" }).click();

    // Check if the recipe is saved in localStorage
    const favorites = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem("favoriteRecipes") || "[]");
    });
    await expect(favorites).toHaveLength(1);
  });

  test("should remove favorite recipe when clicking favorite recipe", async ({
    page,
  }) => {
    // Click on the first recipe card
    const recipeCard = await page.locator(".recipe-card").first();
    await recipeCard.click();

    // Wait for the meal details to load
    const favoriteBtn = await page.locator(".meal-detail-favorite");
    await expect(favoriteBtn).toBeVisible();

    // Click on the favorite button of the first recipe card
    await page.getByRole("button", { name: "Favorite" }).click();

    // Check if the recipe is saved in localStorage
    const favorites = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem("favoriteRecipes") || "[]");
    });
    await expect(favorites).toHaveLength(1);

    await page.getByRole("button", { name: "Favorite" }).click();

    const newFavorites = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem("favoriteRecipes") || "[]");
    });
    await expect(newFavorites).toHaveLength(0);
  });
});
