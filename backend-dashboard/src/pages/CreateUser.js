import React from "react";
import { Link } from "react-router-dom";
import UserForm from "../components/users/UserForm";

function CreateUser() {
  return (
    <div className="container-xxl">
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="fw-bold py-3 mb-2">User Management</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb breadcrumb-style1">
              <li className="breadcrumb-item">
                <Link to="/users">Users</Link>
              </li>
              <li className="breadcrumb-item active">Create User</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <UserForm isEditing={false} />
        </div>
      </div>
    </div>
  );
}

export default CreateUser;
