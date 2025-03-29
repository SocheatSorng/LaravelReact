import React from "react";
import { Link } from "react-router-dom";

function UserActions({ userId, onDelete }) {
  return (
    <div className="d-flex gap-2">
      <Link
        to={`/users/${userId}`}
        className="btn btn-light btn-sm"
        title="View"
      >
        <span className="fs-18 align-middle">👁️</span>
      </Link>
      <Link
        to={`/users/${userId}/edit`}
        className="btn btn-soft-primary btn-sm"
        title="Edit"
      >
        <span className="fs-18 align-middle">✏️</span>
      </Link>
      <button
        className="btn btn-soft-danger btn-sm"
        title="Delete"
        onClick={onDelete}
      >
        <span className="fs-18 align-middle">🗑️</span>
      </button>
    </div>
  );
}

export default UserActions;
