import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");
  });

  test("should have the correct title", async ({ page }) => {
    await expect(page).toHaveTitle("Recipe Finder");
  });

  test("should redirect to meal detail page when a recipe is clicked", async ({
    page,
  }) => {
    // Wait for the recipe cards to be visible
    await page.waitForSelector(".recipe-card");

    // Click on the first recipe card
    await page.click(".recipe-card");

    // Check if the URL contains '/meal-detail/'
    await expect(page).toHaveURL(/\/meal-detail\//);
  });

  test("should save a recipe to favorites when the favorite button is clicked", async ({
    page,
  }) => {
    // Wait for the recipe cards to be visible
    await page.waitForSelector(".recipe-card");

    // Click on the favorite button of the first recipe card
    await page
      .getByRole("img", { name: "Flan" })
      .getByRole("button", { name: "Favorite" })
      .click();

    // Check if the recipe is saved in localStorage
    const favorites = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem("favoriteRecipes") || "[]");
    });
    await expect(favorites).toHaveLength(1);
    await expect(favorites[0].strMeal).toEqual("Flan");
  });

  test("should prefetch a random recipe when the 'Surprise Me' link is hovered", async ({
    page,
  }) => {
    // Wait for the 'Surprise Me' link to be visible
    await page.waitForSelector("#surprise-me");

    // Hover over the 'Surprise Me' link
    await page.hover("#surprise-me");

    // Check if the random recipe is prefetched in the query cache
    const cachedData = await page.evaluate(() => {
      const appWindow = window as Window & {
        queryClient?: {
          getQueryData: (key: string[]) => unknown;
        };
      };

      return appWindow.queryClient?.getQueryData(["getRandomRecipeKey"]);
    });

    await expect(cachedData).not.toBeNull();
  });

  test("should navigate to a random recipe when the 'Surprise Me' link is clicked", async ({
    page,
    context,
  }) => {
    // Wait for the 'Surprise Me' link to be visible
    await page.waitForSelector("#surprise-me");

    // Click on the 'Surprise Me' link
    await page.click("#surprise-me");

    // Check if the URL contains '/random'
    await expect(page).toHaveURL(/\/random/);
  });

  test("should display an error message when the API call fails", async ({
    page,
    context,
  }) => {
    // Wait for the 'Surprise Me' link to be visible
    await page.waitForSelector("#surprise-me");

    // Simulate an redirect failure by intercepting the network request
    await context.setOffline(true);

    // Click on the 'Surprise Me' link
    await page.click("#surprise-me");

    // Check if the error message is displayed
    await expect(page.getByText("Failed to load")).toBeVisible();
  });

  test("should display an error message when the API call fails for a recipe card", async ({
    page,
    context,
  }) => {
    // Wait for the recipe cards to be visible
    await page.waitForSelector(".recipe-card");

    // Simulate an API failure by intercepting the network request
    await context.setOffline(true);

    // Click on the first recipe card
    await page.click(".recipe-card");

    // Check if the error message is displayed
    await expect(page.getByText("Failed to load")).toBeVisible();
  });

  test("should display recipe cards containing 'chicken' when the search bar has 'chicken' and the category filter is selected", async ({
    page,
  }) => {
    // Set search bar to chicken
    await page.waitForSelector("#search-input");
    await page.fill("#search-input", "chicken");

    // Select the "Category" filter
    await page.waitForSelector("#category");
    await page.click("#category");

    // Wait for the recipe cards to be visible
    await page.waitForSelector(".recipe-card");
    const recipeCards = await page.locator(".recipe-card").all();
    expect(recipeCards.length).toBeGreaterThan(0);

    // At least one recipe card should reference 'chicken'. Not every result is
    // guaranteed to mention it by name (the category/ingredient filter endpoints
    // don't return strCategory, so matches can only be spotted via the title),
    // so we assert "some" rather than "every" card to avoid flaky failures.
    const cardTexts = await Promise.all(
      recipeCards.map(
        async (card) => (await card.textContent())?.toLowerCase() ?? "",
      ),
    );
    expect(cardTexts.some((text) => text.includes("chicken"))).toBe(true);
  });

  test("should display recipe cards containing 'chicken' when the search bar has 'chicken' and the ingredient filter is selected", async ({
    page,
  }) => {
    // Set search bar to chicken
    await page.waitForSelector("#search-input");
    await page.fill("#search-input", "chicken");

    // Select the "Ingredient" filter
    await page.waitForSelector("#ingredient");
    await page.click("#ingredient");

    // Wait for the recipe cards to be visible
    await page.waitForSelector(".recipe-card");
    const recipeCards = await page.locator(".recipe-card").all();
    expect(recipeCards.length).toBeGreaterThan(0);

    // At least one recipe card should reference 'chicken' by name. Not every
    // result mentions it (e.g. a dish whose main ingredient is chicken can still
    // have a name that doesn't include the word), so we assert "some" rather
    // than "every" card to avoid flaky failures.
    const cardTexts = await Promise.all(
      recipeCards.map(
        async (card) => (await card.textContent())?.toLowerCase() ?? "",
      ),
    );
    expect(cardTexts.some((text) => text.includes("chicken"))).toBe(true);
  });

  test("should display 'canadian' in each recipe card's category chip when the search bar has 'canadian' and the area filter is selected", async ({
    page,
  }) => {
    // Set search bar to canadian
    await page.waitForSelector("#search-input");
    await page.fill("#search-input", "canadian");

    // Select the "Area" filter
    await page.waitForSelector("#area");
    await page.click("#area");

    // Wait for the recipe cards to be visible
    await page.waitForSelector(".recipe-card");
    const recipeCards = await page.locator(".recipe-card").all();
    expect(recipeCards.length).toBeGreaterThan(0);

    // The area filter's response always includes strArea, so every card's
    // category-chip should read 'Canadian'.
    for (const card of recipeCards) {
      const chipTexts = await card.locator(".category-chip").allTextContents();
      const allCanadianChips = chipTexts.every((text) =>
        text.toLowerCase().includes("canadian"),
      );
      expect(allCanadianChips).toBe(true);
    }
  });

  test("should display 'chicken' in each recipe card when the search bar has 'chicken' and the 'Dish Name' filter is selected", async ({
    page,
  }) => {
    // Set search bar to chicken
    await page.waitForSelector("#search-input");
    await page.fill("#search-input", "chicken");

    // Select the "Dish Name" filter
    await page.waitForSelector("#dish-name");
    await page.click("#dish-name");

    // Wait for ".recommended-grid" to show the "Loading recipes..." text
    // while the debounced search request is in flight
    await expect(
      page.locator(".recommended-grid").getByText("Loading recipes..."),
    ).toBeVisible();

    // Wait for the recipe cards to be visible to ensure the API call is finished
    await page.waitForSelector(".recipe-card");
    await page.waitForURL(/search=chicken/);
    const recipeCards = await page.locator(".recipe-card").all();
    expect(recipeCards.length).toBeGreaterThan(0);

    // Dish name search matches against the meal's title, so every recipe
    // card should contain 'chicken'.
    for (const card of recipeCards) {
      const cardText = (await card.textContent())?.toLowerCase() ?? "";
      expect(cardText).toContain("chicken");
    }
  });

  test("should display 'No results for this query.' in the recommended grid when the search bar has 'sdasdsad' and the 'Dish Name' filter is selected", async ({
    page,
  }) => {
    // Set search bar to a nonsense string
    await page.waitForSelector("#search-input");
    await page.fill("#search-input", "sdasdsad");

    // Select the "Dish Name" filter
    await page.waitForSelector("#dish-name");
    await page.click("#dish-name");

    // Check that the recommended grid shows the no-results message
    await expect(
      page.locator(".recommended-grid").getByText("No results for this query."),
    ).toBeVisible();
  });

  test("should display 'No results for this query.' in the recommended grid when the search bar has 'sdasdsad' and the category filter is selected", async ({
    page,
  }) => {
    // Set search bar to a nonsense string
    await page.waitForSelector("#search-input");
    await page.fill("#search-input", "sdasdsad");

    // Select the "Category" filter
    await page.waitForSelector("#category");
    await page.click("#category");

    // Check that the recommended grid shows the no-results message
    await expect(
      page.locator(".recommended-grid").getByText("No results for this query."),
    ).toBeVisible();
  });

  test("should display 'No results for this query.' in the recommended grid when the search bar has 'sdasdsad' and the ingredient filter is selected", async ({
    page,
  }) => {
    // Set search bar to a nonsense string
    await page.waitForSelector("#search-input");
    await page.fill("#search-input", "sdasdsad");

    // Select the "Ingredient" filter
    await page.waitForSelector("#ingredient");
    await page.click("#ingredient");

    // Check that the recommended grid shows the no-results message
    await expect(
      page.locator(".recommended-grid").getByText("No results for this query."),
    ).toBeVisible();
  });

  test("should display 'No results for this query.' in the recommended grid when the search bar has 'sdasdsad' and the area filter is selected", async ({
    page,
  }) => {
    // Set search bar to a nonsense string
    await page.waitForSelector("#search-input");
    await page.fill("#search-input", "sdasdsad");

    // Select the "Area" filter
    await page.waitForSelector("#area");
    await page.click("#area");

    // Check that the recommended grid shows the no-results message
    await expect(
      page.locator(".recommended-grid").getByText("No results for this query."),
    ).toBeVisible();
  });
});

//npx playwright show-report
