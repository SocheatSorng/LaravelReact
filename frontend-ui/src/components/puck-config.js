import React from "react";

// Define our custom components - these should match the ones in backend-dashboard/src/components/puck/config.js
const components = {
  // Hero component
  Hero: {
    render: ({ title, subtitle, buttonText, buttonLink, backgroundImage }) => (
      <div
        className="hero"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          padding: "4rem 2rem",
          textAlign: "center",
          color: "white",
          borderRadius: "8px",
          marginBottom: "2rem",
        }}
      >
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <a
          href={buttonLink}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {buttonText}
        </a>
      </div>
    ),
  },

  // Text Block component
  TextBlock: {
    render: ({ heading, content, textAlign }) => (
      <div
        style={{
          textAlign,
          padding: "2rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          marginBottom: "2rem",
        }}
      >
        <h2>{heading}</h2>
        <p>{content}</p>
      </div>
    ),
  },

  // Two Column Layout
  TwoColumnLayout: {
    render: ({ leftColumnWidth, children }) => {
      // Calculate right column width
      const rightColumnWidth = `${100 - parseInt(leftColumnWidth)}%`;

      return (
        <div
          style={{
            display: "flex",
            gap: "2rem",
            marginBottom: "2rem",
          }}
        >
          <div style={{ width: leftColumnWidth }}>{children?.[0]}</div>
          <div style={{ width: rightColumnWidth }}>{children?.[1]}</div>
        </div>
      );
    },
  },

  // Image component
  Image: {
    render: ({ src, alt, width, height }) => (
      <img
        src={src}
        alt={alt}
        style={{
          width,
          height,
          objectFit: "cover",
          borderRadius: "8px",
          marginBottom: "1rem",
        }}
      />
    ),
  },
};

// Create and export the Puck configuration
const config = {
  components,
  // Root configuration
  root: {
    render: ({ children, title, description }) => {
      return (
        <div className="page-content">
          <div className="page-metadata" style={{ display: "none" }}>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className="page-content-area">{children}</div>
        </div>
      );
    },
  },
};

export default config;
