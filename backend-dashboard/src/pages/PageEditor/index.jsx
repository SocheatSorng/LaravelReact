import React, { useState, useEffect } from "react";
import { Puck } from "@measured/puck";
import config from "../../components/puck/config";
import { useParams, useNavigate } from "react-router-dom";
import { pageContentService } from "../../services/api";
import "@measured/puck/dist/index.css";

const PageEditor = ({ frontendEdit }) => {
  const { slug, page } = useParams();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [status, setStatus] = useState("published");
  const [error, setError] = useState(null);

  // Frontend page mappings - these are the predefined system pages 
  // that can be edited in the frontend
  const frontendPages = {
    blog: {
      title: "Blog Page",
      slug: "blog-page",
      description: "The main blog listing page"
    },
    shop: {
      title: "Shop Page",
      slug: "shop-page",
      description: "The main shop listing page"
    },
    about: {
      title: "About Page",
      slug: "about-page",
      description: "The about us page"
    },
    contact: {
      title: "Contact Page",
      slug: "contact-page",
      description: "The contact us page"
    }
  };

  useEffect(() => {
    // If we have a frontendEdit flag and a page parameter, load or create
    // the corresponding frontend page
    if (frontendEdit && page) {
      if (frontendPages[page]) {
        const pageInfo = frontendPages[page];
        setPageTitle(pageInfo.title);
        setPageSlug(pageInfo.slug);
        // Try to load existing page, or create default structure if it doesn't exist
        fetchFrontendPage(pageInfo.slug);
      } else {
        setError(`Unknown frontend page: ${page}`);
        setLoading(false);
      }
    } 
    // If we have a slug, load the existing page
    else if (slug) {
      fetchPageData();
    } else {
      setLoading(false);
      // Initialize with proper Puck data structure
      setPageData({
        content: [], // Array for main content items
        root: {
          props: {
            title: "New Page",
            description: "Page description goes here",
          },
        },
        zones: {}, // Object for zone data
      });
    }
  }, [slug, page, frontendEdit]);

  const fetchFrontendPage = async (pageSlug) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        // Try to load existing page
        const pageContent = await pageContentService.getPage(pageSlug);
        
        // Parse content if it's a string
        let content = pageContent.content;
        if (typeof content === "string") {
          content = JSON.parse(content);
        }

        // Ensure content has the correct Puck data structure
        if (!content) {
          content = { content: [], root: { props: {} }, zones: {} };
        }

        // Add missing properties if needed
        if (!content.content) content.content = [];
        if (!content.root) content.root = { props: {} };
        if (!content.root.props) content.root.props = {};
        if (!content.zones) content.zones = {};

        setPageData(content);
        setStatus(pageContent.status || "published");
      } catch (err) {
        // If page doesn't exist, create default structure
        console.log("Frontend page doesn't exist yet, creating default structure");
        setPageData({
          content: [], 
          root: {
            props: {
              title: pageTitle,
              description: frontendPages[page]?.description || "Frontend page",
            },
          },
          zones: {},
        });
      }
    } catch (error) {
      console.error("Error fetching frontend page data:", error);
      setError(
        "Failed to load frontend page content. The server might be taking too long to respond."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPageData = async () => {
    try {
      setLoading(true);
      setError(null);
      const pageContent = await pageContentService.getPage(slug);

      // Parse content if it's a string
      let content = pageContent.content;
      if (typeof content === "string") {
        content = JSON.parse(content);
      }

      // Log the loaded content structure
      console.log("Loaded content structure:", content);

      // Ensure content has the correct Puck data structure
      if (!content) {
        content = { content: [], root: { props: {} }, zones: {} };
      }

      // Add missing properties if needed
      if (!content.content) content.content = [];
      if (!content.root) content.root = { props: {} };
      if (!content.root.props) content.root.props = {};
      if (!content.zones) content.zones = {};

      setPageData(content);
      setPageTitle(pageContent.title);
      setPageSlug(pageContent.slug);
      setStatus(pageContent.status);
    } catch (error) {
      console.error("Error fetching page data:", error);
      setError(
        "Failed to load page content. The server might be taking too long to respond or the page doesn't exist."
      );
    } finally {
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

      // For debugging - log the data structure
      console.log("Saving data structure:", data);
      
      // Ensure we have valid Puck data structure with all required properties
      const puckData = { ...data };
      if (!puckData.content) puckData.content = [];
      if (!puckData.root) puckData.root = { props: {} };
      if (!puckData.root.props) puckData.root.props = {};
      if (!puckData.zones) puckData.zones = {};

      // Log the normalized structure
      console.log("Normalized data structure:", puckData);

      const saveData = {
        title: pageTitle,
        slug: pageSlug,
        description: frontendEdit ? frontendPages[page]?.description : "",
        content: puckData, // Use the normalized structure
        type: frontendEdit ? page : "page",
        status,
      };

      console.log("Sending to API:", saveData);

      let response;
      let success = false;
      let message = "";
      
      try {
        if (frontendEdit) {
          // For frontend pages, always use updatePage since we know the slug
          response = await pageContentService.updatePage(pageSlug, saveData);
          console.log("Frontend page update response:", response);
          success = response.success;
          message = response.message || `Frontend ${page} page has been updated.`;
        } else {
          // Try to get the page first to check if it exists
          try {
            const checkResponse = await pageContentService.getPage(pageSlug);
            // If the page exists, update it
            response = await pageContentService.updatePage(pageSlug, saveData);
            console.log("Page update response:", response);
            success = response.success;
            message = response.message || "Page has been updated.";
          } catch (error) {
            // If the page doesn't exist, create it
            if (error.response && error.response.status === 404) {
              response = await pageContentService.createPage(saveData);
              console.log("Page create response:", response);
              success = response.success;
              message = response.message || "Page has been created.";
            } else {
              throw error;
            }
          }
        }

        // Check if the API call was successful
        if (success) {
          // Show success message
          alert(message);
          // Redirect to pages list
          navigate("/pages");
        } else {
          // If not successful, show error message
          setError(message || "Failed to save page. Please try again.");
        }
      } catch (error) {
        console.error("API error:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error saving page:", error);
      setError(
        error.response?.data?.message ||
        error.message ||
        "Failed to save page. The server might be taking too long to respond."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-editor">
      <div
        className="editor-header"
        style={{ padding: "1rem", borderBottom: "1px solid #eee" }}
      >
        {frontendEdit && (
          <div className="alert alert-info" role="alert">
            You are editing the <strong>{frontendPages[page]?.title || page}</strong> frontend page. 
            Changes will be visible to all users on the frontend website.
          </div>
        )}
        
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
            disabled={frontendEdit} // Disable editing title for frontend pages
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
            disabled={!!slug || frontendEdit} // Disable editing slug if editing existing or frontend page
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
            disabled={frontendEdit} // Frontend pages should always be published
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
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
              {saving ? "Saving..." : frontendEdit ? "Update Frontend Page" : "Save Page"}
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default PageEditor;
