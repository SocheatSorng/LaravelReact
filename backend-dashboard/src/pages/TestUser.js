import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { userService, checkApiHealth } from "../services/api";

const TestUser = () => {
  const [userId, setUserId] = useState("");
  const [result, setResult] = useState(null);
  const [apiHealth, setApiHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const health = await checkApiHealth();
      setApiHealth(health);
      console.log("API Health Check Result:", health);
    } catch (err) {
      setError(err.message || "Failed to check API health");
      console.error("Health check error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchUser = async () => {
    if (!userId.trim()) {
      setError("Please enter a user ID");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log(`Testing userService.getUser with ID: ${userId}`);
      const response = await userService.getUser(userId);
      setResult(response);
      console.log("User API Response:", response);
    } catch (err) {
      setError(err.message || "Error fetching user");
      console.error("Test fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2>User API Test Page</h2>
      <p className="text-muted">
        Use this page to test the user API functionality directly
      </p>

      <Card className="mb-4">
        <Card.Header>API Health Check</Card.Header>
        <Card.Body>
          <Button variant="info" onClick={handleCheckHealth} disabled={loading}>
            {loading ? "Checking..." : "Check API Health"}
          </Button>

          {apiHealth && (
            <div className="mt-3">
              <Alert variant={apiHealth.success ? "success" : "danger"}>
                <strong>Status:</strong>{" "}
                {apiHealth.success ? "Healthy" : "Not Healthy"}
                <br />
                <strong>Message:</strong> {apiHealth.message}
                <br />
                {apiHealth.pingTime && (
                  <>
                    <strong>Ping:</strong> {apiHealth.pingTime}ms
                    <br />
                  </>
                )}
                {apiHealth.endpoint && (
                  <>
                    <strong>Endpoint:</strong> {apiHealth.endpoint}
                    <br />
                  </>
                )}
              </Alert>
            </div>
          )}
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>Test User API</Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>User ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="primary"
            onClick={handleFetchUser}
            disabled={loading}
          >
            {loading ? "Fetching..." : "Fetch User"}
          </Button>

          {error && (
            <Alert variant="danger" className="mt-3">
              <strong>Error:</strong> {error}
            </Alert>
          )}

          {result && (
            <div className="mt-3">
              <Alert variant={result.success ? "success" : "warning"}>
                <strong>API Response:</strong>{" "}
                {result.success ? "Success" : "Failed"}
                <br />
                {result.message && (
                  <>
                    <strong>Message:</strong> {result.message}
                    <br />
                  </>
                )}
              </Alert>

              {result.data && (
                <div className="mt-2">
                  <h5>User Data:</h5>
                  <pre className="p-2 bg-light" style={{ fontSize: "0.8rem" }}>
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TestUser;
