import { test, expect } from "@playwright/test";
test.describe("Favorites", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");

    //add initial favorites
    await page.evaluate(() => {
      const recipes = [
        {
          idMeal: "53322",
          strMeal: "Flan",
          strMealAlternate: null,
          strCategory: "Dessert",
          strArea: "Uruguayan",
          strCountry: "Uruguay",
          strMealThumb:
            "https://www.themealdb.com/images/media/meals/0s80wo1764374393.jpg",
          strTags: null,
          strYoutube: "https://www.youtube.com/watch?v=rpv_PXIoysE",
        },
        {
          idMeal: "53496",
          strMeal: "Bai Sach Chrouk – Grilled Pork with Rice",
          strMealAlternate: null,
          strCategory: "Pork",
          strArea: null,
          strCountry: "Cambodia",
          strMealThumb:
            "https://www.themealdb.com/images/media/meals/f0cdwk1782688162.jpg",
          strTags: null,
          strYoutube: "",
        },
        {
          idMeal: "53060",
          strMeal: "Burek",
          strMealAlternate: null,
          strCategory: "Side",
          strArea: "Croatian",
          strCountry: "Croatia",
          strMealThumb:
            "https://www.themealdb.com/images/media/meals/tkxquw1628771028.jpg",
          strTags: "Streetfood, Onthego",
          strYoutube: "https://www.youtube.com/watch?v=YsJXZwE5pdY",
        },
        {
          idMeal: "53439",
          strMeal: "Arepa",
          strMealAlternate: null,
          strCategory: "Side",
          strArea: null,
          strCountry: "Aruba",
          strMealThumb:
            "https://www.themealdb.com/images/media/meals/ejht7k1780092390.jpg",
          strTags: null,
          strYoutube: "https://www.youtube.com/shorts/n6h5GwO6UpQ",
        },
        {
          idMeal: "53151",
          strMeal: "Paella",
          strMealAlternate: null,
          strCategory: "Seafood",
          strArea: "Spanish",
          strCountry: "Spain",
          strMealThumb:
            "https://www.themealdb.com/images/media/meals/9bl20p1763248192.jpg",
          strTags: null,
          strYoutube: "https://www.youtube.com/watch?v=vNBuXsTY15E",
        },
        {
          idMeal: "53134",
          strMeal: "Empanada",
          strMealAlternate: null,
          strCategory: "Beef",
          strArea: "Argentina",
          strCountry: "Argentina",
          strMealThumb:
            "https://www.themealdb.com/images/media/meals/q99te31763075494.jpg",
          strTags: null,
          strYoutube: "https://www.youtube.com/watch?v=RRNVLC6IAv4",
        },
        {
          idMeal: "53254",
          strMeal: "Ezme",
          strMealAlternate: null,
          strCategory: "Vegetarian",
          strArea: "Turkish",
          strCountry: "Turkey",
          strMealThumb:
            "https://www.themealdb.com/images/media/meals/pb6mj11763788331.jpg",
          strTags: null,
          strYoutube: "https://www.youtube.com/watch?v=Z1mX-C2fAuc",
        },
        {
          idMeal: "53220",
          strMeal: "kabse",
          strMealAlternate: null,
          strCategory: "Chicken",
          strArea: "Saudi Arabian",
          strCountry: "Saudi Arabia",
          strMealThumb:
            "https://www.themealdb.com/images/media/meals/utqnjv1763598650.jpg",
          strTags: null,
          strYoutube: "https://www.youtube.com/watch?v=lrcUixJEPK0",
        },
        {
          idMeal: "53430",
          strMeal: "Antiguan Breakfast (Chop Up and ‘Saltfish’)",
          strMealAlternate: null,
          strCategory: "Breakfast",
          strArea: null,
          strCountry: "Antigua and Barbuda",
          strMealThumb:
            "https://www.themealdb.com/images/media/meals/jvjnoh1780086318.jpg",
          strTags: null,
          strYoutube: "",
        },
        {
          strMeal: "Algerian Kefta (Meatballs)",
          strMealThumb:
            "https://www.themealdb.com/images/media/meals/8rfd4q1764112993.jpg",
          idMeal: "53281",
          strArea: "Algerian",
          strCountry: "Algeria",
        },
        {
          strMeal: "Arepa Pabellón",
          strMealThumb:
            "https://www.themealdb.com/images/media/meals/13fg4j1764441982.jpg",
          idMeal: "53334",
          strArea: "Venezuela",
          strCountry: "Venezuela",
        },
        {
          idMeal: "53329",
          strMeal: "Arepa pelua",
          strMealAlternate: null,
          strCategory: "Beef",
          strArea: "Venezuela",
          strCountry: "Venezuela",
          strMealThumb:
            "https://www.themealdb.com/images/media/meals/jgl9qq1764437635.jpg",
          strTags: null,
          strYoutube: "https://www.youtube.com/watch?v=bSWoRyWI6Fo",
        },
      ];
      window.localStorage.setItem("favoriteRecipes", JSON.stringify(recipes));
    });

    await page.goto("http://localhost:5173/favorites?filter=All");

    // Wait for the recipe cards to be visible
    // await expect(page.locator(".recipe-card").first()).toBeVisible();
  });

  test("should redirect to meal detail page when a recipe is clicked", async ({
    page,
  }) => {
    // Wait for the recipe cards to be visible
    const recipeCard = await page.locator(".recipe-card").first();
    await expect(recipeCard).toBeVisible();
    // Click on the first recipe card
    await recipeCard.click();

    // Check if the URL contains '/meal-detail/'
    await expect(page).toHaveURL(/\/meal-detail\//);
  });

  test("should show 'Empanada' and 'Arepa pelua' when 'Beef' filter is selected", async ({
    page,
  }) => {
    // Wait for the "Beef" category pill to be visible and click it
    const beefBtn = await page.locator("#Beef");
    await beefBtn.click();

    // Wait for the recipe cards to be visible
    const recipeCard = await page.locator(".recipe-card").first();
    expect(recipeCard).toBeVisible();

    // Check that both Beef recipes are displayed
    const empanadaCard = page.getByRole("heading", { name: "Empanada" });
    await expect(empanadaCard).toBeVisible();

    const arepaCard = page.getByRole("heading", { name: "Arepa pelua" });
    await expect(arepaCard).toBeVisible();
  });

  test("should only show 'Arepa pelua' when 'Beef' filter is selected and 'arepa' is typed in searchbar", async ({
    page,
  }) => {
    await expect(page.locator("#Beef")).toBeVisible();
    await expect(page.locator(".search-bar")).toBeVisible();

    await expect(page.getByRole("main")).toBeVisible();

    await page.getByRole("textbox", { name: "Search recipes" }).click();
    await page.getByRole("textbox", { name: "Search recipes" }).fill("arepa");

    await page.locator("#Beef").click();

    await expect(
      page.getByRole("link", { name: "Arepa pelua Arepa pelua" }),
    ).toBeVisible();
  });

  test("should only show 'Empanada' when 'Beef' filter is selected and 'Arepa pelua' is unfavorited", async ({
    page,
  }) => {
    // Wait for the "beef" category pill to be visible and click it
    const beefBtn = await page.locator("#Beef");
    await beefBtn.click();

    // Wait for the recipe cards to be visible
    await expect(page.locator(".recipe-card").first()).toBeVisible({
      timeout: 5000,
    });

    // Check that both Beef recipes are displayed
    const empanadaCard = page.getByRole("heading", { name: "Empanada" });
    await expect(empanadaCard).toBeVisible();

    const arepaCard = page.getByRole("heading", { name: "Arepa pelua" });
    await expect(arepaCard).toBeVisible();

    // Click on the unfavorite button of the Arepa pelua
    await page
      .getByRole("link", { name: "Arepa pelua" })
      .getByRole("button", { name: "Unfavorite" })
      .click();

    //check if arepa pelua is not visible
    await expect(empanadaCard).toBeVisible();
    await expect(arepaCard).not.toBeVisible();
  });

  test("should show 'Satee' in favorites page when favorited in Homepage", async ({
    page,
  }) => {
    //go to homepage
    await page.goto("http://localhost:5173/");

    // Wait for the recipe cards to be visible
    const homeRecipeCard = await page.locator(".recipe-card").first();
    expect(homeRecipeCard).toBeVisible();

    // Click on the favorite button of satee
    await page
      .getByRole("link", { name: "Satee" })
      .getByRole("button", { name: "Favorite" })
      .click();

    //Go back to favorites with beef as filter
    await page.goto("http://localhost:5173/favorites?filter=Beef");

    // Wait for the recipe cards to be visible
    const favoritesRecipeCard = await page.locator(".recipe-card").first();
    expect(favoritesRecipeCard).toBeVisible();

    // Check that Satee is displayed
    await expect(page.getByRole("heading", { name: "Satee" })).toBeVisible();
  });
});
