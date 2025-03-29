import React from 'react';

function ProductTableHeader() {
  return (
    <thead className="bg-light-subtle">
      <tr>
        <th style={{width: "20px"}}>
          <div className="form-check ms-1">
            <input type="checkbox" className="form-check-input" id="customCheck1" />
            <label className="form-check-label" htmlFor="customCheck1"></label>
          </div>
        </th>
        <th>Product Name & Size</th>
        <th>Price</th>
        <th>Stock</th>
        <th>Category</th>
        <th>Rating</th>
        <th>Actions</th>
      </tr>
    </thead>
  );
}

export default ProductTableHeader;