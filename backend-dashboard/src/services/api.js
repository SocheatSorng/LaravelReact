import axios from "axios";

// Check if we're running in development or production
const isDevelopment = process.env.NODE_ENV === "development";

// Try to get the API URL from localStorage first
const localStorageUrl = localStorage.getItem("api_url");

// The API URL - with fallbacks
const API_URL =
  localStorageUrl ||
  process.env.REACT_APP_API_URL ||
  (isDevelopment ? "http://localhost:8000/api" : "/api");

console.log("Using API URL:", API_URL);

// Create axios instance with configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  // Disable withCredentials as it might cause CORS issues
  withCredentials: false,
  timeout: 10000, // Set a timeout for requests
});

// Request interceptor for logging and handling
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(
      `API Response: ${
        response.status
      } - ${response.config.method.toUpperCase()} ${response.config.url}`
    );
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`API Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error("API No Response Error:", error.request);
    } else {
      console.error("API Setup Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export const orderService = {
  // Get all orders with optional filters
  getOrders: async (params = {}) => {
    try {
      // Clean up params to remove undefined/null values
      const cleanParams = {};
      Object.keys(params).forEach((key) => {
        if (
          params[key] !== undefined &&
          params[key] !== null &&
          params[key] !== ""
        ) {
          cleanParams[key] = params[key];
        }
      });

      console.log("Sending cleaned params to API:", cleanParams);
      return await api.get("/orders", { params: cleanParams });
    } catch (error) {
      console.warn("API call failed, checking if we should use mock data");
      // If useMockData is set in localStorage, return mock data
      if (localStorage.getItem("useMockData") === "true") {
        console.log("Using mock data for orders");
        return {
          data: {
            data: generateMockOrders(10),
            total: 10,
            current_page: params.page || 1,
            per_page: params.per_page || 10,
          },
        };
      }
      throw error; // Re-throw if not using mock data
    }
  },

  // Get a single order by ID
  getOrder: (id) => {
    return api.get(`/orders/${id}`);
  },

  // Create a new order
  createOrder: (orderData) => {
    return api.post("/orders", orderData);
  },

  // Update an existing order
  updateOrder: (id, orderData) => {
    return api.put(`/orders/${id}`, orderData);
  },

  // Delete an order
  deleteOrder: (id) => {
    return api.delete(`/orders/${id}`);
  },
};

// Helper function to generate mock orders for testing
function generateMockOrders(count = 10) {
  return Array.from({ length: count }, (_, i) => ({
    OrderID: i + 1,
    OrderDate: new Date().toISOString(),
    UserID: 1,
    TotalAmount: Math.round(Math.random() * 1000) + 10,
    Status: ["pending", "processing", "shipped", "delivered", "cancelled"][
      Math.floor(Math.random() * 5)
    ],
    ShippingAddress: "123 Test Street",
    PaymentMethod: "PayPal",
    user: {
      FirstName: "Test",
      LastName: "User",
    },
    order_details: [],
  }));
}

export default api;
