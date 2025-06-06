/**
 * API Configuration
 *
 * This file contains API configuration values.
 * NOTE: This file should be added to .gitignore to avoid committing sensitive information
 */

// API Base URL
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://13.229.99.101/api";

// API Key - should be loaded from env variable in production
export const API_KEY =
  process.env.REACT_APP_API_KEY ||
  "3EaR78ULtCRLyykSeCENE7E3WStGHqKrFiSppycQwcNj2cLvolcknKemzjnO";

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
 * Get headers for API calls
 * This ensures API key is included in fetch/axios calls
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
