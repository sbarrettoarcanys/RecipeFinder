import { test, expect } from "@playwright/test";
test.describe("Category", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/category?filter=Beef");

    // Wait for the recipe cards to be visible
    await expect(page.locator(".recipe-card").first()).toBeVisible();
  });

  test("should redirect to meal detail page when a recipe is clicked", async ({
    page,
  }) => {
    // Wait for the recipe cards to be visible
    const recipeCard = await page.locator(".recipe-card").first();

    // Click on the first recipe card
    await recipeCard.click();

    // Check if the URL contains '/meal-detail/'
    await expect(page).toHaveURL(/\/meal-detail\//);
  });

  test("should save a recipe to favorites when the favorite button is clicked", async ({
    page,
  }) => {
    // Wait for the recipe cards to be visible
    await page.locator(".recipe-card");

    // Click on the favorite button of the first recipe card
    await page
      .getByRole("link", { name: "Algerian Kefta (Meatballs)" })
      .getByRole("button", { name: "Favorite" })
      .click();

    // Check if the recipe is saved in localStorage
    const favorites = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem("favoriteRecipes") || "[]");
    });

    await expect(favorites).toHaveLength(1);
    await expect(favorites[0].strMeal).toEqual("Algerian Kefta (Meatballs)");
  });

  test("should remove favorite recipe when clicking favorite recipe", async ({
    page,
  }) => {
    // Wait for the recipe cards to be visible
    await page.locator(".recipe-card");

    // Click on the favorite button of the first recipe card
    await page
      .getByRole("link", { name: "Algerian Kefta (Meatballs)" })
      .getByRole("button", { name: "Favorite" })
      .click();

    // Check if the recipe is saved in localStorage
    const favorites = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem("favoriteRecipes") || "[]");
    });
    await expect(favorites).toHaveLength(1);

    await page
      .getByRole("link", { name: "Algerian Kefta (Meatballs)" })
      .getByRole("button", { name: "Favorite" })
      .click();

    const newFavorites = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem("favoriteRecipes") || "[]");
    });
    await expect(newFavorites).toHaveLength(0);
  });

  test("should display 'Jamaican Curry Goat' and 'Mbuzi Choma (Roasted Goat)' when the 'Goat' filter is clicked", async ({
    page,
  }) => {
    // Wait for the "Goat" category pill to be visible and click it
    const goatBtn = await page.locator("#Goat");
    await goatBtn.click();

    // Wait for the recipe cards to be visible
    await page.locator(".recipe-card").first();

    // Check that both goat recipes are displayed
    await expect(
      page.getByRole("heading", { name: "Jamaican Curry Goat" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Mbuzi Choma (Roasted Goat)" }),
    ).toBeVisible();
  });

  test("should display 'Jamaican Curry Goat' when the 'Goat' filter is clicked and 'Jamaican' is typed in search bar", async ({
    page,
  }) => {
    // Wait for the "Goat" category pill to be visible and click it
    const goatBtn = await page.locator("#Goat");
    await goatBtn.click();

    // Wait for the recipe cards to be visible
    await page.locator(".recipe-card");

    // Check that both goat recipes are displayed
    await expect(
      page.getByRole("heading", { name: "Jamaican Curry Goat" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Mbuzi Choma (Roasted Goat)" }),
    ).toBeVisible();

    // Set search bar to chicken
    const searchInput = page.locator("#search-input");
    await searchInput.fill("jamaican");

    //check if only Jamaican Curry is left
    await expect(
      page.getByRole("heading", { name: "Jamaican Curry Goat" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Mbuzi Choma (Roasted Goat)" }),
    ).not.toBeVisible();
  });
});
