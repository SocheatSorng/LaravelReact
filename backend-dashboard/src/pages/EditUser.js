import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userService, checkApiHealth } from "../services/api";
import { Container, Button, Form, Alert } from "react-bootstrap";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthCheck, setHealthCheck] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`Attempting to fetch user with ID: ${id}`);

        // Check API health first
        const healthStatus = await checkApiHealth();
        setHealthCheck(healthStatus);

        if (!healthStatus.success) {
          throw new Error(`API is not healthy: ${healthStatus.message}`);
        }

        // Fetch user data using the userService, not the default export
        const response = await userService.getUser(id);

        console.log("User data response:", response);

        if (response.success && response.data) {
          setUser(response.data);
          setFormData({
            name: response.data.FirstName + " " + response.data.LastName || "",
            email: response.data.Email || "",
            role: response.data.Role || "",
            password: "", // Empty for security reasons
          });
          setLoading(false);
        } else {
          throw new Error(response.message || "Failed to fetch user data");
        }
      } catch (err) {
        console.error("Error loading user:", err);
        setError(err.message || "An error occurred while loading user data");
        setLoading(false);
      }
    };

    if (id) {
      loadUser();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Extract first name and last name from the name field
      const nameParts = formData.name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Map form fields to Laravel API field names
      const updateData = {
        FirstName: firstName,
        LastName: lastName,
        Email: formData.email,
        Role: formData.role,
      };

      // Only include password if it was changed
      if (formData.password && formData.password.trim() !== "") {
        updateData.Password = formData.password;
      }

      console.log("Sending update data:", updateData);
      const response = await userService.updateUser(id, updateData);

      if (response.success) {
        console.log("User updated successfully:", response.data);
        navigate("/users");
      } else {
        throw new Error(response.message || "Failed to update user");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.message || "An error occurred while updating the user");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/users");
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading user data...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error Loading User</Alert.Heading>
          <p>{error}</p>
          {healthCheck && !healthCheck.success && (
            <p>API Health Check Failed: {healthCheck.message}</p>
          )}

          {/* Add specific message for Review model error */}
          {error.includes && error.includes("App\\Models\\Review") && (
            <Alert variant="warning" className="mt-2">
              <strong>Database Issue:</strong> The Review model is missing in
              the Laravel backend. The system will try to use a fallback method
              to load the user data.
            </Alert>
          )}

          <hr />
          <div className="d-flex justify-content-between">
            <Button variant="outline-danger" onClick={handleCancel}>
              Back to Users List
            </Button>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Edit User</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Leave empty to keep current password"
          />
          <Form.Text className="text-muted">
            Leave blank to keep the current password
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select a role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="editor">Editor</option>
          </Form.Control>
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Form>

      {/* Debug section */}
      <div className="mt-4 text-muted">
        <small>User ID: {id}</small>
        {user && (
          <div className="mt-2">
            <details>
              <summary>Raw User Data (Debug)</summary>
              <pre className="mt-2 p-2 bg-light" style={{ fontSize: "0.8rem" }}>
                {JSON.stringify(user, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </Container>
  );
};

export default EditUser;
