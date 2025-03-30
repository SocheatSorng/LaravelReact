import React from "react";

// Define our custom components - should match those in the Puck editor config
const components = {
  // Hero component
  Hero: ({ title, subtitle, buttonText, buttonLink, backgroundImage }) => (
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

  // Text Block component
  TextBlock: ({ heading, content, textAlign }) => (
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

  // Two Column Layout
  TwoColumnLayout: ({ leftColumnWidth, children }) => {
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

  // Image component
  Image: ({ src, alt, width, height }) => (
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
};

// Recursive component to render the Puck content structure
const RenderNode = ({ node }) => {
  if (!node) return null;

  // If this is a component node, render the appropriate component
  if (node.type && components[node.type]) {
    const Component = components[node.type];

    // If this node has children, pass them to the component
    if (node.children && node.children.length > 0) {
      return (
        <Component {...node.props}>
          {node.children.map((child, index) => (
            <RenderNode key={index} node={child} />
          ))}
        </Component>
      );
    }

    // If no children, just render the component with its props
    return <Component {...node.props} />;
  }

  // If this is the root node, render its children
  if (node.type === "root" && node.children) {
    return (
      <>
        {node.children.map((child, index) => (
          <RenderNode key={index} node={child} />
        ))}
      </>
    );
  }

  return null;
};

const PuckRenderer = ({ data }) => {
  if (!data) return null;

  return <RenderNode node={data} />;
};

export default PuckRenderer;
