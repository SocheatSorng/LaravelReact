import React from "react";
import { Container, Typography, Box, Paper, Divider } from "@mui/material";
import ApiKeyManager from "../components/common/ApiKeyManager";

const Settings = () => {
  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate and manage your API keys
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          API Key Generator
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body2" color="text.secondary" paragraph>
          Generate your API key instantly using our secure endpoint. The key
          will be required for making API requests.
        </Typography>

        <ApiKeyManager />
      </Paper>
    </Container>
  );
};

export default Settings;
