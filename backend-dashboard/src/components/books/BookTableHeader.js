import React from 'react';

function BookTableHeader() {
  return (
    <thead className="bg-light-subtle">
      <tr>
        <th style={{width: "20px"}}>
          <div className="form-check ms-1">
            <input type="checkbox" className="form-check-input" id="selectAll" />
            <label className="form-check-label" htmlFor="selectAll"></label>
          </div>
        </th>
        <th>ID</th>
        <th>Variant</th>
        <th>Value</th>
        <th>Option</th>
        <th>Created On</th>
        <th>Published</th>
        <th>Action</th>
      </tr>
    </thead>
  );
}

export default BookTableHeader;