
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Meals from "./components/Meals";
import MealDetails from "./components/MealsDetails";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Meals />} />
          <Route path="/meal/:id" element={<MealDetails />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
