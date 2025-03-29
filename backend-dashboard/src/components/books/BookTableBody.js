import React from 'react';
import BookActions from './BookActions';

function BookTableBody() {
  const books = [
    {
      id: "BR-3922",
      variant: "Brand",
      value: "Dyson, H&M, Nike, GoPro, Huawei, Rolex, Zara, Thenorthface",
      option: "Dropdown",
      createdOn: "10 Sep 2023",
      published: true
    },
    // Add more books as needed
  ];

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
          <td>{book.variant}</td>
          <td>{book.value}</td>
          <td>{book.option}</td>
          <td>{book.createdOn}</td>
          <td>
            <div className="form-check form-switch">
              <input 
                className="form-check-input" 
                type="checkbox" 
                role="switch" 
                checked={book.published}
                readOnly
              />
            </div>
          </td>
          <td>
            <BookActions />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default BookTableBody;