import React, { useState, useEffect } from "react";
import axios from "axios";
import PageHeader from "./PageHeader";
import PuckRenderer from "./PuckRenderer";

const DynamicPage = ({ slug, title }) => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        // Fetch the published page content by slug
        const response = await axios.get(`/api/public/pages/${slug}`);

        // Process the content
        let content = response.data.content;

        // Parse content if it's a string
        if (typeof content === "string") {
          try {
            content = JSON.parse(content);
          } catch (err) {
            console.error("Error parsing page content:", err);
          }
        }

        console.log("Page content structure:", content);

        // Set the processed data
        setPageContent({
          ...response.data,
          content: content,
        });

        setLoading(false);
      } catch (err) {
        console.error(`Error fetching ${slug} page:`, err);
        setError(`Failed to load ${title} content. Please try again later.`);
        setLoading(false);
      }
    };

    if (slug) {
      fetchPageContent();
    }
  }, [slug, title]);

  return (
    <div className="dynamic-page">
      <PageHeader
        title={title || pageContent?.title || ""}
        curPage={title || pageContent?.title || ""}
      />

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : pageContent ? (
        <div className="container">
          <h1 className="page-title">{pageContent.title}</h1>
          <PuckRenderer data={pageContent.content} />
        </div>
      ) : (
        <div className="container">
          <p>No content available yet. Please check back later.</p>
        </div>
      )}
    </div>
  );
};

export default DynamicPage;
