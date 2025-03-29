import React from "react";

function ProductPagination({
  showing,
  total,
  currentPage,
  lastPage,
  onPageChange,
}) {
  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (lastPage <= maxPagesToShow) {
      // If there are less than maxPagesToShow pages, show all of them
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      // Otherwise show a subset with the current page in the middle if possible
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(lastPage, startPage + maxPagesToShow - 1);

      // Adjust if we're near the end
      if (endPage === lastPage) {
        startPage = Math.max(1, lastPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  // Handle click events
  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= lastPage) {
      onPageChange(page);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div>
        Showing {showing > 0 ? (currentPage - 1) * showing + 1 : 0} to{" "}
        {Math.min(currentPage * showing, total)} of {total} entries
      </div>
      <nav>
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>

          {pageNumbers.map((page) => (
            <li
              key={page}
              className={`page-item ${page === currentPage ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageClick(page)}
              >
                {page}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${
              currentPage === lastPage ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === lastPage}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default ProductPagination;
