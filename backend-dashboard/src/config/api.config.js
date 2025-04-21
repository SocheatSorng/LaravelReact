/**
 * API Configuration
 *
 * This file contains API configuration values.
 * NOTE: This file should be added to .gitignore to avoid committing sensitive information
 */

// API Base URL
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// API Key - should be loaded from env variable in production
export const API_KEY =
  process.env.REACT_APP_API_KEY ||
  "oNm9RNFaejpw0W8MWGtjfPC1tFFJsx7rPVvM5zqPcevnOom86M2RSGcyVmv5";

// Default request timeout in milliseconds
export const API_TIMEOUT = 10000;

// Default headers for API requests
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Requested-With": "XMLHttpRequest",
  "X-API-Key": API_KEY,
};

/**
 * Get headers for direct axios calls
 * This ensures API key is included in direct axios calls
 */
export const getApiHeaders = () => {
  return {
    "X-API-Key": API_KEY,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
};

export default {
  API_BASE_URL,
  API_KEY,
  API_TIMEOUT,
  DEFAULT_HEADERS,
  getApiHeaders,
};
