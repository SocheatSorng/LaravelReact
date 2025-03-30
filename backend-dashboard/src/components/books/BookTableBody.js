import React, { useState, useEffect } from 'react';
import BookActions from './BookActions';
import axios from 'axios';

function BookTableBody() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <tbody>
        <tr>
          <td colSpan="8" className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  if (books.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan="8" className="text-center py-4">
            No books found.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {books.map(book => (
        <tr key={book.id}>
          <td>
            <div className="form-check ms-1">
              <input type="checkbox" className="form-check-input" id={`book${book.id}`} />
              <label className="form-check-label" htmlFor={`book${book.id}`}></label>
            </div>
          </td>
          <td>{book.id}</td>
          <td>{book.variant || book.title}</td>
          <td>{book.value || book.author}</td>
          <td>{book.option || book.category}</td>
          <td>{book.createdOn || book.created_at}</td>
          <td>
            <div className="form-check form-switch">
              <input 
                className="form-check-input" 
                type="checkbox" 
                role="switch" 
                checked={book.published || false}
                readOnly
              />
            </div>
          </td>
          <td>
            <BookActions bookId={book.id} />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default BookTableBody;