import React from "react";
import ProductActions from "./ProductActions";

function ProductTableBody({ products = [], onRefresh }) {
  // If no products are passed, show empty state
  if (!products || products.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan="7" className="text-center py-4">
            No products found
          </td>
        </tr>
      </tbody>
    );
  }

  // Format currency
  const formatPrice = (price) => {
    return `$${Number(price).toFixed(2)}`;
  };

  return (
    <tbody>
      {products.map((book) => (
        <tr key={book.BookID}>
          <td>
            <div className="form-check ms-1">
              <input
                type="checkbox"
                className="form-check-input"
                id={`book${book.BookID}`}
              />
              <label
                className="form-check-label"
                htmlFor={`book${book.BookID}`}
              ></label>
            </div>
          </td>
          <td>
            <div className="d-flex align-items-center gap-2">
              <div className="rounded bg-light avatar-md d-flex align-items-center justify-content-center">
                <img
                  src={book.Image || "/assets/images/placeholder-book.png"}
                  alt={book.Title}
                  className="avatar-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/images/placeholder-book.png";
                  }}
                />
              </div>
              <div>
                <a
                  href={`/products/${book.BookID}`}
                  className="text-dark fw-medium fs-15"
                >
                  {book.Title}
                </a>
                <p className="text-muted mb-0 mt-1 fs-13">
                  <span>Author: </span>
                  {book.Author}
                </p>
                {book.bookDetail?.Format && (
                  <p className="text-muted mb-0 fs-13">
                    <span>Format: </span>
                    {book.bookDetail.Format}
                  </p>
                )}
              </div>
            </div>
          </td>
          <td>{formatPrice(book.Price)}</td>
          <td>
            <p className="mb-1 text-muted">
              <span
                className={`text-${
                  book.StockQuantity > 0 ? "dark" : "danger"
                } fw-medium`}
              >
                {book.StockQuantity} Item{book.StockQuantity !== 1 ? "s" : ""}
              </span>{" "}
              {book.StockQuantity > 0 ? "In Stock" : "Out of Stock"}
            </p>
            {book.StockQuantity <= 10 && book.StockQuantity > 0 && (
              <p className="mb-0 text-warning">Low Stock</p>
            )}
          </td>
          <td>{book.category?.Name || "Uncategorized"}</td>
          <td>
            {book.averageRating ? (
              <span className="badge p-1 bg-light text-dark fs-12 me-1">
                <span className="align-middle text-warning me-1">⭐</span>
                {book.averageRating.toFixed(1)}
              </span>
            ) : (
              <span className="text-muted fs-12">No ratings</span>
            )}
            {book.reviewCount && (
              <span className="ms-1">
                {book.reviewCount} Review{book.reviewCount !== 1 ? "s" : ""}
              </span>
            )}
          </td>
          <td>
            <ProductActions id={book.BookID} onRefresh={onRefresh} />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default ProductTableBody;
