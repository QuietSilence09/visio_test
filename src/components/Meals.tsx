import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQueries } from "@tanstack/react-query";
import { FullMeal, MealsResponse } from "../interfaces/interfaces";
import Pagination from "./Pagination";
import Searching from "./Searching";
import WishlistDisplay from "./WishList";

const letters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const fetchData = async (letter: string): Promise<MealsResponse> => {
  const response = await axios.get<MealsResponse>(
    `https://themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );

  return response.data;
};

const Meals: React.FC = () => {
  const queries = useQueries({
    queries: letters.map((letter) => ({
      queryKey: ["recipes", letter],
      queryFn: () => fetchData(letter),
      staleTime: 10 * 60 * 1000,
    })),
  });

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.find((query) => query.error);

  const combinedMeals: FullMeal[] = queries.reduce((acc, query) => {
    const data = query.data as MealsResponse;
    if (data && data.meals && data.meals.length > 0) {
      return [...acc, ...data.meals];
    }
    return acc;
  }, [] as FullMeal[]);
  console.log(queries.map((query) => query.data));
  console.log(
    queries.map((query) => ({
      isLoading: query.isLoading,
      isError: query.isError,
      data: query.data,
    }))
  );

  const [selectedCountry, setSelectedCountry] = useState<string>("All");

  const uniqueCountries = useMemo(() => {
    const countries = combinedMeals.map((meal) => meal.strArea);
    return ["All", ...Array.from(new Set(countries))];
  }, [combinedMeals]);

  const filteredMeals = useMemo(() => {
    if (selectedCountry === "All") return combinedMeals;
    return combinedMeals.filter((meal) => meal.strArea === selectedCountry);
  }, [combinedMeals, selectedCountry]);

  const [wishlist, setWishlist] = useState<FullMeal[]>([]);
  const addToWishlist = (meal: FullMeal) => {
    //console.log(wishlist);

    if (!wishlist.find((item) => item.idMeal === meal.idMeal)) {
      setWishlist([...wishlist, meal]);
    }
  };

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredMeals.length / itemsPerPage);
  const currentMeals = filteredMeals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {isError?.error?.message}</div>
      ) : (
        <div>
          <Searching />

          <div style={{ margin: "20px 0" }}>
            <label htmlFor="country-select" style={{ marginRight: "8px" }}>
              Filter by Country:
            </label>
            <select
              id="country-select"
              value={selectedCountry}
              onChange={handleCountryChange}
              style={{ padding: "4px" }}
            >
              {uniqueCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {currentMeals.map((meal) => (
              <div
                key={meal.idMeal}
                style={{
                  border: "1px solid #ccc",
                  margin: "10px",
                  padding: "10px",
                  display: "inline-block",
                }}
              >
                <div onClick={() => navigate(`/meal/${meal.idMeal}`)}>
                  <img src={meal.strMealThumb} alt={meal.strMeal} width={100} />
                  <h3>{meal.strMeal}</h3>
                  <p>Country: {meal.strArea}</p>
                  <p>Category: {meal.strCategory}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToWishlist(meal);
                  }}
                >
                  To WishList
                </button>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />

          <WishlistDisplay wishlist={wishlist} />
        </div>
      )}
    </div>
  );
};

export default Meals;
