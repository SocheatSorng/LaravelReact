import React, { useState, useEffect } from "react";
import { fetchProducts } from "../utilis/fetchProducts";

const SelectedCategory = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const products = await fetchProducts();

        // Extract categories from products and get unique values
        const uniqueCategories = [
          "All Categories",
          ...new Set(products.map((product) => product.category)),
        ];

        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, []);

  return (
    <select>
      {categories.map((category, index) => (
        <option key={index} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
};

export default SelectedCategory;
