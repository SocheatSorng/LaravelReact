import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const PageList = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/page-contents");
      setPages(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pages:", error);
      setError("Failed to load pages. Please try again.");
      setLoading(false);
    }
  };

  const handleDeletePage = async (slug) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      try {
        await axios.delete(`/api/page-contents/${slug}`);
        // Refresh the page list
        fetchPages();
      } catch (error) {
        console.error("Error deleting page:", error);
        setError("Failed to delete page. Please try again.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="page-list">
      <div
        className="page-list-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1>Pages</h1>
        <Link
          to="/pages/new"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          Create New Page
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="no-pages">
          <p>No pages have been created yet.</p>
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.75rem",
                  borderBottom: "2px solid #eee",
                }}
              >
                Title
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.75rem",
                  borderBottom: "2px solid #eee",
                }}
              >
                Slug
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.75rem",
                  borderBottom: "2px solid #eee",
                }}
              >
                Status
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.75rem",
                  borderBottom: "2px solid #eee",
                }}
              >
                Last Updated
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "0.75rem",
                  borderBottom: "2px solid #eee",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id}>
                <td
                  style={{ padding: "0.75rem", borderBottom: "1px solid #eee" }}
                >
                  {page.title}
                </td>
                <td
                  style={{ padding: "0.75rem", borderBottom: "1px solid #eee" }}
                >
                  {page.page_slug}
                </td>
                <td
                  style={{ padding: "0.75rem", borderBottom: "1px solid #eee" }}
                >
                  <span
                    style={{
                      backgroundColor:
                        page.status === "published" ? "#28a745" : "#ffc107",
                      color: page.status === "published" ? "white" : "black",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {page.status}
                  </span>
                </td>
                <td
                  style={{ padding: "0.75rem", borderBottom: "1px solid #eee" }}
                >
                  {new Date(page.updated_at).toLocaleString()}
                </td>
                <td
                  style={{
                    padding: "0.75rem",
                    borderBottom: "1px solid #eee",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      justifyContent: "center",
                    }}
                  >
                    <Link
                      to={`/pages/edit/${page.page_slug}`}
                      style={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "#17a2b8",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                      }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeletePage(page.page_slug)}
                      style={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                    <a
                      href={`${window.location.origin.replace(
                        "3000",
                        "3001"
                      )}/page/${page.page_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "#6c757d",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                      }}
                    >
                      View
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PageList;
