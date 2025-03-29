import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SelectedCategory from "../components/SelectedCategory";

const title = (
  <h2>
    Search Our <span>Thousand</span> of Books
  </h2>
);

const desc = "We have the largest collection of Books From Every Categories";
const bannerList = [
  {
    iconName: "icofont-users-alt-4",
    text: "1.5 Million Customers",
  },
  {
    iconName: "icofont-notification",
    text: "More then 2000 Merchants",
  },
  {
    iconName: "icofont-globe",
    text: "Buy Anything Online",
  },
];

const Banner = () => {
  const [searchInput, setSearchInput] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/books");
        const result = await response.json();
        console.log("API Response:", result);

        // Make sure we're using the data array from the response
        const bookData = result.data || [];
        setProducts(bookData);
        setFilteredProduct(bookData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Search functionality
  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchInput(searchTerm);

    // Filter products based on search term - adjusting for your API's property names
    const filtered = products.filter((product) =>
      (product.Title || product.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    setFilteredProduct(filtered);
  };

  return (
    <div className="banner-section style-4">
      <div className="container">
        <div className="banner-content">
          {title}
          <form>
            <SelectedCategory select={"all"} />
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search Your Favorite Book"
              value={searchInput}
              onChange={handleSearch}
            />
            <button type="submit">
              <i className="icofont-search"></i>
            </button>
          </form>
          <p>{desc}</p>
          <ul className="lab-ul">
            {searchInput &&
              filteredProduct.map((product, i) => (
                <li key={i}>
                  <Link to={`/shop/${product.BookID || product.id}`}>
                    {product.Title || product.title}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Banner;
