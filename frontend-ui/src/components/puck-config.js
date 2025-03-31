import React from "react";

// Define our custom components - these should match the ones in backend-dashboard/src/components/puck/config.js
const components = {
  // Hero component
  Hero: {
    defaultProps: {
      title: "Welcome to our website",
      subtitle: "We offer the best products and services",
      buttonText: "Learn More",
      buttonLink: "/about",
      backgroundImage: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?q=80&w=1470&auto=format&fit=crop",
    },
    render: ({ title, subtitle, buttonText, buttonLink, backgroundImage, puck }) => (
      <div
        className="hero"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          padding: "4rem 2rem",
          textAlign: "center",
          color: "white",
          borderRadius: "8px",
          marginBottom: "2rem",
          position: "relative",
          zIndex: 1,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "320px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {/* Dark overlay for better text visibility */}
        <div 
          style={{
            position: "absolute", 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: "rgba(0,0,0,0.5)", 
            zIndex: -1,
            borderRadius: "8px"
          }}
        ></div>
        
        <h1 
          style={{ 
            color: "white", 
            fontWeight: "bold",
            marginBottom: "1rem",
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            fontSize: "2.5rem"
          }}
        >
          {title}
        </h1>
        
        <p 
          style={{ 
            color: "white", 
            marginBottom: "1.5rem",
            fontWeight: "400",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            fontSize: "1.25rem"
          }}
        >
          {subtitle}
        </p>
        
        {buttonText && buttonLink && (
          <a
            href={buttonLink}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "4px",
              textDecoration: "none",
              display: "inline-block",
              fontWeight: "500",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
              fontSize: "1rem"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#0069d9";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#007bff";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
            }}
          >
            {buttonText}
          </a>
        )}
      </div>
    ),
  },

  // Text Block component
  TextBlock: {
    defaultProps: {
      heading: "Section Heading",
      content: "This is a text block. You can edit this text.",
      textAlign: "left",
    },
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
    defaultProps: {
      leftColumnWidth: "50%",
    },
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
    defaultProps: {
      src: "https://via.placeholder.com/800x400",
      alt: "Placeholder image",
      width: "100%",
      height: "auto",
    },
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
  
  // Space component for vertical spacing
  Space: {
    defaultProps: {
      height: "40px",
    },
    render: ({ height }) => (
      <div
        style={{
          height,
          width: "100%",
        }}
      />
    ),
  },
  
  // Grid component
  Grid: {
    defaultProps: {
      columns: 3,
      gap: "20px",
    },
    render: ({ columns, gap, children }) => {
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap,
            marginBottom: "2rem",
          }}
        >
          {children}
        </div>
      );
    },
  },
  
  // Call to Action component
  CallToAction: {
    defaultProps: {
      title: "Ready to get started?",
      description: "Join thousands of satisfied customers using our product.",
      buttonText: "Sign Up Now",
      buttonLink: "/signup",
      backgroundColor: "#f8f9fa",
    },
    render: ({ title, description, buttonText, buttonLink, backgroundColor }) => (
      <div
        style={{
          padding: "3rem 2rem",
          textAlign: "center",
          backgroundColor,
          borderRadius: "8px",
          marginBottom: "2rem",
        }}
      >
        <h2>{title}</h2>
        <p>{description}</p>
        <a
          href={buttonLink}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            marginTop: "1rem",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {buttonText}
        </a>
      </div>
    ),
  },
  
  // Heading component
  Heading: {
    defaultProps: {
      text: "Section Heading",
      level: "h2",
      alignment: "left",
    },
    render: ({ text, level, alignment }) => {
      const HeadingTag = level;
      return (
        <HeadingTag
          style={{
            textAlign: alignment,
            marginBottom: "1.5rem",
          }}
        >
          {text}
        </HeadingTag>
      );
    },
  },

  // Flex component
  Flex: {
    defaultProps: {
      direction: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      gap: "16px",
    },
    render: ({ direction, justifyContent, alignItems, gap, children }) => (
      <div
        style={{
          display: "flex",
          flexDirection: direction,
          justifyContent,
          alignItems,
          gap,
          marginBottom: "2rem",
        }}
      >
        {children}
      </div>
    ),
  },

  // Button component
  Button: {
    defaultProps: {
      text: "Click Me",
      url: "#",
      variant: "primary",
      size: "medium",
    },
    render: ({ text, url, variant, size }) => {
      const getStyles = () => {
        const baseStyles = {
          display: "inline-block",
          textDecoration: "none",
          borderRadius: "4px",
          fontWeight: "bold",
          cursor: "pointer",
        };
        
        // Size styles
        const sizeStyles = {
          small: { padding: "6px 12px", fontSize: "14px" },
          medium: { padding: "8px 16px", fontSize: "16px" },
          large: { padding: "12px 24px", fontSize: "18px" },
        };
        
        // Variant styles
        const variantStyles = {
          primary: { backgroundColor: "#007bff", color: "white", border: "none" },
          secondary: { backgroundColor: "#6c757d", color: "white", border: "none" },
          outline: { backgroundColor: "transparent", color: "#007bff", border: "1px solid #007bff" },
        };
        
        return { ...baseStyles, ...sizeStyles[size], ...variantStyles[variant] };
      };
      
      return (
        <a href={url} style={getStyles()}>
          {text}
        </a>
      );
    },
  },

  // Card component
  Card: {
    defaultProps: {
      title: "Card Title",
      content: "This is a card component with a title and content.",
      imageUrl: "",
      linkText: "Learn More",
      linkUrl: "#",
    },
    render: ({ title, content, imageUrl, linkText, linkUrl }) => (
      <div
        style={{
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: "white",
          marginBottom: "2rem",
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
            }}
          />
        )}
        <div style={{ padding: "1.5rem" }}>
          <h3 style={{ marginTop: 0, marginBottom: "0.75rem" }}>{title}</h3>
          <p style={{ marginBottom: "1.5rem" }}>{content}</p>
          {linkText && linkUrl && (
            <a
              href={linkUrl}
              style={{
                color: "#007bff",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              {linkText}
            </a>
          )}
        </div>
      </div>
    ),
  },

  // Logos component
  Logos: {
    defaultProps: {
      title: "Trusted by",
      logos: [
        { imageUrl: "https://via.placeholder.com/150x80", alt: "Company 1", url: "#" },
        { imageUrl: "https://via.placeholder.com/150x80", alt: "Company 2", url: "#" },
        { imageUrl: "https://via.placeholder.com/150x80", alt: "Company 3", url: "#" },
        { imageUrl: "https://via.placeholder.com/150x80", alt: "Company 4", url: "#" },
      ],
    },
    render: ({ title, logos }) => (
      <div
        style={{
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        {title && <h3 style={{ marginBottom: "1.5rem" }}>{title}</h3>}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {logos.map((logo, index) => (
            <a
              key={index}
              href={logo.url || "#"}
              style={{
                display: "inline-block",
                opacity: 0.7,
                transition: "opacity 0.3s",
                filter: "grayscale(100%)",
              }}
            >
              <img
                src={logo.imageUrl}
                alt={logo.alt}
                style={{
                  height: "50px",
                  maxWidth: "150px",
                  objectFit: "contain",
                }}
              />
            </a>
          ))}
        </div>
      </div>
    ),
  },

  // Stats component
  Stats: {
    defaultProps: {
      title: "Our Impact",
      stats: [
        { value: "100+", label: "Customers", description: "worldwide" },
        { value: "50M+", label: "Annual revenue", description: "in USD" },
        { value: "10+", label: "Years", description: "of experience" },
        { value: "200+", label: "Team members", description: "globally" },
      ],
      columns: 4,
    },
    render: ({ title, stats, columns }) => (
      <div
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          padding: "2rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        {title && <h2 style={{ marginBottom: "2rem" }}>{title}</h2>}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: "2rem",
          }}
        >
          {stats.map((stat, index) => (
            <div key={index}>
              <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#007bff" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: "bold" }}>{stat.label}</div>
              {stat.description && <div style={{ opacity: 0.7 }}>{stat.description}</div>}
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // Text component (simpler than TextBlock)
  Text: {
    defaultProps: {
      content: "This is a simple text component.",
      size: "normal",
      alignment: "left",
    },
    render: ({ content, size, alignment }) => {
      const fontSize = {
        small: "0.9rem",
        normal: "1rem",
        large: "1.2rem",
      };
      
      return (
        <p
          style={{
            fontSize: fontSize[size],
            textAlign: alignment,
            marginBottom: "1rem",
          }}
        >
          {content}
        </p>
      );
    },
  },

  // BlogList component
  BlogList: {
    defaultProps: {
      title: "Latest Blog Posts",
      columns: "3",
      blogPosts: [
        {
          imageUrl: "https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=500&auto=format&fit=crop",
          category: "Books",
          title: "The Fascinating Realm of Science Fiction",
          description: "Dive into the world of science fiction with our latest blog post, where we highlight essential reads.",
          link: "/blog/post-1"
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=500&auto=format&fit=crop",
          category: "Books",
          title: "Exploring Classic Literature",
          description: "Discover the timeless appeal of classic literature through our curated list of must-read books.",
          link: "/blog/post-2"
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500&auto=format&fit=crop",
          category: "Books",
          title: "Modern Fiction Trends",
          description: "Explore the latest trends in modern fiction and find your next favorite read from our selection.",
          link: "/blog/post-3"
        }
      ]
    },
    render: ({ title, blogPosts, columns, puck }) => {
      // Calculate column size based on columns prop
      const colSize = columns ? 12 / parseInt(columns) : 4;
      
      return (
        <div className="blog-list-container" style={{ marginBottom: "3rem" }}>
          {title && (
            <h2 style={{ 
              marginBottom: "2rem", 
              textAlign: "center",
              fontWeight: "bold"
            }}>
              {title}
            </h2>
          )}
          
          <div className="blog-posts-grid" style={{ 
            display: "flex", 
            flexWrap: "wrap", 
            gap: "2rem",
            justifyContent: "center"
          }}>
            {blogPosts.map((post, index) => (
              <div 
                key={index} 
                className="blog-post-card" 
                style={{ 
                  width: `calc(${100/(columns ? parseInt(columns) : 3)}% - 2rem)`,
                  minWidth: "280px",
                  maxWidth: "400px",
                  marginBottom: "2rem" 
                }}
              >
                <div style={{ 
                  borderRadius: "8px", 
                  overflow: "hidden",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  backgroundColor: "white"
                }}>
                  <div style={{ position: "relative" }}>
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      style={{ 
                        width: "100%", 
                        height: "220px",
                        objectFit: "cover"
                      }}
                    />
                  </div>
                  
                  <div style={{ padding: "1.5rem" }}>
                    <a 
                      href="#" 
                      style={{ 
                        fontSize: "0.9rem",
                        color: "#007bff",
                        textDecoration: "none",
                        display: "block",
                        marginBottom: "0.5rem"
                      }}
                    >
                      {post.category}
                    </a>
                    
                    <h4 style={{ 
                      marginBottom: "1rem",
                      fontWeight: "bold",
                      fontSize: "1.25rem",
                      lineHeight: "1.4"
                    }}>
                      <a 
                        href={post.link} 
                        style={{ 
                          color: "#212529",
                          textDecoration: "none"
                        }}
                      >
                        {post.title}
                      </a>
                    </h4>
                    
                    <p style={{ 
                      marginBottom: "1rem",
                      fontSize: "0.95rem",
                      color: "#6c757d"
                    }}>
                      {post.description}
                      {" "}
                      <a 
                        href={post.link}
                        style={{ 
                          textDecoration: "underline",
                          color: "#6c757d",
                          fontWeight: "500"
                        }}
                      >
                        Read More
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    },
  },
};

// Create and export the Puck configuration
const config = {
  components,
  // Root configuration
  root: {
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
