import React from "react";
import { useNavigate } from "react-router-dom";
import { bookService } from "../../services/api";

function ProductActions({ id, onRefresh }) {
  const navigate = useNavigate();

  // View book details
  const handleView = () => {
    navigate(`/products/${id}`);
  };

  // Edit book
  const handleEdit = () => {
    navigate(`/products/${id}/edit`);
  };

  // Edit book details
  const handleEditDetails = () => {
    navigate(`/products/${id}/edit-detail`);
  };

  // Delete book
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await bookService.deleteBook(id);
        alert("Book deleted successfully");
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Failed to delete book. Please try again.");
      }
    }
  };

  return (
    <div className="d-flex gap-2">
      <button
        className="btn btn-light btn-sm"
        title="View"
        onClick={handleView}
      >
        <span className="fs-18 align-middle">👁️</span>
      </button>
      <button
        className="btn btn-soft-primary btn-sm"
        title="Edit"
        onClick={handleEdit}
      >
        <span className="fs-18 align-middle">✏️</span>
      </button>
      <button
        className="btn btn-soft-info btn-sm"
        title="Edit Details"
        onClick={handleEditDetails}
      >
        <span className="fs-18 align-middle">📝</span>
      </button>
      <button
        className="btn btn-soft-danger btn-sm"
        title="Delete"
        onClick={handleDelete}
      >
        <span className="fs-18 align-middle">🗑️</span>
      </button>
    </div>
  );
}

export default ProductActions;
