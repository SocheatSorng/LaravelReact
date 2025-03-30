import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/api";

function UserForm({ user, isEditing = false }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    Phone: "",
    Address: "",
    Role: "user",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    console.log("UserForm: isEditing =", isEditing, "user =", user);
    if (isEditing && user) {
      try {
        // For editing mode, populate the form with user data
        // Create a safe copy of user data with default values for missing fields
        const safeUserData = {
          FirstName: user.FirstName || "",
          LastName: user.LastName || "",
          Email: user.Email || "",
          // Don't include password in the form data when editing
          Phone: user.Phone || "",
          Address: user.Address || "",
          Role: user.Role || "user",
          // Keep any other fields that might be needed for API calls
          UserID: user.UserID,
          CreatedAt: user.CreatedAt,
        };

        console.log("Setting form data:", safeUserData);
        setFormData({ ...safeUserData, Password: "" });
      } catch (err) {
        console.error("Error setting form data:", err);
        setServerError("Error loading user data into form");
      }
    }
  }, [isEditing, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear the specific field error when the user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.FirstName.trim()) {
      newErrors.FirstName = "First name is required";
    }

    if (!formData.LastName.trim()) {
      newErrors.LastName = "Last name is required";
    }

    if (!formData.Email.trim()) {
      newErrors.Email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = "Email is invalid";
    }

    if (!isEditing && !formData.Password) {
      // Password is required only for new users
      newErrors.Password = "Password is required";
    } else if (formData.Password && formData.Password.length < 6) {
      // If password is provided (either required or optional), validate it
      newErrors.Password = "Password must be at least 6 characters";
    }

    if (formData.Phone && !/^[0-9+\-\s()]{7,15}$/.test(formData.Phone)) {
      newErrors.Phone = "Phone number is invalid";
    }

    if (!formData.Role) {
      newErrors.Role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      // Create a copy of form data to submit
      const dataToSubmit = { ...formData };

      // If editing and password is empty, remove it from the request
      if (isEditing && !dataToSubmit.Password.trim()) {
        delete dataToSubmit.Password;
      }

      console.log("Submitting form data:", dataToSubmit);
      let response;

      if (isEditing && user && user.UserID) {
        response = await userService.updateUser(user.UserID, dataToSubmit);
      } else {
        response = await userService.createUser(dataToSubmit);
      }

      console.log("Form submission response:", response);

      if (response.success) {
        // Navigate to the users list page on success
        navigate("/users");
      } else {
        // Handle API response errors
        setServerError(response.message || "An error occurred while saving the user");
        
        // If there are validation errors from the backend
        if (response.errors) {
          const serverErrors = {};
          Object.keys(response.errors).forEach(key => {
            serverErrors[key] = Array.isArray(response.errors[key]) 
              ? response.errors[key][0] 
              : response.errors[key];
          });
          setErrors(prev => ({...prev, ...serverErrors}));
        }
      }
    } catch (err) {
      console.error("Error saving user:", err);

      // Try to extract error message from the error response
      const errorMessage = err.response?.data?.message 
        || err.message 
        || "An unexpected error occurred";
        
      setServerError(`Failed to save the user: ${errorMessage}`);

      // Handle validation errors from the server
      if (err.response?.data?.errors) {
        try {
          const serverValidationErrors = {};
          const errorData = err.response.data.errors;
          
          Object.keys(errorData).forEach((key) => {
            serverValidationErrors[key] = Array.isArray(errorData[key])
              ? errorData[key][0]
              : errorData[key];
          });
          
          setErrors(prev => ({...prev, ...serverValidationErrors}));
        } catch (validationErr) {
          console.error("Error processing validation errors:", validationErr);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{isEditing ? "Edit User" : "Create New User"}</h5>
      </div>
      <div className="card-body">
        {serverError && (
          <div className="alert alert-danger" role="alert">
            {serverError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="FirstName" className="form-label">
                First Name *
              </label>
              <input
                type="text"
                id="FirstName"
                name="FirstName"
                className={`form-control ${
                  errors.FirstName ? "is-invalid" : ""
                }`}
                value={formData.FirstName}
                onChange={handleChange}
              />
              {errors.FirstName && (
                <div className="invalid-feedback">{errors.FirstName}</div>
              )}
            </div>
            <div className="col-md-6">
              <label htmlFor="LastName" className="form-label">
                Last Name *
              </label>
              <input
                type="text"
                id="LastName"
                name="LastName"
                className={`form-control ${
                  errors.LastName ? "is-invalid" : ""
                }`}
                value={formData.LastName}
                onChange={handleChange}
              />
              {errors.LastName && (
                <div className="invalid-feedback">{errors.LastName}</div>
              )}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="Email" className="form-label">
                Email *
              </label>
              <input
                type="email"
                id="Email"
                name="Email"
                className={`form-control ${errors.Email ? "is-invalid" : ""}`}
                value={formData.Email}
                onChange={handleChange}
              />
              {errors.Email && (
                <div className="invalid-feedback">{errors.Email}</div>
              )}
            </div>
            <div className="col-md-6">
              <label htmlFor="Phone" className="form-label">
                Phone
              </label>
              <input
                type="text"
                id="Phone"
                name="Phone"
                className={`form-control ${errors.Phone ? "is-invalid" : ""}`}
                value={formData.Phone || ""}
                onChange={handleChange}
              />
              {errors.Phone && (
                <div className="invalid-feedback">{errors.Phone}</div>
              )}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="Password" className="form-label">
                {isEditing
                  ? "Password (leave blank to keep current)"
                  : "Password *"}
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="Password"
                  name="Password"
                  className={`form-control ${
                    errors.Password ? "is-invalid" : ""
                  }`}
                  value={formData.Password || ""}
                  onChange={handleChange}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? "🔒" : "👁️"}
                </button>
                {errors.Password && (
                  <div className="invalid-feedback">{errors.Password}</div>
                )}
              </div>
              <small className="form-text text-muted">
                Password must be at least 6 characters
              </small>
            </div>
            <div className="col-md-6">
              <label htmlFor="Role" className="form-label">
                Role *
              </label>
              <select
                id="Role"
                name="Role"
                className={`form-select ${errors.Role ? "is-invalid" : ""}`}
                value={formData.Role}
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.Role && (
                <div className="invalid-feedback">{errors.Role}</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="Address" className="form-label">
              Address
            </label>
            <textarea
              id="Address"
              name="Address"
              className="form-control"
              rows="3"
              value={formData.Address || ""}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/users")}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserForm;
