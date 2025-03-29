import React from "react";

function OrderPagination({
  showing,
  total,
  currentPage,
  onPageChange,
  onPerPageChange,
}) {
  const totalPages = Math.ceil(total / (showing || 10));

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePerPageChange = (e) => {
    onPerPageChange(parseInt(e.target.value));
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxPageButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div className="d-flex align-items-center">
        <label className="me-2">Show:</label>
        <select
          className="form-select form-select-sm"
          style={{ width: "70px" }}
          onChange={handlePerPageChange}
          defaultValue="10"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>

      <div className="pagination-info">
        Showing {showing} of {total} entries
      </div>

      <nav aria-label="Order pagination">
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={handlePrevPage}>
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>

          {getPageNumbers().map((page) => (
            <li
              key={page}
              className={`page-item ${page === currentPage ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button className="page-link" onClick={handleNextPage}>
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default OrderPagination;
