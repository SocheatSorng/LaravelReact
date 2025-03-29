import React from 'react';

function OrderPagination({ showing, total, currentPage }) {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <div>
        Showing 1 to {showing} of {total} entries
      </div>
      <nav>
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <span className="page-link">Previous</span>
          </li>
          <li className="page-item active">
            <span className="page-link">1</span>
          </li>
          <li className="page-item">
            <a className="page-link" href="#!">2</a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#!">3</a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#!">Next</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default OrderPagination;