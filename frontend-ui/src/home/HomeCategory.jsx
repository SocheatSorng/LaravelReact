import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../utilis/fetchProducts"; // Adjust the import path as needed
import { getImageUrl } from "../utilis/apiService";

const productSectionTitle = "Featured Books";
const btnText = "Browse All Books";

const HomeCategory = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchProducts();
        const products = response.data || [];

        // Select 6 featured products for better display
        const featured = products.slice(0, 6);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="category-section style-4 padding-tb">
      <div className="container">
        {/* Featured Products Section */}
        <div className="section-header text-center">
          <h2 className="title">{productSectionTitle}</h2>
          <p className="subtitle">Discover our handpicked selection of amazing books</p>
        </div>

        <div className="section-wrapper">
          <div className="row g-4 justify-content-center row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1">
            {featuredProducts.map((product, i) => (
              <div key={i} className="col d-flex justify-content-center">
                <Link
                  to={`/shop/${product.BookID || product.id}`}
                  className="text-decoration-none"
                  style={{ width: "100%", maxWidth: "300px" }}
                >
                  <div
                    className="card border-0 shadow-sm h-100 hover-card"
                    style={{
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
                    }}
                  >
                    {/* image thumbnail */}
                    <div
                      className="card-img-top"
                      style={{
                        height: "280px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "1.5rem",
                        backgroundColor: "#f8f9fa"
                      }}
                    >
                      <img
                        src={getImageUrl(
                          `books/${product.BookID || product.id}/image`
                        )}
                        alt={product.Title || product.title}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                          borderRadius: "8px"
                        }}
                        onError={(e) => {
                          e.target.src =
                            "/assets/images/product-placeholder.png";
                        }}
                      />
                    </div>

                    {/* content */}
                    <div className="card-body text-center py-3 d-flex flex-column">
                      <h6
                        className="card-title mb-2 flex-grow-1"
                        style={{
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical",
                          lineHeight: "1.3",
                          minHeight: "2.6em",
                          fontSize: "1rem",
                          fontWeight: "600"
                        }}
                      >
                        {product.Title || product.title}
                      </h6>
                      <div className="mt-auto">
                        <p className="price fw-bold mb-0 text-primary" style={{ fontSize: "1.1rem" }}>
                          ${parseFloat(product.Price || product.price).toFixed(2)}
                        </p>
                        <small className="text-muted">Available now</small>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* btn get started */}
          <div className="text-center mt-5">
            <Link
              to="/shop"
              className="btn btn-lg btn-primary px-5 py-3"
              style={{
                borderRadius: "50px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}
            >
              <span>{btnText}</span>
              <i className="icofont-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCategory;
