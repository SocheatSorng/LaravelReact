import React from 'react';

function SearchBar({ placeholder, width }) {
  return (
    <input 
      type="search" 
      className="form-control form-control-sm" 
      placeholder={placeholder}
      style={{ width }}
    />
  );
}

export default SearchBar;