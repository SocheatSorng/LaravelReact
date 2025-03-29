import React from "react";
import BookForm from "../components/books/BookForm";

function CreateBook() {
  return (
    <div className="container-xxl">
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="fw-bold py-3 mb-2">Create New Book</h4>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <BookForm />
        </div>
      </div>
    </div>
  );
}

export default CreateBook;
