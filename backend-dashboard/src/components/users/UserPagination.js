import React from "react";

function UserPagination({
  showing = 0,
  total = 0,
  currentPage = 1,
  onPageChange,
}) {
  // Calculate the total number of pages
  const perPage = 10; // Default per page value
  const totalPages = Math.ceil(total / perPage);

  // Generate an array of page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // If there are many pages, limit the display
  const displayPageNumbers = [];
  if (totalPages <= 5) {
    // If 5 or fewer pages, show all
    for (let i = 1; i <= totalPages; i++) {
      displayPageNumbers.push(i);
    }
  } else {
    // Show current page, 2 before and 2 after if possible
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    // Adjust if we're near the end
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      displayPageNumbers.push(i);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      displayPageNumbers.unshift(1);
      if (startPage > 2) {
        displayPageNumbers.splice(1, 0, "...");
      }
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        displayPageNumbers.push("...");
      }
      displayPageNumbers.push(totalPages);
    }
  }

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div>
        Showing {showing > 0 ? (currentPage - 1) * perPage + 1 : 0} to{" "}
        {Math.min(currentPage * perPage, total)} of {total} entries
      </div>
      <nav>
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>

          {displayPageNumbers.map((page, index) =>
            page === "..." ? (
              <li key={`ellipsis-${index}`} className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            ) : (
              <li
                key={page}
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              </li>
            )
          )}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default UserPagination;
