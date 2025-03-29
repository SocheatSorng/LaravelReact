// fetchProducts.js
export const fetchProducts = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/books");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};
