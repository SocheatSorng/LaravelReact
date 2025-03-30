import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../components/common/StatCard';
import SearchBar from '../components/common/SearchBar';
import BookTableHeader from '../components/books/BookTableHeader';
import BookTableBody from '../components/books/BookTableBody';
import BookPagination from '../components/books/BookPagination';

function BookDetail() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    showing: 10,
    currentPage: 1
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookStats = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call to get book stats
        // const response = await axios.get('http://localhost:8000/api/books/stats');
        // setStats(response.data);
        
        // For now, we'll simulate this with a setTimeout
        setTimeout(() => {
          setStats({
            totalBooks: 0, // This will be updated when the actual books are fetched
            showing: 10,
            currentPage: 1
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching book stats:', error);
        setLoading(false);
      }
    };

    fetchBookStats();
  }, []);

  const handleSearch = (searchTerm) => {
    // This would be implemented to filter books based on the search term
    console.log('Searching for:', searchTerm);
  };

  const handlePageChange = (page) => {
    setStats(prevStats => ({
      ...prevStats,
      currentPage: page
    }));
  };

  return (
    <div className="container-xxl">
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="fw-bold py-3 mb-2">Book Details</h4>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <SearchBar onSearch={handleSearch} placeholder="Search books..." />
        </div>
        <div className="col-md-6 text-end">
          <a href="/books/create" className="btn btn-primary">
            <i className="bi bi-plus-circle me-1"></i> Add New Book
          </a>
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
                showing={stats.showing} 
                total={stats.totalBooks} 
                currentPage={stats.currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;