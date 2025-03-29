import React from 'react';
import StatCard from '../components/common/StatCard';
import SearchBar from '../components/common/SearchBar';
import BookTableHeader from '../components/books/BookTableHeader';
import BookTableBody from '../components/books/BookTableBody';
import BookPagination from '../components/books/BookPagination';

function BookDetail() {
  return (
    <div className="container-xxl">
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="fw-bold py-3 mb-2">Book Details</h4>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="d-flex card-header justify-content-between align-items-center">
              <div>
                <h4 className="card-title">All Book List</h4>
              </div>
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
            </div>

            <div>
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover table-centered">
                  <BookTableHeader />
                  <BookTableBody />
                </table>
              </div>
            </div>

            <div className="card-footer border-top">
              <BookPagination 
                showing={10} 
                total={100} 
                currentPage={1}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;