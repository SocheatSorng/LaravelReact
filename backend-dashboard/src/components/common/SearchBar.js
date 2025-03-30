import React, { useState } from "react";

function SearchBar({ placeholder, width, onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ width: width || "100%" }}>
      <div className="input-group input-group-sm">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder || "Search..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="btn btn-light border">
          <i className="bi bi-search"></i>
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
