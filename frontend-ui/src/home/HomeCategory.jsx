import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../utilis/fetchProducts"; // Adjust the import path as needed
import { getImageUrl } from "../utilis/apiService";

const subTitle = "Choose Any Books";
const title = "Buy Everything with Us";
const btnText = "Get Started Now";
const productSectionTitle = "Featured Books";

const HomeCategory = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchProducts();
        const products = response.data || [];
        setAllProducts(products);

        // Extract unique categories from products
        const uniqueCategories = [
          "All Categories",
          ...new Set(
            products.map(
              (product) => product.category?.Name || product.category
            )
          ),
        ].filter(Boolean);

        // Get only one product per category
        const uniqueCategoryProducts = [];
        const seenCategories = new Set();

        products.forEach((product) => {
          const category = product.category?.Name || product.category;
          if (category && !seenCategories.has(category)) {
            seenCategories.add(category);
            uniqueCategoryProducts.push({
              imgUrl: product.Image || product.image,
              imgAlt: `Category ${product.Title || product.title}`,
              iconName: "icofont-brand-windows",
              category: category,
            });
          }
        });

        setCategoryList(uniqueCategoryProducts);

        // Select 3 featured products
        const featured = products.slice(0, 3);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle category selection change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div className="category-section style-4 padding-tb">
      <div className="container">
        {/* Categories Section */}
        <div className="section-header text-center">
          <span className="subtitle">{subTitle}</span>
          <h2 className="title">{title}</h2>
        </div>

        <div className="section-wrapper">
          <div className="row g-4 justify-content-center align-items-center row-cols-md-4 row-cols-sm-2 row-cols-1">
            {categoryList.map((val, i) => (
              <div key={i} className="col d-flex justify-content-center">
                <Link
                  to={`/shop?category=${val.category}`}
                  className="text-decoration-none"
                  style={{ width: "100%", maxWidth: "280px" }}
                >
                  <div
                    className="card border-0 shadow-sm"
                    style={{ height: "320px" }}
                  >
                    {/* image thumbnail */}
                    <div
                      className="card-img-top"
                      style={{
                        height: "220px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "1rem",
                      }}
                    >
                      <img
                        src={getImageUrl(`books/${val.productId || 1}/image`)}
                        alt={val.imgAlt}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "/assets/images/product-placeholder.png";
                        }}
                      />
                    </div>

                    {/* content */}
                    <div className="card-body text-center py-3">
                      <div className="mb-2">
                        <i className={`${val.iconName} fs-3`}></i>
                      </div>
                      <h6 className="card-title text-capitalize mb-0">
                        {val.category}
                      </h6>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="section-header text-center mt-5">
          <h2 className="title">{productSectionTitle}</h2>
        </div>

        <div className="section-wrapper">
          <div className="row g-4 justify-content-center row-cols-md-3 row-cols-sm-2 row-cols-1">
            {featuredProducts.map((product, i) => (
              <div key={i} className="col d-flex justify-content-center">
                <Link
                  to={`/shop/${product.BookID || product.id}`}
                  className="text-decoration-none"
                  style={{ width: "100%", maxWidth: "280px" }}
                >
                  <div
                    className="card border-0 shadow-sm"
                    style={{ height: "380px" }}
                  >
                    {/* image thumbnail */}
                    <div
                      className="card-img-top"
                      style={{
                        height: "250px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "1rem",
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
                        }}
                        onError={(e) => {
                          e.target.src =
                            "/assets/images/product-placeholder.png";
                        }}
                      />
                    </div>

                    {/* content */}
                    <div className="card-body text-center py-3">
                      <h6
                        className="card-title mb-2"
                        style={{
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical",
                          lineHeight: "1.2",
                        }}
                      >
                        {product.Title || product.title}
                      </h6>
                      <p className="price fw-bold mb-0">
                        ${parseFloat(product.Price || product.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* btn get started */}
          <div className="text-center mt-5">
            <Link to="/shop" className="btn btn-lg btn-primary">
              <span>{btnText}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCategory;
