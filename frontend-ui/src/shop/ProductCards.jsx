import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utilis/apiService";
import { useCart } from "../hooks/useCart";

const ProductCards = ({ GridList, products }) => {
  const { addToCart, isLoading } = useCart();
  const [addingToCart, setAddingToCart] = useState({});
  const [addedToCart, setAddedToCart] = useState({});

  const handleAddToCart = async (product) => {
    const productId = product.BookID || product.id;

    // Prevent multiple clicks
    if (addingToCart[productId]) return;

    setAddingToCart(prev => ({ ...prev, [productId]: true }));

    try {
      const result = await addToCart(product, 1);

      if (result.success) {
        // Show success feedback
        setAddedToCart(prev => ({ ...prev, [productId]: true }));

        // Reset success state after 2 seconds
        setTimeout(() => {
          setAddedToCart(prev => ({ ...prev, [productId]: false }));
        }, 2000);
      } else {
        // Show error message
        alert(result.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('An error occurred while adding to cart');
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <div className={`shop-product-wrap row ${GridList ? "grid" : "list"}`}>
      {products.map((product, i) => {
        const productId = product.BookID || product.id;
        const isAddingToCart = addingToCart[productId];
        const isAddedToCart = addedToCart[productId];

        return (
          <div key={i} className="col-lg-4 col-md-6 col-12">
          <div className="product-item">
            <div
              className="card border-0 shadow-sm"
              style={{ height: "510px" }}
            >
              {/* Product Image */}
              <div
                style={{
                  height: "350px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.5rem",
                }}
              >
                <Link
                  to={`/shop/${product.BookID || product.id}`}
                  className="h-100 w-100 d-flex align-items-center justify-content-center"
                >
                  <img
                    src={
                      product.BookID
                        ? getImageUrl(`books/${product.BookID}/image`)
                        : "/assets/images/product-placeholder.png"
                    }
                    alt={product.Title || product.title}
                  />
                </Link>
              </div>

              {/* Product Details */}
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <Link
                    to={`/shop/${product.BookID || product.id}`}
                    className="text-decoration-none text-dark"
                  >
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
                  </Link>
                  <p className="price fw-bold mb-2">
                    ${parseFloat(product.Price || product.price).toFixed(2)}
                  </p>
                  <p className="text-secondary small mb-0">
                    {product.Author || product.author || ""}
                  </p>
                </div>
                <div className="d-flex justify-content-center gap-2">
                  <Link
                    to={`/shop/${product.BookID || product.id}`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    View Details
                  </Link>
                  <button
                    className={`btn btn-sm ${isAddedToCart ? 'btn-success' : 'btn-primary'}`}
                    onClick={() => handleAddToCart(product)}
                    disabled={isAddingToCart || isLoading}
                  >
                    {isAddingToCart ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        Adding...
                      </>
                    ) : isAddedToCart ? (
                      <>
                        <i className="icofont-check me-1"></i>
                        Added!
                      </>
                    ) : (
                      <>
                        <i className="icofont-shopping-cart me-1"></i>
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
};

export default ProductCards;
