import React, { useState, useEffect } from "react";
import { Puck } from "@measured/puck";
import config from "../../components/puck/config";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "@measured/puck/dist/index.css";

const PageEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [status, setStatus] = useState("draft");
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we have a slug, load the existing page
    if (slug) {
      fetchPageData();
    } else {
      setLoading(false);
      setPageData({
        root: {
          type: "root",
          props: {},
          children: [],
        },
      });
    }
  }, [slug]);

  const fetchPageData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/page-contents/${slug}`);

      // Parse content if it's a string
      let content = response.data.content;
      if (typeof content === "string") {
        content = JSON.parse(content);
      }

      // Ensure content has correct structure
      if (content && content.root && !content.root.props) {
        // Migrate old format to new format
        content.root.props = {};
      }

      setPageData(content);
      setPageTitle(response.data.title);
      setPageSlug(response.data.page_slug);
      setStatus(response.data.status);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching page data:", error);
      setError("Failed to load page content. Please try again.");
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      setSaving(true);
      setError(null);

      if (!pageTitle) {
        setError("Please enter a page title");
        setSaving(false);
        return;
      }

      if (!pageSlug) {
        setError("Please enter a page slug");
        setSaving(false);
        return;
      }

      // Ensure data has the correct structure with root.props
      if (data && data.root && !data.root.props) {
        data.root.props = {};
      }

      const saveData = {
        title: pageTitle,
        page_slug: pageSlug,
        content: JSON.stringify(data),
        status,
      };

      if (slug) {
        // Update existing page
        await axios.put(`/api/page-contents/${slug}`, saveData);
      } else {
        // Create new page
        await axios.post("/api/page-contents", saveData);
      }

      setSaving(false);
      // Redirect to pages list
      navigate("/pages");
    } catch (error) {
      console.error("Error saving page:", error);
      setError(
        error.response?.data?.message ||
          "Failed to save page. Please try again."
      );
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-editor">
      <div
        className="editor-header"
        style={{ padding: "1rem", borderBottom: "1px solid #eee" }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="pageTitle" style={{ marginRight: "0.5rem" }}>
            Page Title:
          </label>
          <input
            id="pageTitle"
            type="text"
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            style={{ padding: "0.5rem", width: "300px" }}
            placeholder="Enter page title"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="pageSlug" style={{ marginRight: "0.5rem" }}>
            Page Slug:
          </label>
          <input
            id="pageSlug"
            type="text"
            value={pageSlug}
            onChange={(e) =>
              setPageSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
            }
            style={{ padding: "0.5rem", width: "300px" }}
            placeholder="page-url-slug"
            disabled={!!slug} // Disable editing slug if editing existing page
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="pageStatus" style={{ marginRight: "0.5rem" }}>
            Status:
          </label>
          <select
            id="pageStatus"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ padding: "0.5rem" }}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
        )}
      </div>

      <Puck
        config={config}
        data={pageData}
        onPublish={handleSave}
        renderHeader={({ publish }) => (
          <div
            style={{
              padding: "1rem",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={publish}
              disabled={saving}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              {saving ? "Saving..." : "Save Page"}
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default PageEditor;
