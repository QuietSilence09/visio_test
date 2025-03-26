
import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import debounce from 'debounce';
import { MealsResponse } from '../interfaces/interfaces';

const Searching: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedTerm, setDebouncedTerm] = useState<string>('');

  
  const debouncedUpdate = debounce((term: string) => {

    setDebouncedTerm(term);
    //console.log(term);
    
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    //console.log(term);
    
    debouncedUpdate(term);
  };

  
  const { data, isLoading, error } = useQuery<MealsResponse>({
    
    queryKey: ['search', debouncedTerm],
    queryFn: () =>
      axios
        .get<MealsResponse>(`https://themealdb.com/api/json/v1/1/search.php?s=${debouncedTerm}`)
        .then(res => {
            //console.log(res);
            //console.log(res.data);
            return res.data
        }),
    enabled: debouncedTerm.trim().length > 0,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div style={{ position: 'relative', width: '300px', marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Search meals..."
        value={searchTerm}
        onChange={handleChange}
        style={{ padding: '8px', width: '100%' }}
      />

      
      {debouncedTerm.trim().length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #ccc',
            zIndex: 100,
            maxHeight: '120px',
            overflowY: 'auto',
          }}
        >
          {isLoading ? (
            <div style={{ padding: '8px' }}>Loading...</div>
          ) : error ? (
            <div style={{ padding: '8px' }}>
              Error: {error instanceof Error ? error.message : 'Error'}
            </div>
          ) : data && data.meals && data.meals.length > 0 ? (
            data.meals.map((meal) => (
              <div
                key={meal.idMeal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  width={50}
                  style={{ marginRight: '8px' }}
                />
                <div>
                  <strong style={{ color: '#000', fontSize: '16px' }}>
                    {meal.strMeal}
                  </strong>
                  <p style={{ margin: 0, color: '#000', fontSize: '14px' }}>
                    {meal.strCategory}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '8px' }}>No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Searching;
