import React from "react";

const Loading = () => {
  return (
    <div className="loading-container d-flex align-items-center justify-content-center min-vh-100">
      <div className="text-center">
        <div
          className="spinner-grow text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-3 text-primary">Loading Product...</h5>
      </div>
    </div>
  );
};

export default Loading;
