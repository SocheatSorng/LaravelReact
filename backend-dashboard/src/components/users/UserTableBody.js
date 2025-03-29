import React from "react";
import UserActions from "./UserActions";
import { Link } from "react-router-dom";

function UserTableBody({ users = [], onDelete }) {
  // Fallback empty array if users not provided
  if (!users || users.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan="8" className="text-center">
            No users found
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {users.map((user) => (
        <tr key={user.UserID}>
          <td>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`user${user.UserID}`}
              />
              <label
                className="form-check-label"
                htmlFor={`user${user.UserID}`}
              ></label>
            </div>
          </td>
          <td>{user.UserID}</td>
          <td>
            <div className="d-flex align-items-center">
              <div className="avatar-sm me-2 bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center">
                {user.FirstName?.charAt(0)}
                {user.LastName?.charAt(0)}
              </div>
              <span>
                {user.FirstName} {user.LastName}
              </span>
            </div>
          </td>
          <td>{user.Email}</td>
          <td>{user.Phone || "-"}</td>
          <td>
            <span
              className={`badge ${
                user.Role === "admin"
                  ? "bg-danger-subtle text-danger"
                  : "bg-success-subtle text-success"
              } py-1 px-2`}
            >
              {user.Role}
            </span>
          </td>
          <td>{new Date(user.CreatedAt).toLocaleDateString()}</td>
          <td>
            <UserActions
              userId={user.UserID}
              onDelete={() => onDelete(user.UserID)}
            />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default UserTableBody;
