import "@/Styles/MealDetail.css";

export default function IngredientList({ recipe }) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const name = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (name && name.trim()) {
      ingredients.push({ name: name.trim(), measure: measure?.trim() || "" });
    }
  }

  return (
    <>
      <div className="meal-detail-ingredients">
        <h2>Ingredients</h2>
        <ul>
          {ingredients.map((ingredient, index) => (
            <IngredientCard
              key={index}
              ingredient={ingredient.name}
              measurement={ingredient.measure}
            />
          ))}
        </ul>
      </div>
    </>
  );
}

function IngredientCard({ ingredient, measurement }) {
  return (
    <>
      <li>
        {measurement && (
          <span className="ingredient-measure">{measurement} </span>
        )}
        {ingredient}
      </li>
    </>
  );
}

export { IngredientList, IngredientCard };
