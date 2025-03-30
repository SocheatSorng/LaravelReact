import React from 'react';
import { useNavigate } from 'react-router-dom';

function BookActions({ bookId }) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/books/${bookId}`);
  };

  const handleEdit = () => {
    navigate(`/books/${bookId}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        // In a real app, this would be an API call to delete the book
        // await axios.delete(`http://localhost:8000/api/books/${bookId}`);
        console.log(`Book ${bookId} would be deleted`);
        // You would typically refresh the book list here
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  return (
    <div className="d-flex gap-2">
      <button className="btn btn-light btn-sm" title="View" onClick={handleView}>
        <span className="fs-18 align-middle">👁️</span>
      </button>
      <button className="btn btn-soft-primary btn-sm" title="Edit" onClick={handleEdit}>
        <span className="fs-18 align-middle">✏️</span>
      </button>
      <button className="btn btn-soft-danger btn-sm" title="Delete" onClick={handleDelete}>
        <span className="fs-18 align-middle">🗑️</span>
      </button>
    </div>
  );
}

export default BookActions;