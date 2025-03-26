import React, { useMemo } from 'react';
import { FullMeal } from '../interfaces/interfaces';

interface WishlistDisplayProps {
  wishlist: FullMeal[];
}


const extractIngredients = (meal: FullMeal) => {
  const ingredients: { ingredient: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = (meal as any)[`strIngredient${i}`];
    const measure = (meal as any)[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : '',
      });
    }
  }
  return ingredients;
};


const aggregateIngredients = (wishlist: FullMeal[]) => {
  const aggregated: Record<string, string[]> = {};
  wishlist.forEach(meal => {
    const ingredients = extractIngredients(meal);
    ingredients.forEach(({ ingredient, measure }) => {
      if (aggregated[ingredient]) {
        aggregated[ingredient].push(measure);
      } else {
        aggregated[ingredient] = [measure];
      }
    });
  });
  return aggregated;
};

const WishlistDisplay: React.FC<WishlistDisplayProps> = ({ wishlist }) => {
  const aggregatedIngredients = useMemo(() => aggregateIngredients(wishlist), [wishlist]);

  

  return (
    <div style={{ marginTop: '40px' }}>
      <h2>Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>No meals added yet.</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {wishlist.map(meal => (
              <div
                key={meal.idMeal}
                style={{
                  border: '1px solid #ccc',
                  margin: '10px',
                  padding: '10px',
                  width: '200px',
                  textAlign: 'center',
                }}
              >
                <img src={meal.strMealThumb} alt={meal.strMeal} width={150} />
                <h3>{meal.strMeal}</h3>
                <p>{meal.strCategory}</p>
              </div>
            ))}
          </div>
          <h3>Ingredients for Purchase</h3>
          <ul>
            {Object.entries(aggregatedIngredients).map(([ingredient, measures]) => (
              <li key={ingredient}>
                <strong>{ingredient}</strong>: {measures.join(', ')}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default WishlistDisplay;
