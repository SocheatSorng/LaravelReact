import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { pageContentService } from "../../services/api";

const PageList = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Frontend pages definitions
  const frontendPages = [
    { name: "Blog Page", slug: "blog", color: "#6f42c1" },
    { name: "Shop Page", slug: "shop", color: "#20c997" },
    { name: "About Page", slug: "about", color: "#fd7e14" },
    { name: "Contact Page", slug: "contact", color: "#0dcaf0" }
  ];

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await pageContentService.getPages();
      
      console.log("Pages response:", response);
      
      // Check if the response was successful and contains data
      if (response.success && response.data) {
        // Handle the data structure in the updated pageContentService
        // Make sure pages is always an array
        setPages(Array.isArray(response.data) ? response.data : []);
      } else {
        // If no success property or data is missing, show error
        setError(response.message || "Failed to load pages. Invalid response format.");
        setPages([]);
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
      setError("Failed to load pages. Please try again later.");
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePage = async (slug) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      try {
        setLoading(true);
        await pageContentService.deletePage(slug);
        // Refresh the page list
        await fetchPages();
      } catch (error) {
        console.error("Error deleting page:", error);
        setError("Failed to delete page. Please try again later.");
        setLoading(false);
      }
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error</h4>
        <p>{error}</p>
        <hr />
        <button className="btn btn-outline-danger" onClick={fetchPages}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="page-list">
      {/* Frontend Pages Section */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Frontend Pages</h5>
        </div>
        <div className="card-body">
          <p className="text-muted mb-3">
            Edit the content of built-in frontend pages that are accessible from the main menu.
          </p>
          <div className="row">
            {frontendPages.map((page) => (
              <div key={page.slug} className="col-md-3 col-sm-6 mb-3">
                <div className="card h-100">
                  <div className="card-body text-center" style={{ backgroundColor: page.color + '10' }}>
                    <h5 className="card-title" style={{ color: page.color }}>{page.name}</h5>
                    <p className="card-text small text-muted">
                      Edit the content for the {page.name.toLowerCase()}
                    </p>
                  </div>
                  <div className="card-footer bg-transparent text-center">
                    <Link 
                      to={`/pages/frontend/${page.slug}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Edit Page
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Pages Section */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Custom Pages</h5>
          <Link
            to="/pages/new"
            className="btn btn-sm btn-primary"
          >
            Create New Page
          </Link>
        </div>
        <div className="card-body">
          {pages.length === 0 ? (
            <div className="alert alert-info">
              <p className="mb-0">No custom pages have been created yet.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => (
                    <tr key={page.id}>
                      <td>{page.title}</td>
                      <td>
                        <code>{page.slug}</code>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            page.status === "published" 
                              ? "bg-success" 
                              : "bg-warning text-dark"
                          }`}
                        >
                          {page.status}
                        </span>
                      </td>
                      <td>
                        {new Date(page.updated_at).toLocaleString()}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <Link
                            to={`/pages/edit/${page.slug}`}
                            className="btn btn-sm btn-info text-white"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeletePage(page.slug)}
                            className="btn btn-sm btn-danger"
                          >
                            Delete
                          </button>
                          <a
                            href={`${window.location.origin.replace(
                              "3000",
                              "3001"
                            )}/page/${page.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-secondary"
                          >
                            View
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageList;
