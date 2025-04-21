// fetchProducts.js
import { get } from "./apiService";

export const fetchProducts = async () => {
  try {
    const result = await get("books");
    console.log("API Books Response:", result);

    // Check for the proper structure in the response
    if (
      result &&
      result.original &&
      result.original.success &&
      Array.isArray(result.original.data)
    ) {
      // Response is wrapped in a Laravel response object
      const formattedData = result.original.data.map((book) => ({
        id: book.BookID,
        BookID: book.BookID,
        title: book.Title,
        Title: book.Title,
        author: book.Author,
        Author: book.Author,
        price: book.Price,
        Price: book.Price,
        stock: book.StockQuantity,
        StockQuantity: book.StockQuantity,
        CategoryName: book.category?.Name,
        CategoryID: book.CategoryID,
        category: book.category,
      }));

      return {
        success: true,
        data: formattedData,
      };
    }
    // Handle regular success response format
    else if (result && result.success && Array.isArray(result.data)) {
      // Standard API response format
      const formattedData = result.data.map((book) => ({
        id: book.BookID,
        BookID: book.BookID,
        title: book.Title,
        Title: book.Title,
        author: book.Author,
        Author: book.Author,
        price: book.Price,
        Price: book.Price,
        stock: book.StockQuantity,
        StockQuantity: book.StockQuantity,
        CategoryName: book.category?.Name,
        CategoryID: book.CategoryID,
        category: book.category,
      }));

      return {
        success: true,
        data: formattedData,
      };
    }
    // Direct array response (fallback)
    else if (Array.isArray(result)) {
      const formattedData = result.map((book) => ({
        id: book.BookID || book.id,
        BookID: book.BookID || book.id,
        title: book.Title || book.title,
        Title: book.Title || book.title,
        author: book.Author || book.author,
        Author: book.Author || book.author,
        price: book.Price || book.price,
        Price: book.Price || book.price,
        stock: book.StockQuantity || book.stock,
        StockQuantity: book.StockQuantity || book.stock,
        CategoryName: book.category?.Name || book.CategoryName,
        CategoryID: book.CategoryID || book.category_id,
        category: book.category,
      }));

      return {
        success: true,
        data: formattedData,
      };
    } else {
      console.error("Unexpected API response format:", result);
      return {
        success: false,
        data: [],
        message: "Invalid response format from API",
      };
    }
  } catch (error) {
    console.error("Error fetching books:", error);
    return {
      success: false,
      data: [],
      message: error.message,
    };
  }
};
