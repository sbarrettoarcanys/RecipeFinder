import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");

    // Wait for the recipe cards to be visible.
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("should have the correct title", async ({ page }) => {
    await expect(page).toHaveTitle("Recipe Finder");
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
    const surpriseMeBtn = await page.locator("#surprise-me");

    // Hover over the 'Surprise Me' link
    await surpriseMeBtn.hover();

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
  }) => {
    // Wait for the 'Surprise Me' link to be visible
    const surpriseMeBtn = await page.locator("#surprise-me");

    // Hover over the 'Surprise Me' link
    await surpriseMeBtn.click();

    // Check if the URL contains '/random'
    await expect(page).toHaveURL(/\/random/);
  });

  test("should display an error message when the 'Surprise Me' API call fails", async ({
    page,
    context,
  }) => {
    // Wait for the 'Surprise Me' link to be visible
    await page.locator("#surprise-me");

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
    // Wait for the recipe cards to be visible.
    const recipeCardsLocator = await page.locator(".recipe-card");
    await expect(recipeCardsLocator.first()).toBeVisible();

    // Simulate an API failure by intercepting the network request
    await context.setOffline(true);

    // Click on the first recipe card
    await recipeCardsLocator.first().click();

    // Check if the error message is displayed
    await expect(page.getByText("Failed to load")).toBeVisible();
  });

  test("should display recipe cards containing 'chicken' when the search bar has 'chicken' and the category filter is selected", async ({
    page,
  }) => {
    // Set search bar to chicken
    const searchInput = await page.locator("#search-input");
    await searchInput.fill("chicken");

    // Select the "Category" filter
    const categoryBtn = await page.locator("#category");
    await categoryBtn.click();

    // Wait for the recipe cards to be visible.
    const recipeCardsLocator = await page.locator(".recipe-card");
    await expect(recipeCardsLocator.first()).toBeVisible();

    //check if recipes are returned
    const recipeCards = await recipeCardsLocator.all();
    expect(recipeCards.length).toBeGreaterThan(0);

    // At least one recipe card should reference 'chicken'.
    const cardTexts = await recipeCardsLocator.allTextContents();
    expect(
      cardTexts.some((text) => text.toLowerCase().includes("chicken")),
    ).toBe(true);
  });

  test("should display recipe cards containing 'chicken' when the search bar has 'chicken' and the ingredient filter is selected", async ({
    page,
  }) => {
    // Select the "Ingredient" filter
    const ingredientBtn = await page.locator("#ingredient");
    await ingredientBtn.click();

    // Set search bar to chicken
    const searchInput = await page.locator("#search-input");
    await searchInput.fill("chicken");

    //wait for debounce
    await page.waitForURL(/search=chicken/);

    // Wait for the recipe cards to be visible
    const recipeCardsLocator = await page.locator(".recipe-card");
    await expect(recipeCardsLocator.first()).toBeVisible();

    //check if recipes are returned
    expect(await recipeCardsLocator.count()).toBeGreaterThan(0);

    // At least one recipe card should reference 'chicken'.
    const cardTexts = await recipeCardsLocator.allTextContents();
    expect(
      cardTexts.some((text) => text.toLowerCase().includes("chicken")),
    ).toBe(true);
  });

  test("should display 'canadian' in each recipe card's category chip when the search bar has 'canadian' and the area filter is selected", async ({
    page,
  }) => {
    // Set search bar to canadian
    const searchInput = await page.locator("#search-input");
    await searchInput.fill("canadian");

    // Select the "Area" filter
    const areaBtn = await page.locator("#area");
    await areaBtn.click();

    // Wait for the recipe cards to be visible
    const recipeCardsLocator = await page.locator(".recipe-card");
    await expect(recipeCardsLocator.first()).toBeVisible();

    const recipeCards = await recipeCardsLocator.all();
    expect(recipeCards.length).toBeGreaterThan(0);

    // Check if category is canadian
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
    const searchInput = await page.locator("#search-input");
    await searchInput.fill("chicken");

    // Select the "Dish Name" filter
    const dishNameBtn = await page.locator("#dish-name");
    await dishNameBtn.click();

    //wait to change URL
    await page.waitForURL(/search=chicken/);

    // Wait for the recipe cards to be visible to ensure the API call is finished
    await page.locator(".recipe-card");
    const recipeCardsLocator = await page.locator(".recipe-card");
    await expect(recipeCardsLocator.first()).toBeVisible();

    const recipeCards = await recipeCardsLocator.all();
    expect(recipeCards.length).toBeGreaterThan(0);

    // check if all dishes have chicken on the name
    const cardTexts = await recipeCardsLocator.allTextContents();
    for (const cardText of cardTexts) {
      expect(cardText.toLowerCase()).toContain("chicken");
    }
  });

  test("should display 'No results for this query.' in the recommended grid when the search bar has 'sdasdsad' and the 'Dish Name' filter is selected", async ({
    page,
  }) => {
    await expect(page.locator(".search-bar")).toBeVisible();
    await page.getByText("Dish Name").click();

    await page
      .getByRole("textbox", { name: "Search recipes" })
      .fill("sdasdadasd");

    await expect(page.getByText("No results for this query.")).toBeVisible();
  });

  test("should display 'No results for this query.' in the recommended grid when the search bar has 'sdasdsad' and the category filter is selected", async ({
    page,
  }) => {
    await expect(page.locator(".search-bar")).toBeVisible();
    await page.getByText("Category").click();

    await page
      .getByRole("textbox", { name: "Search recipes" })
      .fill("sdasdadasd");

    await expect(page.getByText("No results for this query.")).toBeVisible();
  });

  test("should display 'No results for this query.' in the recommended grid when the search bar has 'sdasdsad' and the ingredient filter is selected", async ({
    page,
  }) => {
    // Set search bar to a nonsense string
    const searchInput = await page.locator("#search-input");
    await searchInput.fill("sdasdsad");

    // Select the "Ingredient" filter
    const ingredientBtn = await page.locator("#ingredient");
    await ingredientBtn.click();

    // Check that the recommended grid shows the no-results message

    const recommendedGrid = await page.locator(".recommended-grid");
    await expect(
      recommendedGrid.getByText("No results for this query."),
    ).toBeVisible();
  });

  test("should display 'No results for this query.' in the recommended grid when the search bar has 'sdasdsad' and the area filter is selected", async ({
    page,
  }) => {
    // Set search bar to a nonsense string
    const searchInput = await page.locator("#search-input");
    await searchInput.fill("sdasdsad");

    // Select the "Area" filter
    const areaBtn = await page.locator("#area");
    await areaBtn.click();

    // Check that the recommended grid shows the no-results message
    await expect(
      page.locator(".recommended-grid").getByText("No results for this query."),
    ).toBeVisible();
  });
});
