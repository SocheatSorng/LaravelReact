import React, { useState, useEffect } from "react";
import StatCard from "../components/common/StatCard";
import SearchBar from "../components/common/SearchBar";
import UserTableHeader from "../components/users/UserTableHeader";
import UserTableBody from "../components/users/UserTableBody";
import UserPagination from "../components/users/UserPagination";
import { userService } from "../services/api";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    sort_by: "CreatedAt",
    sort_direction: "desc",
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.current_page, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Call the updated getUsers method with individual parameters
      const response = await userService.getUsers(
        pagination.current_page,
        pagination.per_page,
        filters.search
      );

      if (response.success) {
        setUsers(response.data.data || []);
        setPagination({
          current_page: response.data.current_page,
          per_page: response.data.per_page,
          total: response.data.total,
        });
      } else {
        setError(response.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Error fetching users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters({
      ...filters,
      search: searchTerm,
    });
    // Reset to first page when searching
    setPagination({
      ...pagination,
      current_page: 1,
    });
  };

  const handlePageChange = (page) => {
    setPagination({
      ...pagination,
      current_page: page,
    });
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await userService.deleteUser(userId);

        if (response.success) {
          // Refresh the user list
          fetchUsers();
        } else {
          setError(response.message || "Failed to delete user");
        }
      } catch (err) {
        console.error("Error deleting user:", err);
        setError("Failed to delete user. Please try again later.");
      }
    }
  };

  return (
    <div className="container-xxl">
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="fw-bold py-3 mb-2">User Management</h4>
        </div>
      </div>

      <div className="row mb-4">
        <StatCard
          title="All Users"
          count={pagination.total.toString()}
          icon="👥"
          trend={{
            value: "10%",
            isPositive: true,
          }}
        />
        <StatCard
          title="Admin Users"
          count="5"
          icon="🔑"
          trend={{
            value: "0%",
            isPositive: true,
          }}
        />
        <StatCard
          title="New Users (Last 30 Days)"
          count="12"
          icon="🆕"
          trend={{
            value: "8.1%",
            isPositive: true,
          }}
        />
        <StatCard
          title="Active Users"
          count={pagination.total.toString()}
          icon="✅"
          trend={{
            value: "5.9%",
            isPositive: true,
          }}
        />
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <SearchBar onSearch={handleSearch} placeholder="Search users..." />
            <button
              className="btn btn-primary"
              onClick={() => (window.location.href = "/users/create")}
            >
              Add New User
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="d-flex card-header justify-content-between align-items-center">
              <h4 className="card-title">All Users</h4>
              <div className="dropdown">
                <button
                  className="dropdown-toggle btn btn-sm btn-outline-light rounded"
                  data-bs-toggle="dropdown"
                >
                  Filter by Role
                </button>
                <div className="dropdown-menu dropdown-menu-end">
                  <a
                    href="#!"
                    className="dropdown-item"
                    onClick={() => setFilters({ ...filters, role: "" })}
                  >
                    All
                  </a>
                  <a
                    href="#!"
                    className="dropdown-item"
                    onClick={() => setFilters({ ...filters, role: "admin" })}
                  >
                    Admin
                  </a>
                  <a
                    href="#!"
                    className="dropdown-item"
                    onClick={() => setFilters({ ...filters, role: "user" })}
                  >
                    User
                  </a>
                </div>
              </div>
            </div>
            <div>
              {error && <div className="alert alert-danger m-3">{error}</div>}
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover table-centered">
                  <UserTableHeader />
                  {loading ? (
                    <tbody>
                      <tr>
                        <td colSpan="9" className="text-center">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <UserTableBody users={users} onDelete={handleDeleteUser} />
                  )}
                </table>
              </div>
            </div>
            <div className="card-footer">
              <UserPagination
                showing={users.length}
                total={pagination.total}
                currentPage={pagination.current_page}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
