import React from 'react';

function UserTableHeader() {
  return (
    <thead className="bg-light-subtle">
      <tr>
        <th style={{width: "20px"}}>
          <div className="form-check">
            <input type="checkbox" className="form-check-input" id="customCheck1" />
            <label className="form-check-label" htmlFor="customCheck1"></label>
          </div>
        </th>
        <th>Customer Name</th>
        <th>Invoice ID</th>
        <th>Status</th>
        <th>Total Amount</th>
        <th>Amount Due</th>
        <th>Due Date</th>
        <th>Payment Method</th>
        <th>Action</th>
      </tr>
    </thead>
  );
}

export default UserTableHeader;