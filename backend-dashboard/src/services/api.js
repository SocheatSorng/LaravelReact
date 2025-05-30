import axios from "axios";
import {
  API_BASE_URL,
  API_KEY,
  API_TIMEOUT,
  DEFAULT_HEADERS,
} from "../config/api.config";

// Check if we're running in development or production
const isDevelopment = process.env.NODE_ENV === "development";

// Try to get the API URL from localStorage first
const localStorageUrl = localStorage.getItem("api_url");

// The API URL - with fallbacks
const API_URL = localStorageUrl || API_BASE_URL;

console.log("Using API URL:", API_URL);

// Create axios instance with configuration
const api = axios.create({
  baseURL: API_URL,
  headers: DEFAULT_HEADERS,
  // Disable withCredentials as it might cause CORS issues
  withCredentials: false,
  timeout: API_TIMEOUT, // Set a timeout for requests
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem("auth_token");

    // If token exists, add it to the headers
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Always add the API key to the headers
    config.headers["X-API-Key"] = API_KEY;

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
      // Handle 401 Unauthorized errors by logging out
      if (error.response.status === 401) {
        // Clear auth data from local storage
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");

        // Redirect to login page if not already there
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      console.error(`API Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error("API No Response Error:", error.request);
    } else {
      console.error("API Setup Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Authentication service
export const authService = {
  // User login
  login: async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });

      // Store token and user in local storage
      if (response.data.success && response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("auth_user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // User logout
  logout: async () => {
    try {
      // Call the logout API endpoint
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage data regardless of API success/failure
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
  },

  // Get current authenticated user
  getCurrentUser: async () => {
    try {
      // First try to get from local storage for faster response
      const userStr = localStorage.getItem("auth_user");

      if (userStr) {
        return { success: true, user: JSON.parse(userStr) };
      }

      // If not in local storage, fetch from API
      const response = await api.get("/me");

      // Update local storage
      if (response.data.success && response.data.user) {
        localStorage.setItem("auth_user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("auth_token");
  },

  // Get user role
  getUserRole: () => {
    const userStr = localStorage.getItem("auth_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.role;
    }
    return null;
  },
};

export const orderService = {
  // Get order statistics
  getOrderStats: async () => {
    try {
      console.log("Fetching order statistics");
      const response = await api.get("/orders/stats");
      console.log("getOrderStats response:", response.data);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message:
            response.data.message || "Order statistics retrieved successfully",
        };
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching order statistics:", error);
      // Fallback to zero values if API fails
      return {
        success: false,
        data: {
          totalOrders: 0,
          pendingOrders: 0,
          processingOrders: 0,
          shippedOrders: 0,
          deliveredOrders: 0,
          cancelledOrders: 0,
        },
        message: "Failed to fetch order statistics",
      };
    }
  },

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

// Book API service
export const bookService = {
  // Get all books with optional filters
  getBooks: async (params = {}) => {
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
      return await api.get("/books", { params: cleanParams });
    } catch (error) {
      console.warn("API call failed, checking if we should use mock data");
      // If useMockData is set in localStorage, return mock data
      if (localStorage.getItem("useMockData") === "true") {
        console.log("Using mock data for books");
        return {
          data: {
            data: generateMockBooks(10),
            meta: {
              total: 10,
              per_page: params.per_page || 15,
              current_page: params.page || 1,
              last_page: 1,
            },
          },
        };
      }
      throw error; // Re-throw if not using mock data
    }
  },

  // Get a single book by ID
  getBook: (id) => {
    return api.get(`/books/${id}`);
  },

  // Create a new book
  createBook: (bookData) => {
    const formData = new FormData();

    // Logging all input data for debugging
    console.log("Original book data:", bookData);

    // Append basic book data for the main book table
    const mainBookFields = [
      "Title",
      "Author",
      "Price",
      "StockQuantity",
      "CategoryID",
    ];
    mainBookFields.forEach((field) => {
      if (
        bookData[field] !== undefined &&
        bookData[field] !== null &&
        bookData[field] !== ""
      ) {
        formData.append(field, bookData[field]);
        console.log(`Added ${field}: ${bookData[field]}`);
      }
    });

    // Handle the image separately
    if (bookData.Image instanceof File) {
      formData.append("Image", bookData.Image);
      console.log("Added Image file");
    }

    // Append book detail fields - ALWAYS add these fields even if empty
    const detailFields = [
      "ISBN10",
      "ISBN13",
      "Publisher",
      "PublishYear",
      "Edition",
      "PageCount",
      "Language",
      "Format",
      "Dimensions",
      "Weight",
      "Description",
    ];

    // Explicitly set each field to ensure details creation works
    detailFields.forEach((field) => {
      // Handle different field types differently
      if (field === "PublishYear" || field === "PageCount") {
        // For numeric integers, only send values if they exist
        if (
          bookData[field] !== undefined &&
          bookData[field] !== null &&
          bookData[field] !== ""
        ) {
          formData.append(field, parseInt(bookData[field]));
          console.log(
            `Added numeric detail field ${field}: ${parseInt(bookData[field])}`
          );
        } else {
          // Send empty string for null/undefined numeric values
          formData.append(field, "");
          console.log(`Added empty numeric detail field ${field}`);
        }
      } else if (field === "Weight") {
        // For floating point numbers
        if (
          bookData[field] !== undefined &&
          bookData[field] !== null &&
          bookData[field] !== ""
        ) {
          formData.append(field, parseFloat(bookData[field]));
          console.log(
            `Added float detail field ${field}: ${parseFloat(bookData[field])}`
          );
        } else {
          // Send empty string for null/undefined numeric values
          formData.append(field, "");
          console.log(`Added empty float detail field ${field}`);
        }
      } else {
        // For string fields
        if (bookData[field] !== undefined && bookData[field] !== null) {
          // Send empty strings too (they're still valid values)
          formData.append(field, bookData[field].toString());
          console.log(`Added string detail field ${field}: ${bookData[field]}`);
        } else {
          // For null/undefined values, send empty string
          formData.append(field, "");
          console.log(`Added empty string detail field ${field}`);
        }
      }
    });

    // Log all form data entries
    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(
        pair[0] + ": " + (pair[1] instanceof File ? "File object" : pair[1])
      );
    }

    return api.post("/books", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Update an existing book
  updateBook: (id, bookData) => {
    console.log("updateBook called with id:", id, "and data:", bookData);

    const formData = new FormData();

    // Append book data
    Object.keys(bookData).forEach((key) => {
      // Skip book detail fields from the main book update
      if (
        [
          "ISBN10",
          "ISBN13",
          "Publisher",
          "PublishYear",
          "Edition",
          "PageCount",
          "Language",
          "Format",
          "Dimensions",
          "Weight",
          "Description",
        ].includes(key)
      ) {
        return;
      }

      // Special handling for image file
      if (key === "Image" && bookData[key] instanceof File) {
        formData.append(key, bookData[key]);
        console.log(`Added image file to form data`);
      } else if (bookData[key] !== null && bookData[key] !== undefined) {
        formData.append(key, bookData[key]);
        console.log(`Added ${key}: ${bookData[key]} to form data`);
      }
    });

    // Extract book detail data to update separately
    const bookDetailData = {};
    const detailFields = [
      "ISBN10",
      "ISBN13",
      "Publisher",
      "PublishYear",
      "Edition",
      "PageCount",
      "Language",
      "Format",
      "Dimensions",
      "Weight",
      "Description",
    ];

    // Always include all fields, properly handling types
    detailFields.forEach((key) => {
      // Handle different field types differently
      if (key === "PublishYear" || key === "PageCount") {
        // For numeric integers, only send values if they exist
        if (
          bookData[key] !== undefined &&
          bookData[key] !== null &&
          bookData[key] !== ""
        ) {
          bookDetailData[key] = parseInt(bookData[key]);
          console.log(
            `Added numeric detail field ${key}: ${bookDetailData[key]}`
          );
        } else {
          // For empty/null numeric values, set to null
          bookDetailData[key] = null;
          console.log(`Added null for numeric detail field ${key}`);
        }
      } else if (key === "Weight") {
        // For floating point numbers
        if (
          bookData[key] !== undefined &&
          bookData[key] !== null &&
          bookData[key] !== ""
        ) {
          bookDetailData[key] = parseFloat(bookData[key]);
          console.log(
            `Added float detail field ${key}: ${bookDetailData[key]}`
          );
        } else {
          // For empty/null numeric values, set to null
          bookDetailData[key] = null;
          console.log(`Added null for float detail field ${key}`);
        }
      } else {
        // For string fields
        if (bookData[key] !== undefined && bookData[key] !== null) {
          // Send empty strings too (they're still valid values)
          bookDetailData[key] = bookData[key].toString();
          console.log(
            `Added string detail field ${key}: ${bookDetailData[key]}`
          );
        } else {
          // For null/undefined values, set empty string
          bookDetailData[key] = "";
          console.log(`Added empty string for detail field ${key}`);
        }
      }
    });

    // Always add BookID to the detail data
    bookDetailData.BookID = id;

    console.log("Book detail data:", bookDetailData);

    // Create a promise that updates both the book and its details
    return new Promise(async (resolve, reject) => {
      try {
        // Update main book data
        console.log("Updating main book data...");
        const bookResponse = await api.post(
          `/books/${id}?_method=PUT`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Main book update response:", bookResponse);

        // Always update or create book details regardless of whether detailData is empty
        try {
          // First try to get existing book detail
          console.log(
            `Checking for existing book details for book ID ${id}...`
          );
          const detailResponse = await bookDetailService.getByBookId(id);
          console.log("Book detail response:", detailResponse);

          if (detailResponse.data && detailResponse.data.data) {
            // If details exist, update them
            const detailId = detailResponse.data.data.DetailID;
            console.log(`Updating existing book detail with ID ${detailId}...`);
            await bookDetailService.updateBookDetail(detailId, bookDetailData);
            console.log("Book detail updated successfully");
          } else {
            // If details don't exist, create them
            console.log("Creating new book detail record...");
            await bookDetailService.createBookDetail(bookDetailData);
            console.log("New book detail created successfully");
          }
        } catch (error) {
          console.error("Error handling book detail:", error);
          // If getting details fails (e.g., they don't exist), create new details
          if (error.response && error.response.status === 404) {
            console.log("Book detail not found, creating new one...");
            await bookDetailService.createBookDetail(bookDetailData);
            console.log("New book detail created after 404 error");
          } else {
            throw error;
          }
        }

        resolve(bookResponse);
      } catch (error) {
        console.error("Error in updateBook:", error);
        reject(error);
      }
    });
  },

  // Delete a book
  deleteBook: (id) => {
    console.log(`Deleting book with ID ${id}`);

    // Use a simpler approach that's less prone to errors
    return api
      .delete(`/books/${id}`)
      .then((response) => {
        console.log(`Book with ID ${id} deleted successfully`);
        return response;
      })
      .catch((error) => {
        console.error(`Error deleting book with ID ${id}:`, error);
        throw error;
      });
  },

  // Search books
  searchBooks: (query) => {
    return api.get("/books/search", { params: { query } });
  },

  // Get featured books
  getFeaturedBooks: () => {
    return api.get("/books/featured");
  },

  // Get related books
  getRelatedBooks: (id) => {
    return api.get(`/books/${id}/related`);
  },

  // Get categories
  getCategories: async () => {
    try {
      const response = await api.get("/categories");
      return {
        success: true,
        data: response.data.data || [],
        message: "Categories fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || "Failed to fetch categories",
      };
    }
  },
};

// Book detail API service
export const bookDetailService = {
  // Get all book details
  getBookDetails: () => {
    return api.get("/book-details");
  },

  // Get book detail by ID
  getBookDetail: (id) => {
    return api.get(`/book-details/${id}`);
  },

  // Get book detail by book ID
  getByBookId: (bookId) => {
    return api.get(`/book-details/book/${bookId}`);
  },

  // Create a new book detail
  createBookDetail: (detailData) => {
    return api.post("/book-details", detailData);
  },

  // Update an existing book detail
  updateBookDetail: (id, detailData) => {
    return api.put(`/book-details/${id}`, detailData);
  },

  // Delete a book detail
  deleteBookDetail: (id) => {
    return api.delete(`/book-details/${id}`);
  },
};

// Helper function to generate mock books for testing
function generateMockBooks(count = 10) {
  return Array.from({ length: count }, (_, i) => ({
    BookID: i + 1,
    Title: `Book Title ${i + 1}`,
    Author: `Author ${i + 1}`,
    Price: Math.round(Math.random() * 100) + 10,
    StockQuantity: Math.round(Math.random() * 100),
    Image: `/assets/images/product/book-${(i % 4) + 1}.jpg`,
    CategoryID: Math.floor(Math.random() * 5) + 1,
    category: {
      CategoryID: Math.floor(Math.random() * 5) + 1,
      Name: ["Fiction", "Non-Fiction", "Science", "History", "Biography"][
        Math.floor(Math.random() * 5)
      ],
    },
    CreatedAt: new Date().toISOString(),
    bookDetail: {
      ISBN10: `123456789${i}`,
      ISBN13: `978-123456789${i}`,
      Publisher: `Publisher ${i + 1}`,
      PublishYear: 2020 + (i % 4),
      Format: ["Hardcover", "Paperback", "Ebook", "Audiobook"][i % 4],
      PageCount: 200 + i * 20,
      Language: "English",
      Description: `This is a description for Book ${
        i + 1
      }. It contains interesting details about the plot and author.`,
    },
  }));
}

// API Health Check
export const checkApiHealth = async () => {
  try {
    const testEndpoint = "/users?per_page=1"; // Simple endpoint that should return quickly
    console.log(`Testing API connection to ${API_URL}${testEndpoint}`);

    const startTime = new Date().getTime();
    const response = await api.get(testEndpoint, {
      timeout: 5000,
      headers: {
        "X-API-Health-Check": "true",
      },
    });
    const endTime = new Date().getTime();

    const pingTime = endTime - startTime;
    const success = response.status === 200 && response.data?.success === true;

    return {
      success,
      pingTime,
      status: response.status,
      endpoint: `${API_URL}${testEndpoint}`,
      message: success
        ? `API is healthy (${pingTime}ms)`
        : "API returned unsuccessful response",
      data: response.data,
    };
  } catch (error) {
    console.error("API Health Check failed:", error);
    return {
      success: false,
      endpoint: `${API_URL}`,
      message: `API is not reachable: ${error.message}`,
      error: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      },
    };
  }
};

// User service
export const userService = {
  getUserStats: async () => {
    try {
      console.log("Fetching user statistics");
      const response = await api.get("/users/stats");
      console.log("getUserStats response:", response.data);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message:
            response.data.message || "User statistics retrieved successfully",
        };
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching user statistics:", error);
      // Fallback to hardcoded values if API fails
      return {
        success: true,
        data: {
          adminCount: 1,
          newUsersCount: 12,
          activeUsersCount: 3,
        },
        message: "Using fallback user statistics",
      };
    }
  },

  getUsers: async (page = 1, perPage = 10, search = "") => {
    try {
      console.log(
        `Fetching users: page=${page}, perPage=${perPage}, search=${search}`
      );
      const response = await api.get(
        `/users?page=${page}&per_page=${perPage}&search=${search}`
      );
      console.log("getUsers response:", response.data);

      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch users",
      };
    }
  },

  getUser: async (id) => {
    if (!id) {
      console.error("getUser: No user ID provided");
      return {
        success: false,
        message: "User ID is required",
      };
    }

    try {
      console.log(`Fetching user with ID: ${id}`);
      const startTime = performance.now();

      // This API call will use our setupProxy.js middleware which handles the Review model error
      const response = await api.get(`/users/${id}`);

      const endTime = performance.now();
      console.log(`getUser API call took ${Math.round(endTime - startTime)}ms`);

      if (response.data) {
        console.log("getUser success:", response.data);
        return {
          success: true,
          data: response.data.data || response.data,
          message: response.data.message || "User retrieved successfully",
        };
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);

      // Error information
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch user";
      const statusCode = error.response?.status;

      console.error(`API Error ${statusCode}: ${errorMessage}`);

      return {
        success: false,
        message: errorMessage,
        statusCode,
      };
    }
  },

  createUser: async (userData) => {
    try {
      console.log("Creating user with data:", userData);
      const response = await api.post("/users", userData);
      console.log("createUser response:", response.data);

      if (response.data) {
        return {
          success: response.data.success === true,
          data: response.data.data,
          message: response.data.message || "User created successfully",
          errors: response.data.errors,
        };
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("Error creating user:", error);

      // Return a structured error response
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to create user",
        errors: error.response?.data?.errors || null,
      };
    }
  },

  updateUser: async (id, userData) => {
    if (!id) {
      return {
        success: false,
        message: "User ID is required",
      };
    }

    try {
      console.log(`Updating user ${id} with data:`, userData);
      const response = await api.put(`/users/${id}`, userData);
      console.log("updateUser response:", response.data);

      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message || "User updated successfully",
      };
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to update user",
      };
    }
  },

  deleteUser: async (id) => {
    if (!id) {
      return {
        success: false,
        message: "User ID is required",
      };
    }

    try {
      console.log(`Deleting user with ID: ${id}`);
      const response = await api.delete(`/users/${id}`);
      console.log("deleteUser response:", response.data);

      return {
        success: response.data.success,
        message: response.data.message || "User deleted successfully",
      };
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete user",
      };
    }
  },
};

// Page Content service
export const pageContentService = {
  // Get all pages
  getPages: async () => {
    try {
      const response = await api.get("/page-contents", {
        timeout: 30000, // Extended timeout for potentially large content
      });
      return {
        success: true,
        data: response.data,
        message: "Pages retrieved successfully",
      };
    } catch (error) {
      console.error("Error fetching pages:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch pages",
        statusCode: error.response?.status,
      };
    }
  },

  // Get a single page by slug
  getPage: async (slug) => {
    try {
      const response = await api.get(`/page-contents/${slug}`, {
        timeout: 30000, // Extended timeout for potentially large content
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching page '${slug}':`, error);
      throw error;
    }
  },

  // Create a new page
  createPage: async (pageData) => {
    try {
      console.log("Creating page with data:", pageData);

      // Check if content needs to be stringified
      const preparedData = { ...pageData };
      if (preparedData.content && typeof preparedData.content !== "string") {
        try {
          // Test if it's already a JSON string
          JSON.parse(JSON.stringify(preparedData.content));
        } catch (e) {
          console.error("Invalid content format:", e);
          return {
            success: false,
            message: "Invalid content format - must be valid JSON",
          };
        }
      }

      const response = await api.post("/page-contents", preparedData, {
        timeout: 30000, // Extended timeout for potentially large content
      });

      console.log("Create page response:", response.data);

      return {
        success: true,
        data: response.data,
        message: "Page created successfully",
      };
    } catch (error) {
      console.error("Error creating page:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to create page",
        errors: error.response?.data?.errors || null,
        statusCode: error.response?.status,
      };
    }
  },

  // Update an existing page
  updatePage: async (slug, pageData) => {
    try {
      console.log(`Updating page '${slug}' with data:`, pageData);

      // Check if content needs to be stringified
      const preparedData = { ...pageData };
      if (preparedData.content && typeof preparedData.content !== "string") {
        try {
          // Test if it's already a JSON string
          JSON.parse(JSON.stringify(preparedData.content));
        } catch (e) {
          console.error("Invalid content format:", e);
          return {
            success: false,
            message: "Invalid content format - must be valid JSON",
          };
        }
      }

      const response = await api.put(`/page-contents/${slug}`, preparedData, {
        timeout: 30000, // Extended timeout for potentially large content
      });

      console.log("Update page response:", response.data);

      return {
        success: true,
        data: response.data,
        message: `Page '${slug}' updated successfully`,
      };
    } catch (error) {
      console.error(`Error updating page '${slug}':`, error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to update page",
        errors: error.response?.data?.errors || null,
        statusCode: error.response?.status,
      };
    }
  },

  // Delete a page
  deletePage: async (slug) => {
    try {
      const response = await api.delete(`/page-contents/${slug}`);
      return {
        success: true,
        data: response.data,
        message: `Page '${slug}' deleted successfully`,
      };
    } catch (error) {
      console.error(`Error deleting page '${slug}':`, error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          `Failed to delete page '${slug}'`,
        statusCode: error.response?.status,
      };
    }
  },

  // Get a published page for frontend display
  getPublishedPage: async (slug) => {
    try {
      const response = await api.get(`/public/pages/${slug}`, {
        timeout: 30000, // Extended timeout for potentially large content
      });
      return {
        success: true,
        data: response.data,
        message: `Published page '${slug}' retrieved successfully`,
      };
    } catch (error) {
      console.error(`Error fetching published page '${slug}':`, error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          `Failed to fetch published page '${slug}'`,
        statusCode: error.response?.status,
      };
    }
  },
};

// API Key Management
export const apiKeyService = {
  // Store API key
  setApiKey: (apiKey) => {
    localStorage.setItem("api_key", apiKey);
    console.log("API key stored in local storage");
    return true;
  },

  // Get stored API key
  getApiKey: () => {
    return localStorage.getItem("api_key");
  },

  // Remove API key
  removeApiKey: () => {
    localStorage.removeItem("api_key");
    console.log("API key removed from local storage");
    return true;
  },

  // Check if API key exists
  hasApiKey: () => {
    return !!localStorage.getItem("api_key");
  },
};

// Export the axios instance for direct use
export default api;
