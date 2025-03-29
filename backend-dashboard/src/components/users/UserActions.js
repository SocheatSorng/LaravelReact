import React from 'react';

function UserActions() {
  return (
    <div className="d-flex gap-2">
      <button className="btn btn-light btn-sm" title="View">
        <span className="fs-18 align-middle">👁️</span>
      </button>
      <button className="btn btn-soft-primary btn-sm" title="Edit">
        <span className="fs-18 align-middle">✏️</span>
      </button>
      <button className="btn btn-soft-danger btn-sm" title="Delete">
        <span className="fs-18 align-middle">🗑️</span>
      </button>
    </div>
  );
}

export default UserActions;