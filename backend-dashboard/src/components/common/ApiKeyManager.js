import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { apiKeyService } from "../../services/api";
import axios from "axios";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const ApiKeyManager = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState(null);
  const [visibleKeys, setVisibleKeys] = useState({});

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      // For now, we'll simulate API keys from local storage
      const existingKey = apiKeyService.getApiKey();
      if (existingKey) {
        setApiKeys([
          {
            id: 1,
            name: "Default API Key",
            key: existingKey,
            active: true,
            created_at: new Date().toISOString(),
          },
        ]);
      } else {
        setApiKeys([]);
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
      showNotification("Failed to fetch API keys", "error");
    } finally {
      setLoading(false);
    }
  };

  const maskApiKey = (key) => {
    if (!key) return "";
    // Show first 5 and last 5 characters, mask the rest
    return key.length > 10
      ? `${key.substring(0, 5)}...${key.substring(key.length - 5)}`
      : key;
  };

  const handleGenerateKey = async () => {
    setLoading(true);

    try {
      // Call the API endpoint to generate a new key
      const response = await axios.get(
        "http://127.0.0.1:8000/api/generate-api-key"
      );

      if (response.data && response.data.success && response.data.data) {
        const newKey = response.data.data.key;
        const newKeyData = {
          id: response.data.data.id || Date.now(),
          name: response.data.data.name || "API Key",
          key: newKey,
          active: true,
          created_at: new Date().toISOString(),
        };

        apiKeyService.setApiKey(newKey);
        setApiKeys((prevKeys) => [...prevKeys, newKeyData]);
        showNotification("API key generated successfully", "success");

        // Show the newly generated key
        setSelectedKey(newKeyData);
        setShowKeyDialog(true);
      } else {
        showNotification("Failed to generate API key", "error");
      }
    } catch (error) {
      console.error("Error generating API key:", error);
      showNotification(
        "Error generating API key: " +
          (error.response?.data?.message || error.message),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveKey = async (keyId) => {
    setLoading(true);

    try {
      // In a real app, we would call the API to delete the key first
      // For now, just remove from local storage and state
      apiKeyService.removeApiKey();
      setApiKeys((prevKeys) => prevKeys.filter((key) => key.id !== keyId));
      showNotification("API key revoked successfully", "success");
    } catch (error) {
      console.error("Error revoking API key:", error);
      showNotification("Failed to revoke API key", "error");
    } finally {
      setLoading(false);
      setDeleteConfirmDialog(false);
    }
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    showNotification("API key copied to clipboard", "success");
  };

  const handleShowKey = (key) => {
    setSelectedKey(key);
    setShowKeyDialog(true);
  };

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const showNotification = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const openDeleteConfirm = (key) => {
    setKeyToDelete(key);
    setDeleteConfirmDialog(true);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmDialog(false);
    setKeyToDelete(null);
  };

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">API Key Management</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateKey}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Generate New API Key
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" paragraph>
            Generate an API key to authenticate requests to the backend API. The
            API key is stored in the database and will be required for all API
            requests.
          </Typography>

          {apiKeys.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>API Key</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiKeys.map((apiKey) => (
                    <TableRow key={apiKey.id}>
                      <TableCell>{apiKey.name}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {visibleKeys[apiKey.id]
                            ? apiKey.key
                            : maskApiKey(apiKey.key)}
                          <IconButton
                            size="small"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                            sx={{ ml: 1 }}
                          >
                            {visibleKeys[apiKey.id] ? (
                              <VisibilityOffIcon fontSize="small" />
                            ) : (
                              <VisibilityIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {new Date(apiKey.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            color: apiKey.active
                              ? "success.main"
                              : "error.main",
                            fontWeight: "medium",
                          }}
                        >
                          {apiKey.active ? "Active" : "Inactive"}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Copy API key">
                          <IconButton onClick={() => handleCopyKey(apiKey.key)}>
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Show API key details">
                          <IconButton onClick={() => handleShowKey(apiKey)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Revoke API key">
                          <IconButton
                            color="error"
                            onClick={() => openDeleteConfirm(apiKey)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body1">
                No API keys found. Generate a new key to get started.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* API Key Details Dialog */}
      <Dialog
        open={showKeyDialog}
        onClose={() => setShowKeyDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>API Key Details</DialogTitle>
        <DialogContent>
          {selectedKey && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                {selectedKey.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Make sure to copy your API key now. You won't be able to see it
                again!
              </Typography>
              <TextField
                label="API Key"
                value={selectedKey.key}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <IconButton onClick={() => handleCopyKey(selectedKey.key)}>
                      <ContentCopyIcon />
                    </IconButton>
                  ),
                }}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Created:</strong>{" "}
                  {new Date(selectedKey.created_at).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color: selectedKey.active ? "green" : "red",
                    }}
                  >
                    {selectedKey.active ? "Active" : "Inactive"}
                  </span>
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowKeyDialog(false)}>Close</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleCopyKey(selectedKey.key);
              setShowKeyDialog(false);
            }}
          >
            Copy & Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmDialog} onClose={closeDeleteConfirm}>
        <DialogTitle>Revoke API Key</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to revoke this API key? This action cannot be
            undone and any services using this key will no longer work.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirm}>Cancel</Button>
          <Button
            color="error"
            onClick={() => keyToDelete && handleRemoveKey(keyToDelete.id)}
            disabled={loading}
          >
            {loading ? "Revoking..." : "Revoke Key"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ApiKeyManager;
