import React, { useState, useEffect } from "react";
import { bookService } from "../../services/api";
import { useNavigate } from "react-router-dom";

const BookForm = ({ bookId }) => {
  const navigate = useNavigate();
  const isEditMode = !!bookId;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    Title: "",
    Author: "",
    Price: "",
    StockQuantity: "",
    CategoryID: "",
    Image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  // Fetch categories and book data if in edit mode
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await bookService.getCategories();
        setCategories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchBookData = async () => {
      if (!isEditMode) return;

      try {
        setLoading(true);
        const response = await bookService.getBook(bookId);
        const bookData = response.data.data;

        // Update form data with just the basic book information
        const updatedFormData = {
          Title: bookData.Title || "",
          Author: bookData.Author || "",
          Price: bookData.Price || "",
          StockQuantity: bookData.StockQuantity || "",
          CategoryID: bookData.CategoryID || "",
        };

        setFormData(updatedFormData);

        // Set image preview if it exists
        if (bookData.Image) {
          // Get direct image URL or pre-signed URL
          setImagePreview(bookData.Image);

          // If the image is from S3, reload it via the getImage endpoint to ensure it's accessible
          if (
            bookData.Image.includes("s3.") ||
            bookData.Image.includes("amazonaws.com")
          ) {
            try {
              // Get a fresh pre-signed URL through our endpoint
              const imageUrl = `${
                process.env.REACT_APP_API_URL || "http://localhost:8000/api"
              }/books/${bookId}/image`;
              setImagePreview(imageUrl);
            } catch (imageError) {
              console.error("Error setting image preview:", imageError);
            }
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching book data:", error);
        setLoading(false);
        setSubmitError("Error loading book data. Please try again.");
      }
    };

    fetchCategories();
    fetchBookData();
  }, [bookId, isEditMode]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      // Create preview for image
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.Title) newErrors.Title = "Title is required";
    if (!formData.Author) newErrors.Author = "Author is required";
    if (!formData.Price) newErrors.Price = "Price is required";
    else if (isNaN(formData.Price) || parseFloat(formData.Price) < 0) {
      newErrors.Price = "Price must be a positive number";
    }

    if (
      formData.StockQuantity &&
      (isNaN(formData.StockQuantity) || parseInt(formData.StockQuantity) < 0)
    ) {
      newErrors.StockQuantity = "Stock quantity must be a non-negative integer";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setSubmitError("");

      // Create a clean data object
      const processedData = {};

      // Process basic book data
      processedData.Title = formData.Title.trim();
      processedData.Author = formData.Author.trim();

      // Make sure numeric values are properly formatted
      processedData.Price = parseFloat(formData.Price);

      if (formData.StockQuantity !== "") {
        processedData.StockQuantity = parseInt(formData.StockQuantity);
      }

      if (formData.CategoryID !== "") {
        processedData.CategoryID = formData.CategoryID;
      }

      // Only include the image if it's a file
      if (formData.Image instanceof File) {
        processedData.Image = formData.Image;
      }

      console.log("Submitting book data:", processedData);

      let response;
      if (isEditMode) {
        console.log(`Updating book ID ${bookId} with data:`, processedData);
        response = await bookService.updateBook(bookId, processedData);
      } else {
        console.log("Creating new book with data:", processedData);
        response = await bookService.createBook(processedData);
      }

      console.log("API response:", response);

      setLoading(false);

      // Redirect back to products page on success
      navigate("/products");
    } catch (error) {
      setLoading(false);
      console.error("Error saving book:", error);

      if (error.response) {
        console.error("Error response:", error.response);

        if (error.response.data && error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else if (error.response.data && error.response.data.message) {
          setSubmitError(`Failed to save book: ${error.response.data.message}`);
        } else {
          setSubmitError(`Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        setSubmitError(
          "No response from server. Please check your connection."
        );
      } else {
        setSubmitError("Failed to save book. Please try again.");
      }
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    navigate("/products");
  };

  if (loading && isEditMode) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">
          {isEditMode ? "Edit Book" : "Add New Book"}
        </h5>
      </div>
      <div className="card-body">
        {submitError && (
          <div className="alert alert-danger mb-3" role="alert">
            <strong>Error:</strong> {submitError}
            <div className="mt-2">
              <small>
                Please check your form inputs and try again. If the problem
                persists, contact support.
              </small>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-8">
              <h6 className="mb-3">Basic Information</h6>

              <div className="mb-3">
                <label htmlFor="Title" className="form-label">
                  Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.Title ? "is-invalid" : ""}`}
                  id="Title"
                  name="Title"
                  value={formData.Title}
                  onChange={handleChange}
                />
                {errors.Title && (
                  <div className="invalid-feedback">{errors.Title}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="Author" className="form-label">
                  Author <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.Author ? "is-invalid" : ""
                  }`}
                  id="Author"
                  name="Author"
                  value={formData.Author}
                  onChange={handleChange}
                />
                {errors.Author && (
                  <div className="invalid-feedback">{errors.Author}</div>
                )}
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="Price" className="form-label">
                      Price <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className={`form-control ${
                        errors.Price ? "is-invalid" : ""
                      }`}
                      id="Price"
                      name="Price"
                      value={formData.Price}
                      onChange={handleChange}
                    />
                    {errors.Price && (
                      <div className="invalid-feedback">{errors.Price}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="StockQuantity" className="form-label">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.StockQuantity ? "is-invalid" : ""
                      }`}
                      id="StockQuantity"
                      name="StockQuantity"
                      value={formData.StockQuantity}
                      onChange={handleChange}
                    />
                    {errors.StockQuantity && (
                      <div className="invalid-feedback">
                        {errors.StockQuantity}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="CategoryID" className="form-label">
                  Category
                </label>
                <select
                  className="form-select"
                  id="CategoryID"
                  name="CategoryID"
                  value={formData.CategoryID}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option
                      key={category.CategoryID}
                      value={category.CategoryID}
                    >
                      {category.Name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="alert alert-info mt-4">
                <strong>Note:</strong> To edit book details (ISBN, publisher,
                dimensions, etc.), please save this basic information first,
                then use the "Edit Details" button from the product list.
              </div>
            </div>

            <div className="col-md-4">
              <h6 className="mb-3">Product Image</h6>
              <div className="mb-3">
                <label htmlFor="Image" className="form-label">
                  Upload Image
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="Image"
                  name="Image"
                  accept="image/*"
                  onChange={handleChange}
                />
                <small className="text-muted d-block">
                  Recommended size: 300x400 pixels
                </small>
                {!isEditMode && (
                  <small className="text-warning d-block mt-1">
                    <strong>Note:</strong> If you encounter upload issues,
                    create the book without an image first, then edit it to add
                    the image.
                  </small>
                )}
              </div>

              {imagePreview && (
                <div className="mt-3 text-center border rounded p-3">
                  <img
                    src={imagePreview}
                    alt="Book cover preview"
                    className="img-fluid"
                    style={{ maxHeight: "300px" }}
                    onError={(e) => {
                      console.error("Error loading image:", e);
                      // If we're in edit mode and the image fails to load, try the getImage endpoint directly
                      if (isEditMode && bookId) {
                        const apiUrl =
                          process.env.REACT_APP_API_URL ||
                          "http://localhost:8000/api";
                        e.target.src = `${apiUrl}/books/${bookId}/image`;
                        e.target.onerror = (e2) => {
                          console.error("Fallback image also failed:", e2);
                          e2.target.src = "/assets/images/placeholder-book.png";
                          e2.target.onerror = null; // Prevent infinite error loop
                        };
                      } else {
                        e.target.src = "/assets/images/placeholder-book.png";
                        e.target.onerror = null; // Prevent infinite error loop
                      }
                    }}
                  />
                  {isEditMode && (
                    <small className="text-muted d-block mt-2">
                      Current image. Upload a new one to replace.
                    </small>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-light"
              onClick={handleCancel}
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
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update Book"
              ) : (
                "Create Book"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
