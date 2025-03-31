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
      backgroundImage: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?q=80&w=1470&auto=format&fit=crop",
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
    type: "other",
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
    type: "typography",
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
    type: "layout",
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
    type: "media",
  },
  
  // Adding a Space component for vertical spacing
  Space: {
    fields: {
      height: { 
        type: "select", 
        label: "Height",
        options: [
          { label: "Small", value: "20px" },
          { label: "Medium", value: "40px" },
          { label: "Large", value: "80px" },
          { label: "Extra Large", value: "120px" },
        ]
      },
    },
    defaultProps: {
      height: "40px",
    },
    render: ({ height, puck }) => (
      <div
        ref={puck?.dragRef}
        style={{
          height,
          width: "100%",
        }}
      />
    ),
    type: "layout",
  },
  
  // Adding a Grid component
  Grid: {
    fields: {
      columns: { 
        type: "select", 
        label: "Number of Columns",
        options: [
          { label: "2 Columns", value: 2 },
          { label: "3 Columns", value: 3 },
          { label: "4 Columns", value: 4 },
        ]
      },
      gap: { 
        type: "select", 
        label: "Gap Size",
        options: [
          { label: "Small", value: "10px" },
          { label: "Medium", value: "20px" },
          { label: "Large", value: "30px" },
        ]
      },
    },
    defaultProps: {
      columns: 3,
      gap: "20px",
    },
    render: ({ columns, gap, puck }) => {
      // Create an array of column zones based on the column count
      const columnZones = Array.from({ length: parseInt(columns) }, (_, i) => `column-${i+1}`);
      
      return (
        <div
          ref={puck?.dragRef}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap,
            marginBottom: "2rem",
          }}
        >
          {columnZones.map(zone => (
            <div key={zone}>
              <DropZone zone={zone} />
            </div>
          ))}
        </div>
      );
    },
    type: "layout",
  },
  
  // Adding a Call to Action component
  CallToAction: {
    fields: {
      title: { type: "text", label: "Title" },
      description: { type: "textarea", label: "Description" },
      buttonText: { type: "text", label: "Button Text" },
      buttonLink: { type: "text", label: "Button Link" },
      backgroundColor: { type: "text", label: "Background Color" },
    },
    defaultProps: {
      title: "Ready to get started?",
      description: "Join thousands of satisfied customers using our product.",
      buttonText: "Sign Up Now",
      buttonLink: "/signup",
      backgroundColor: "#f8f9fa",
    },
    render: ({ title, description, buttonText, buttonLink, backgroundColor, puck }) => (
      <div
        ref={puck?.dragRef}
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
        <button
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            marginTop: "1rem",
          }}
        >
          {buttonText}
        </button>
      </div>
    ),
    type: "other",
  },
  
  // Adding a Heading component
  Heading: {
    fields: {
      text: { type: "text", label: "Heading Text" },
      level: { 
        type: "select", 
        label: "Heading Level",
        options: [
          { label: "H1", value: "h1" },
          { label: "H2", value: "h2" },
          { label: "H3", value: "h3" },
          { label: "H4", value: "h4" },
        ]
      },
      alignment: {
        type: "select",
        label: "Alignment",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
        ],
      },
    },
    defaultProps: {
      text: "Section Heading",
      level: "h2",
      alignment: "left",
    },
    render: ({ text, level, alignment, puck }) => {
      const HeadingTag = level;
      return (
        <HeadingTag
          ref={puck?.dragRef}
          style={{
            textAlign: alignment,
            marginBottom: "1.5rem",
          }}
        >
          {text}
        </HeadingTag>
      );
    },
    type: "typography",
  },

  // Adding a Flex component
  Flex: {
    fields: {
      direction: {
        type: "select",
        label: "Direction",
        options: [
          { label: "Row", value: "row" },
          { label: "Column", value: "column" },
        ],
      },
      justifyContent: {
        type: "select",
        label: "Justify Content",
        options: [
          { label: "Start", value: "flex-start" },
          { label: "Center", value: "center" },
          { label: "End", value: "flex-end" },
          { label: "Space Between", value: "space-between" },
          { label: "Space Around", value: "space-around" },
        ],
      },
      alignItems: {
        type: "select",
        label: "Align Items",
        options: [
          { label: "Start", value: "flex-start" },
          { label: "Center", value: "center" },
          { label: "End", value: "flex-end" },
          { label: "Stretch", value: "stretch" },
        ],
      },
      gap: {
        type: "select",
        label: "Gap",
        options: [
          { label: "None", value: "0" },
          { label: "Small", value: "8px" },
          { label: "Medium", value: "16px" },
          { label: "Large", value: "24px" },
        ],
      },
    },
    defaultProps: {
      direction: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      gap: "16px",
    },
    render: ({ direction, justifyContent, alignItems, gap, puck }) => (
      <div
        ref={puck?.dragRef}
        style={{
          display: "flex",
          flexDirection: direction,
          justifyContent,
          alignItems,
          gap,
          marginBottom: "2rem",
        }}
      >
        <DropZone zone="flex-content" />
      </div>
    ),
    type: "layout",
  },

  // Adding a Button component
  Button: {
    fields: {
      text: { type: "text", label: "Button Text" },
      url: { type: "text", label: "URL" },
      variant: {
        type: "select",
        label: "Variant",
        options: [
          { label: "Primary", value: "primary" },
          { label: "Secondary", value: "secondary" },
          { label: "Outline", value: "outline" },
        ],
      },
      size: {
        type: "select",
        label: "Size",
        options: [
          { label: "Small", value: "small" },
          { label: "Medium", value: "medium" },
          { label: "Large", value: "large" },
        ],
      },
    },
    defaultProps: {
      text: "Click Me",
      url: "#",
      variant: "primary",
      size: "medium",
    },
    render: ({ text, url, variant, size, puck }) => {
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
        <a 
          ref={puck?.dragRef}
          href={url} 
          style={getStyles()}
        >
          {text}
        </a>
      );
    },
    type: "actions",
  },

  // Adding a Card component
  Card: {
    fields: {
      title: { type: "text", label: "Card Title" },
      content: { type: "textarea", label: "Card Content" },
      imageUrl: { type: "text", label: "Image URL (optional)" },
      linkText: { type: "text", label: "Link Text (optional)" },
      linkUrl: { type: "text", label: "Link URL (optional)" },
    },
    defaultProps: {
      title: "Card Title",
      content: "This is a card component with a title and content.",
      imageUrl: "",
      linkText: "Learn More",
      linkUrl: "#",
    },
    render: ({ title, content, imageUrl, linkText, linkUrl, puck }) => (
      <div
        ref={puck?.dragRef}
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
    type: "other",
  },

  // Adding a Logos component
  Logos: {
    fields: {
      title: { type: "text", label: "Title (optional)" },
      logos: {
        type: "array",
        label: "Logos",
        itemLabel: "Logo",
        min: 1,
        max: 10,
        defaultItemProps: {
          imageUrl: "https://via.placeholder.com/150x80",
          alt: "Company Logo",
          url: "#",
        },
        arrayFields: {
          imageUrl: { type: "text", label: "Logo Image URL" },
          alt: { type: "text", label: "Alt Text" },
          url: { type: "text", label: "Link URL (optional)" },
        },
      },
    },
    defaultProps: {
      title: "Trusted by",
      logos: [
        { imageUrl: "https://via.placeholder.com/150x80", alt: "Company 1", url: "#" },
        { imageUrl: "https://via.placeholder.com/150x80", alt: "Company 2", url: "#" },
        { imageUrl: "https://via.placeholder.com/150x80", alt: "Company 3", url: "#" },
        { imageUrl: "https://via.placeholder.com/150x80", alt: "Company 4", url: "#" },
      ],
    },
    render: ({ title, logos, puck }) => (
      <div
        ref={puck?.dragRef}
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
              onMouseOver={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.filter = "grayscale(0%)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.opacity = "0.7";
                e.currentTarget.style.filter = "grayscale(100%)";
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
    type: "other",
  },

  // Adding a Stats component
  Stats: {
    fields: {
      title: { type: "text", label: "Title (optional)" },
      stats: {
        type: "array",
        label: "Statistics",
        itemLabel: "Stat",
        min: 1,
        max: 6,
        defaultItemProps: {
          value: "100+",
          label: "Customers",
          description: "worldwide",
        },
        arrayFields: {
          value: { type: "text", label: "Value" },
          label: { type: "text", label: "Label" },
          description: { type: "text", label: "Description (optional)" },
        },
      },
      columns: {
        type: "select",
        label: "Columns",
        options: [
          { label: "2", value: 2 },
          { label: "3", value: 3 },
          { label: "4", value: 4 },
        ],
      },
    },
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
    render: ({ title, stats, columns, puck }) => (
      <div
        ref={puck?.dragRef}
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
    type: "other",
  },

  // Adding a Text component (simpler than TextBlock)
  Text: {
    fields: {
      content: { type: "textarea", label: "Text Content" },
      size: {
        type: "select",
        label: "Text Size",
        options: [
          { label: "Small", value: "small" },
          { label: "Normal", value: "normal" },
          { label: "Large", value: "large" },
        ],
      },
      alignment: {
        type: "select",
        label: "Alignment",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
        ],
      },
    },
    defaultProps: {
      content: "This is a simple text component.",
      size: "normal",
      alignment: "left",
    },
    render: ({ content, size, alignment, puck }) => {
      const fontSize = {
        small: "0.9rem",
        normal: "1rem",
        large: "1.2rem",
      };
      
      return (
        <p
          ref={puck?.dragRef}
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
    type: "typography",
  },

  // BlogList component
  BlogList: {
    fields: {
      title: { type: "text", label: "Section Title" },
      blogPosts: {
        type: "array",
        label: "Blog Posts",
        itemLabel: "Blog Post",
        min: 1,
        max: 9,
        defaultItemProps: {
          imageUrl: "https://via.placeholder.com/400x300",
          category: "Books",
          title: "Blog Post Title",
          description: "Short description of the blog post goes here.",
          link: "/blog/post-1"
        },
        arrayFields: {
          imageUrl: { type: "text", label: "Image URL" },
          category: { type: "text", label: "Category" },
          title: { type: "text", label: "Post Title" },
          description: { type: "textarea", label: "Short Description" },
          link: { type: "text", label: "Post Link" }
        }
      },
      columns: { 
        type: "select", 
        label: "Columns",
        options: [
          { label: "3 Columns", value: "3" },
          { label: "2 Columns", value: "2" },
          { label: "4 Columns", value: "4" }
        ]
      }
    },
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
      const colSize = 12 / parseInt(columns);
      
      return (
        <div ref={puck?.dragRef} className="blog-list-container" style={{ marginBottom: "3rem" }}>
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
                  width: `calc(${100/parseInt(columns)}% - 2rem)`,
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
    type: "other",
  },
};

// Create and export the Puck configuration
const config = {
  components,
  // Group components in the UI
  categories: [
    {
      name: "LAYOUT",
      components: ["Flex", "Grid", "Space", "TwoColumnLayout"],
    },
    {
      name: "TYPOGRAPHY",
      components: ["Heading", "Text"],
    },
    {
      name: "ACTIONS",
      components: ["Button"],
    },
    {
      name: "OTHER",
      components: ["Card", "Hero", "Logos", "Stats", "BlogList"],
    },
    {
      name: "MEDIA",
      components: ["Image"],
    },
  ],
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
