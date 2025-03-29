import React from "react";

function UserTableHeader() {
  return (
    <thead className="bg-light-subtle">
      <tr>
        <th style={{ width: "20px" }}>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="customCheck1"
            />
            <label className="form-check-label" htmlFor="customCheck1"></label>
          </div>
        </th>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Role</th>
        <th>Created At</th>
        <th>Action</th>
      </tr>
    </thead>
  );
}

export default UserTableHeader;
