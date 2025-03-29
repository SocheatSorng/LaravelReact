import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bookService, bookDetailService } from "../../services/api";

function BookDetailForm({ bookId }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookInfo, setBookInfo] = useState(null);
  const [formData, setFormData] = useState({
    ISBN10: "",
    ISBN13: "",
    Publisher: "",
    PublishYear: "",
    Edition: "",
    PageCount: "",
    Language: "",
    Format: "",
    Dimensions: "",
    Weight: "",
    Description: "",
  });
  const [detailId, setDetailId] = useState(null);

  // Fetch book and book detail data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch book data to show title and author
        const bookResponse = await bookService.getBook(bookId);
        setBookInfo(bookResponse.data.data);

        // Fetch book detail data
        try {
          const detailResponse = await bookDetailService.getByBookId(bookId);

          if (detailResponse.data && detailResponse.data.data) {
            const detailData = detailResponse.data.data;
            setDetailId(detailData.DetailID);

            // Set form data with existing values
            setFormData({
              ISBN10: detailData.ISBN10 || "",
              ISBN13: detailData.ISBN13 || "",
              Publisher: detailData.Publisher || "",
              PublishYear: detailData.PublishYear || "",
              Edition: detailData.Edition || "",
              PageCount: detailData.PageCount || "",
              Language: detailData.Language || "",
              Format: detailData.Format || "",
              Dimensions: detailData.Dimensions || "",
              Weight: detailData.Weight || "",
              Description: detailData.Description || "",
            });
          }
        } catch (detailError) {
          console.log(
            "No existing book details found, will create new ones on save"
          );
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load book data. Please try again.");
        setLoading(false);
      }
    };

    if (bookId) {
      fetchData();
    }
  }, [bookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");

    try {
      // Prepare data - handle correct types
      const processedData = {
        BookID: bookId,
      };

      // Process all fields with correct types
      if (formData.ISBN10 !== undefined) processedData.ISBN10 = formData.ISBN10;
      if (formData.ISBN13 !== undefined) processedData.ISBN13 = formData.ISBN13;
      if (formData.Publisher !== undefined)
        processedData.Publisher = formData.Publisher;
      if (formData.Edition !== undefined)
        processedData.Edition = formData.Edition;
      if (formData.Language !== undefined)
        processedData.Language = formData.Language;
      if (formData.Format !== undefined) processedData.Format = formData.Format;
      if (formData.Dimensions !== undefined)
        processedData.Dimensions = formData.Dimensions;
      if (formData.Description !== undefined)
        processedData.Description = formData.Description;

      // Handle numeric values
      if (formData.PublishYear !== undefined && formData.PublishYear !== "") {
        processedData.PublishYear = parseInt(formData.PublishYear);
      }

      if (formData.PageCount !== undefined && formData.PageCount !== "") {
        processedData.PageCount = parseInt(formData.PageCount);
      }

      if (formData.Weight !== undefined && formData.Weight !== "") {
        processedData.Weight = parseFloat(formData.Weight);
      }

      console.log("Submitting book detail data:", processedData);

      let response;

      if (detailId) {
        // Update existing book detail
        console.log(`Updating book detail with ID ${detailId}`);
        response = await bookDetailService.updateBookDetail(
          detailId,
          processedData
        );
      } else {
        // Create new book detail
        console.log("Creating new book detail");
        response = await bookDetailService.createBookDetail(processedData);
      }

      console.log("API response:", response);

      alert("Book details saved successfully!");
      navigate("/products");
    } catch (error) {
      console.error("Error saving book details:", error);
      setError(
        error.response?.data?.message ||
          "Failed to save book details. Please try again."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {bookInfo && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Book Information</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={bookInfo.Title}
                    disabled
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Author</label>
                  <input
                    type="text"
                    className="form-control"
                    value={bookInfo.Author}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h5>Book Details</h5>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">ISBN-10</label>
                <input
                  type="text"
                  className="form-control"
                  name="ISBN10"
                  value={formData.ISBN10}
                  onChange={handleChange}
                  maxLength="10"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">ISBN-13</label>
                <input
                  type="text"
                  className="form-control"
                  name="ISBN13"
                  value={formData.ISBN13}
                  onChange={handleChange}
                  maxLength="17"
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Publisher</label>
                <input
                  type="text"
                  className="form-control"
                  name="Publisher"
                  value={formData.Publisher}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Publish Year</label>
                <input
                  type="number"
                  className="form-control"
                  name="PublishYear"
                  value={formData.PublishYear}
                  onChange={handleChange}
                  min="1800"
                  max={new Date().getFullYear() + 1}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Format</label>
                <select
                  className="form-select"
                  name="Format"
                  value={formData.Format}
                  onChange={handleChange}
                >
                  <option value="">Select Format</option>
                  <option value="Hardcover">Hardcover</option>
                  <option value="Paperback">Paperback</option>
                  <option value="Ebook">Ebook</option>
                  <option value="Audiobook">Audiobook</option>
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Page Count</label>
                <input
                  type="number"
                  className="form-control"
                  name="PageCount"
                  value={formData.PageCount}
                  onChange={handleChange}
                  min="1"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Language</label>
                <input
                  type="text"
                  className="form-control"
                  name="Language"
                  value={formData.Language}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Edition</label>
                <input
                  type="text"
                  className="form-control"
                  name="Edition"
                  value={formData.Edition}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Weight (g)</label>
                <input
                  type="number"
                  className="form-control"
                  name="Weight"
                  value={formData.Weight}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Dimensions</label>
                <input
                  type="text"
                  className="form-control"
                  name="Dimensions"
                  value={formData.Dimensions}
                  onChange={handleChange}
                  placeholder="e.g. 5.5 x 8.5 x 0.75 inches"
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>
        </div>
        <div className="card-footer">
          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/products")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitLoading}
            >
              {submitLoading ? "Saving..." : "Save Details"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default BookDetailForm;
