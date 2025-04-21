import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import StatCard from "../components/common/StatCard";
import { bookService } from "../services/api"; // Import the API service

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // State for form data
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
  });

  // State for the current category being edited/deleted
  const [currentCategory, setCurrentCategory] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [categoriesPerPage] = useState(10);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the API service instead of direct axios call
      const result = await bookService.getCategories();

      if (result.success && Array.isArray(result.data)) {
        setCategories(result.data);
        setTotalCategories(result.data.length);
      } else {
        console.error("Failed to fetch categories:", result.message);
        setError(result.message || "Failed to load categories");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Reset form data
  const resetFormData = () => {
    setFormData({
      Name: "",
      Description: "",
    });
  };

  // Open add modal
  const handleShowAddModal = () => {
    resetFormData();
    setShowAddModal(true);
  };

  // Open edit modal
  const handleShowEditModal = (category) => {
    setCurrentCategory(category);
    setFormData({
      Name: category.Name || "",
      Description: category.Description || "",
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const handleShowDeleteModal = (category) => {
    setCurrentCategory(category);
    setShowDeleteModal(true);
  };

  // Add new category
  const handleAddCategory = async () => {
    try {
      setLoading(true);
      // Replace direct axios call with API that includes headers
      const response = await axios.post(
        "http://localhost:8000/api/categories",
        formData,
        {
          headers: {
            "X-API-Key":
              localStorage.getItem("api_key") ||
              "oNm9RNFaejpw0W8MWGtjfPC1tFFJsx7rPVvM5zqPcevnOom86M2RSGcyVmv5",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (response.data && response.data.success) {
        setShowAddModal(false);
        fetchCategories();
        resetFormData();
      } else {
        setError(
          "Failed to add category: " +
            (response.data.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Error adding category:", err);
      setError("Failed to add category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update category
  const handleUpdateCategory = async () => {
    if (!currentCategory) return;

    try {
      setLoading(true);
      // Replace direct axios call with API that includes headers
      const response = await axios.put(
        `http://localhost:8000/api/categories/${currentCategory.CategoryID}`,
        formData,
        {
          headers: {
            "X-API-Key":
              localStorage.getItem("api_key") ||
              "oNm9RNFaejpw0W8MWGtjfPC1tFFJsx7rPVvM5zqPcevnOom86M2RSGcyVmv5",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (response.data && response.data.success) {
        setShowEditModal(false);
        fetchCategories();
        resetFormData();
      } else {
        setError(
          "Failed to update category: " +
            (response.data.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Error updating category:", err);
      setError("Failed to update category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async () => {
    if (!currentCategory) return;

    try {
      setLoading(true);
      // Replace direct axios call with API that includes headers
      const response = await axios.delete(
        `http://localhost:8000/api/categories/${currentCategory.CategoryID}`,
        {
          headers: {
            "X-API-Key":
              localStorage.getItem("api_key") ||
              "oNm9RNFaejpw0W8MWGtjfPC1tFFJsx7rPVvM5zqPcevnOom86M2RSGcyVmv5",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (response.data && response.data.success) {
        setShowDeleteModal(false);
        fetchCategories();
      } else {
        setError(
          "Failed to delete category: " +
            (response.data.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      setError(
        "Failed to delete category. " +
          (err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate pagination
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  const totalPages = Math.ceil(totalCategories / categoriesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Render pagination component
  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <nav aria-label="Categories pagination">
        <ul className="pagination justify-content-end mb-0">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>

          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`page-item ${currentPage === number ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => paginate(number)}>
                {number}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="container-xxl">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="fw-bold py-3 mb-2">Categories</h4>
        </div>
      </div>

      {/* Statistics */}
      <div className="row mb-4">
        <StatCard title="Total Categories" count={totalCategories} icon="📋" />
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={() => fetchCategories()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="d-flex card-header justify-content-between align-items-center">
              <div>
                <h4 className="card-title">Category List</h4>
              </div>
              <button className="btn btn-primary" onClick={handleShowAddModal}>
                <i className="bi bi-plus-circle me-1"></i> Add Category
              </button>
            </div>

            <div className="table-responsive">
              <table className="table align-middle mb-0 table-hover table-centered">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Books</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  )}

                  {!loading && currentCategories.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No categories found.
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    currentCategories.map((category) => (
                      <tr key={category.CategoryID}>
                        <td>{category.CategoryID}</td>
                        <td>{category.Name}</td>
                        <td>{category.Description || "-"}</td>
                        <td>
                          <span className="badge bg-primary">
                            {category.books_count || 0}
                          </span>
                        </td>
                        <td>
                          {category.CreatedAt
                            ? new Date(category.CreatedAt).toLocaleDateString()
                            : "-"}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-soft-primary btn-sm"
                              title="Edit"
                              onClick={() => handleShowEditModal(category)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-soft-danger btn-sm"
                              title="Delete"
                              onClick={() => handleShowDeleteModal(category)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="card-footer border-top">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted">
                    Showing {currentCategories.length} of {totalCategories}{" "}
                    categories
                  </span>
                </div>
                {renderPagination()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
                placeholder="Enter category name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="Description"
                value={formData.Description}
                onChange={handleInputChange}
                placeholder="Enter category description"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddCategory}
            disabled={!formData.Name || loading}
          >
            {loading ? "Saving..." : "Save Category"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Category Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
                placeholder="Enter category name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="Description"
                value={formData.Description}
                onChange={handleInputChange}
                placeholder="Enter category description"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateCategory}
            disabled={!formData.Name || loading}
          >
            {loading ? "Saving..." : "Update Category"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Category Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete the category "
            {currentCategory?.Name}"?
          </p>
          <p className="text-danger">This action cannot be undone.</p>
          <p>Note: Categories with associated books cannot be deleted.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteCategory}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Category"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Categories;
