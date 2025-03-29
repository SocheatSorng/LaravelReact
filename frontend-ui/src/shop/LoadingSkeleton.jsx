import React from "react";

const LoadingSkeleton = ({ count }) => {
  return (
    <div className="row g-4">
      {[...Array(count)].map((_, idx) => (
        <div key={idx} className="col-lg-4 col-md-6 col-12">
          <div className="card border-0 shadow-sm">
            <div
              className="loading-skeleton"
              style={{
                height: "200px",
                background: "#e0e0e0",
                animation: "pulse 1.5s infinite",
              }}
            ></div>
            <div className="card-body">
              <div
                className="loading-skeleton"
                style={{
                  height: "20px",
                  width: "80%",
                  background: "#e0e0e0",
                  marginBottom: "10px",
                  animation: "pulse 1.5s infinite",
                }}
              ></div>
              <div
                className="loading-skeleton"
                style={{
                  height: "15px",
                  width: "60%",
                  background: "#e0e0e0",
                  animation: "pulse 1.5s infinite",
                }}
              ></div>
            </div>
          </div>
        </div>
      ))}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSkeleton;
