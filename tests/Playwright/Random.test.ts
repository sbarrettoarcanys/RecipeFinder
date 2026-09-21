import { test, expect } from "@playwright/test";
test.describe("Random Meal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");

    // Wait for the recipe cards to be visible
    await page.waitForSelector(".recipe-card");
  });

  test("Should redirect to Random page when clicking Surprise Me button", async ({
    page,
  }) => {
    // Wait for the 'Surprise Me' link to be visible
    await page.waitForSelector("#surprise-me");

    // Click on the 'Surprise Me' link
    await page.click("#surprise-me");
    // Check if the URL contains '/random'
    await expect(page).toHaveURL(/\/random/);
  });

  test("Should redirect to Random page when clicking Random icon in navbar", async ({
    page,
  }) => {
    // Wait for the random in navbar to be visible
    await page.waitForSelector("#randomNav");

    // Click on the random icon in navbar
    await page.click("#randomNav");

    // Check if the URL contains '/random'
    await expect(page).toHaveURL(/\/random/);
  });

  test("should display 'Error: No recipe found.' when the random recipe API returns no data", async ({
    page,
  }) => {
    // Intercept the random recipe API call and simulate a response with no meal data
    await page.route("**/random.php", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ meals: null }),
      });
    });

    // Navigate directly to the random page
    await page.goto("http://localhost:5173/random");

    // Wait for the error message to be visible
    await page.waitForSelector(".meal-detail-error");

    // Check if the error message is displayed
    await expect(page.locator(".meal-detail-error")).toHaveText(
      "Error: No recipe found.",
    );
  });

  test("should save a recipe to favorites when the favorite button is clicked", async ({
    page,
  }) => {
    // Wait for the random in navbar to be visible
    await page.waitForSelector("#randomNav");

    // Click on the random icon in navbar
    await page.click("#randomNav");

    // Wait for the meal details to load
    await page.waitForSelector(".meal-detail-favorite");

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
    // Wait for the random in navbar to be visible
    await page.waitForSelector("#randomNav");

    // Click on the random icon in navbar
    await page.click("#randomNav");

    // Wait for the meal details to load
    await page.waitForSelector(".meal-detail-favorite");

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

  test("Back button return to previous page with URL", async ({ page }) => {
    // Select the "Ingredient" filter
    await page.waitForSelector("#ingredient");
    await page.click("#ingredient");

    // Set search bar to chicken
    await page.waitForSelector("#search-input");
    await page.fill("#search-input", "chicken");

    // Wait for the recipe cards to be visible
    // await page.waitForSelector(".recipe-card");
    await page.waitForURL(/search=chicken/);

    // Wait for the random in navbar to be visible
    await page.waitForSelector("#randomNav");

    // Click on the random icon in navbar
    await page.click("#randomNav");

    //wait for back button to be visible
    await page.waitForSelector("#backBtn");

    //click back button
    await page.click("#backBtn");

    // Wait for the recipe cards to be visible
    await page.waitForSelector(".recipe-card");

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
});
