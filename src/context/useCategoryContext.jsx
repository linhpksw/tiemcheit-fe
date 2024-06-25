"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

const INIT_STATE = {
  categories: [],
  products: [],
  fetchCategories: () => {},
  fetchProductsByCategory: () => {},
};

const CategoryContext = createContext(undefined);

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error("useCategoryContext must be used within a CategoryProvider");
  }
  return context;
};

const CategoryProvider = ({ children }) => {
  const [state, setState] = useState(INIT_STATE);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8080//category/getAll");
      const data = await response.json();
      setState((prevState) => ({ ...prevState, categories: data }));
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  const fetchProductsByCategory = useCallback(async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:8080/product/getAllByCategory/${categoryId}`);
      const data = await response.json();
      setState((prevState) => ({ ...prevState, products: data }));
    } catch (error) {
      console.error("Failed to fetch products by category:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <CategoryContext.Provider
      value={useMemo(
        () => ({
          ...state,
          fetchCategories,
          fetchProductsByCategory,
        }),
        [state, fetchCategories, fetchProductsByCategory]
      )}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryProvider;
