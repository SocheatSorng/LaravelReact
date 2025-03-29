import React from 'react';

function OrderFilter() {
  return (
    <div className="dropdown">
      <a 
        href="#" 
        className="dropdown-toggle btn btn-sm btn-outline-light rounded" 
        data-bs-toggle="dropdown" 
        aria-expanded="false"
      >
        This Month
      </a>
      <div className="dropdown-menu dropdown-menu-end">
        <a href="#!" className="dropdown-item">Download</a>
        <a href="#!" className="dropdown-item">Export</a>
        <a href="#!" className="dropdown-item">Import</a>
      </div>
    </div>
  );
}

export default OrderFilter;