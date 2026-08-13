import "@/Styles/MealDetail.css";

export default function StepList({ recipe }) {
  const instructions = recipe.strInstructions;
  if (!instructions) return [];
  const steps = instructions
    .split(/\r/)
    .map((step) => step.trim())
    .filter(Boolean);

  return (
    <>
      <div className="meal-detail-directions">
        <h2>Directions</h2>
        {steps.length > 1 ? (
          <ol>
            {steps.map(
              (step, index) =>
                step.length > 1 && <StepCard key={index} step={step} />, //step > 1 to avoid empty steps and sometimes just a single number after line break
            )}
          </ol>
        ) : (
          <p>{steps[0]}</p>
        )}
      </div>
    </>
  );
}

function StepCard({ step }) {
  return (
    <>
      <li>{step}</li>
    </>
  );
}

export { StepList, StepCard };
