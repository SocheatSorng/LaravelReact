import { API_BASE_URL, API_KEY, getApiHeaders } from "../config/api.config";

// Try to get the API URL from localStorage first (in case it was customized)
const localStorageUrl = localStorage.getItem("api_url");

// The API URL - with fallbacks
const API_URL = localStorageUrl || API_BASE_URL;

console.log("Frontend API Service using URL:", API_URL);

/**
 * Get an authenticated image URL
 * This will append the API key as a query parameter for direct image requests
 * @param {string} endpoint - Image endpoint (e.g., 'books/1/image')
 * @returns {string} - Authenticated image URL
 */
export const getImageUrl = (endpoint) => {
  return `${API_URL}/${endpoint.replace(/^\//, "")}?api_key=${API_KEY}`;
};

/**
 * Fetch data from API with proper authorization headers
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - Response data
 */
export const fetchApi = async (endpoint, options = {}) => {
  try {
    const url = `${API_URL}/${endpoint.replace(/^\//, "")}`;

    // Ensure we always have the basic headers structure
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "X-API-Key": API_KEY,
      ...(options.headers || {}),
    };

    // Debug the request
    console.log(`API Request to: ${url}`);
    console.log("Request headers:", headers);
    console.log("Request method:", options.method || "GET");
    if (options.body) {
      console.log("Request body:", options.body);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Always get the response text first
    const responseText = await response.text();

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      console.error(
        "Response headers:",
        Object.fromEntries([...response.headers])
      );
      console.error("Response body:", responseText);

      // Try to parse the error message from the response
      let errorMessage = `HTTP error! Status: ${response.status}`;
      let errorData = null;

      try {
        errorData = JSON.parse(responseText);
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        // Include validation errors if available
        if (errorData.errors) {
          errorMessage +=
            ": " + Object.values(errorData.errors).flat().join(", ");
        }
      } catch (e) {
        // If we can't parse the JSON, just use the raw text
        if (responseText) {
          errorMessage = responseText;
        }
      }

      throw new Error(errorMessage);
    }

    // Parse the successful response
    try {
      return JSON.parse(responseText);
    } catch (e) {
      console.warn("Response is not valid JSON, returning raw text");
      return { success: true, data: responseText };
    }
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

/**
 * GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} - Response data
 */
export const get = (endpoint, options = {}) => {
  return fetchApi(endpoint, {
    method: "GET",
    ...options,
  });
};

/**
 * POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} - Response data
 */
export const post = (endpoint, data, options = {}) => {
  return fetchApi(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    ...options,
  });
};

/**
 * PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} - Response data
 */
export const put = (endpoint, data, options = {}) => {
  return fetchApi(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
    ...options,
  });
};

/**
 * DELETE request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} - Response data
 */
export const del = (endpoint, options = {}) => {
  return fetchApi(endpoint, {
    method: "DELETE",
    ...options,
  });
};

export default {
  fetchApi,
  get,
  post,
  put,
  del,
  getImageUrl,
};
