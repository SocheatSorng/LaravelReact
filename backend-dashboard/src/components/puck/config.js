import React from "react";
import { DropZone } from "@measured/puck";

// Define our custom components - match these exact names in the frontend config
const components = {
  // Hero component
  Hero: {
    fields: {
      title: { type: "text", label: "Title" },
      subtitle: { type: "text", label: "Subtitle" },
      buttonText: { type: "text", label: "Button Text" },
      buttonLink: { type: "text", label: "Button Link" },
      backgroundImage: { type: "text", label: "Background Image URL" },
    },
    defaultProps: {
      title: "Welcome to our website",
      subtitle: "We offer the best products and services",
      buttonText: "Learn More",
      buttonLink: "/about",
      backgroundImage: "https://via.placeholder.com/1200x600",
    },
    render: ({
      title,
      subtitle,
      buttonText,
      buttonLink,
      backgroundImage,
      puck,
    }) => (
      <div
        ref={puck?.dragRef}
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
        <button
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
          }}
        >
          {buttonText}
        </button>
      </div>
    ),
  },

  // Text Block component
  TextBlock: {
    fields: {
      heading: { type: "text", label: "Heading" },
      content: { type: "textarea", label: "Content" },
      textAlign: {
        type: "select",
        label: "Text Alignment",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
        ],
      },
    },
    defaultProps: {
      heading: "Section Heading",
      content: "This is a text block. You can edit this text.",
      textAlign: "left",
    },
    render: ({ heading, content, textAlign, puck }) => (
      <div
        ref={puck?.dragRef}
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
    fields: {
      leftColumnWidth: {
        type: "select",
        label: "Left Column Width",
        options: [
          { label: "25%", value: "25%" },
          { label: "33%", value: "33%" },
          { label: "50%", value: "50%" },
          { label: "66%", value: "66%" },
          { label: "75%", value: "75%" },
        ],
      },
    },
    defaultProps: {
      leftColumnWidth: "50%",
    },
    render: ({ leftColumnWidth, puck }) => {
      // Calculate right column width
      const rightColumnWidth = `${100 - parseInt(leftColumnWidth)}%`;

      return (
        <div
          ref={puck?.dragRef}
          style={{
            display: "flex",
            gap: "2rem",
            marginBottom: "2rem",
          }}
        >
          <div style={{ width: leftColumnWidth }}>
            <DropZone zone="left-column" />
          </div>
          <div style={{ width: rightColumnWidth }}>
            <DropZone zone="right-column" />
          </div>
        </div>
      );
    },
  },

  // Image component
  Image: {
    fields: {
      src: { type: "text", label: "Image URL" },
      alt: { type: "text", label: "Alt Text" },
      width: { type: "text", label: "Width (px or %)" },
      height: { type: "text", label: "Height (px)" },
    },
    defaultProps: {
      src: "https://via.placeholder.com/800x400",
      alt: "Placeholder image",
      width: "100%",
      height: "auto",
    },
    render: ({ src, alt, width, height, puck }) => (
      <img
        ref={puck?.dragRef}
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
  // Root configuration according to Puck documentation
  root: {
    fields: {
      title: {
        type: "text",
        label: "Page Title",
      },
      description: {
        type: "textarea",
        label: "Page Description",
      },
    },
    defaultProps: {
      title: "Page Title",
      description: "Page description for SEO",
    },
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
