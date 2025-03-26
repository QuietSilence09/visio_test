import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import axios from 'axios';
import { FullMeal } from '../interfaces/interfaces';

const fetchMealDetails = async (id: string): Promise<{ meals: FullMeal[] | null }> => {
  const response = await axios.get(`https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  return response.data;
};

const MealDetails: React.FC = () => {
  
    
  const { id } = useParams<{ id?: string }>();

  
  if (!id) return <div>No meal id provided.</div>;

  const { data, isLoading, error } = useQuery({
    queryKey: ['meal', id],
    queryFn: () => fetchMealDetails(id!),
    enabled: !!id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  if (!data || !data.meals) return <div>No data found.</div>;

  const meal = data.meals[0];

  return (
    <div style={{ padding: '20px' }}>
      <h1>{meal.strMeal}</h1>
      <img src={meal.strMealThumb} alt={meal.strMeal} style={{ maxWidth: '400px' }} />
      <p><strong>Category:</strong> {meal.strCategory}</p>
      <p><strong>Area:</strong> {meal.strArea}</p>
      <h3>Instructions:</h3>
      <p>{meal.strInstructions}</p>
      {meal.strYoutube && (
        <div>
          <h3>Video Recipe:</h3>
          <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer">
            Watch on YouTube
          </a>
        </div>
      )}
    </div>
  );
};

export default MealDetails;
