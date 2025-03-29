import React from "react";
import { useParams } from "react-router-dom";
import BookForm from "../components/books/BookForm";

function EditBook() {
  // Get the book ID from the URL params
  const { id } = useParams();

  return (
    <div className="container-xxl">
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="fw-bold py-3 mb-2">Edit Book</h4>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <BookForm bookId={id} />
        </div>
      </div>
    </div>
  );
}

export default EditBook;
