import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { userService } from "../services/api";

function ViewUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const response = await userService.getUser(id);

        if (response.data.success) {
          setUser(response.data.data);
        } else {
          setError("Failed to load user data");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await userService.deleteUser(id);
        if (response.data.success) {
          navigate("/users");
        } else {
          setError(response.data.message || "Failed to delete user");
        }
      } catch (err) {
        console.error("Error deleting user:", err);
        setError("Failed to delete user. Please try again later.");
      }
    }
  };

  if (loading) {
    return (
      <div
        className="container-xxl d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container-xxl">
        <div className="alert alert-danger m-4" role="alert">
          {error || "User not found"}
          <div className="mt-3">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/users")}
            >
              Back to Users
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              <li className="breadcrumb-item active">View User</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">User Details</h5>
              <div>
                <Link to={`/users/${id}/edit`} className="btn btn-primary me-2">
                  Edit
                </Link>
                <button onClick={handleDelete} className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-4 text-center">
                  <div className="avatar-xl mb-3 mx-auto bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center">
                    <span style={{ fontSize: "2rem" }}>
                      {user.FirstName?.charAt(0)}
                      {user.LastName?.charAt(0)}
                    </span>
                  </div>
                  <h5>
                    {user.FirstName} {user.LastName}
                  </h5>
                  <span
                    className={`badge ${
                      user.Role === "admin" ? "bg-danger" : "bg-success"
                    } py-1 px-2`}
                  >
                    {user.Role}
                  </span>
                </div>
                <div className="col-md-9">
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <th style={{ width: "30%" }}>User ID</th>
                          <td>{user.UserID}</td>
                        </tr>
                        <tr>
                          <th>Email</th>
                          <td>{user.Email}</td>
                        </tr>
                        <tr>
                          <th>Phone</th>
                          <td>{user.Phone || "-"}</td>
                        </tr>
                        <tr>
                          <th>Address</th>
                          <td>{user.Address || "-"}</td>
                        </tr>
                        <tr>
                          <th>Created At</th>
                          <td>{new Date(user.CreatedAt).toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {user.orders && user.orders.length > 0 ? (
                    <div className="mt-4">
                      <h6>Orders</h6>
                      <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                          <thead>
                            <tr>
                              <th>Order ID</th>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {user.orders.map((order) => (
                              <tr key={order.OrderID}>
                                <td>
                                  <Link to={`/orders/${order.OrderID}`}>
                                    #{order.OrderID}
                                  </Link>
                                </td>
                                <td>
                                  {new Date(
                                    order.OrderDate
                                  ).toLocaleDateString()}
                                </td>
                                <td>
                                  <span
                                    className={`badge bg-${
                                      order.Status === "completed"
                                        ? "success"
                                        : order.Status === "pending"
                                        ? "warning"
                                        : order.Status === "cancelled"
                                        ? "danger"
                                        : "info"
                                    }`}
                                  >
                                    {order.Status}
                                  </span>
                                </td>
                                <td>${order.TotalAmount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/users")}
              >
                Back to Users
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewUser;
