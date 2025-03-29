import React, { useState } from "react";
import { Link } from "react-router-dom";

const Search = ({ products, GridList }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products and remove duplicates based on title
  const filteredProducts = products
    .filter((product) =>
      (product.Title || product.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .reduce((unique, product) => {
      // Check if we already have a product with this title
      const exists = unique.find(
        (p) => (p.Title || p.title) === (product.Title || product.title)
      );
      if (!exists) {
        unique.push(product);
      }
      return unique;
    }, []);

  return (
    <div className="widget widget-search">
      <form className="search-wrapper mb-3">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search..."
          defaultValue={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">
          <i className="icofont-search-2"></i>
        </button>
      </form>

      {/* showing search result */}
      <div>
        {searchTerm &&
          filteredProducts.map((product) => (
            <Link
              key={product.BookID || product.id}
              to={`/shop/${product.BookID || product.id}`}
            >
              <div className="d-flex gap-3 p-2">
                <div className="pro-thumb h-25">
                  <img
                    src={
                      product.Image ||
                      product.image ||
                      "/assets/images/product-placeholder.png"
                    }
                    alt={product.Title || product.title}
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "contain",
                    }}
                    onError={(e) => {
                      e.target.src = "/assets/images/product-placeholder.png";
                    }}
                  />
                </div>
                <div className="product-content">
                  <p>
                    <Link to={`/shop/${product.BookID || product.id}`}>
                      {product.Title || product.title}
                    </Link>
                  </p>
                  <h6>
                    ${parseFloat(product.Price || product.price).toFixed(2)}
                  </h6>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Search;
