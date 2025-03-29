// fetchProducts.js
export const fetchProducts = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/books");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    // Return the data in the expected format
    if (result.success && result.data) {
      return result;
    } else {
      return { data: [] };
    }
  } catch (error) {
    console.error("Error fetching books:", error);
    return { data: [] };
  }
};
