import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bookService } from "../services/api";
import StatCard from "../components/common/StatCard";
import SearchBar from "../components/common/SearchBar";
import ProductTableHeader from "../components/products/ProductTableHeader";
import ProductTableBody from "../components/products/ProductTableBody";
import ProductPagination from "../components/products/ProductPagination";

function Products() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    outOfStock: 0,
    lowStock: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch books on component mount and when pagination or search changes
  useEffect(() => {
    fetchBooks();
  }, [pagination.currentPage, pagination.perPage, searchTerm]);

  // Function to fetch books from API
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        per_page: pagination.perPage,
        search: searchTerm || undefined,
      };

      const response = await bookService.getBooks(params);
      setBooks(response.data.data);

      // Update pagination information
      setPagination((prev) => ({
        ...prev,
        total: response.data.meta.total,
        lastPage: response.data.meta.last_page,
      }));

      // Calculate stats
      calculateStats(response.data.data);

      setLoading(false);
    } catch (err) {
      setError("Failed to load books. Please try again later.");
      setLoading(false);
      console.error("Error fetching books:", err);
    }
  };

  // Calculate stats for the dashboard
  const calculateStats = (bookData) => {
    let active = 0;
    let outOfStock = 0;
    let lowStock = 0;

    bookData.forEach((book) => {
      if (book.StockQuantity > 10) active++;
      if (book.StockQuantity === 0) outOfStock++;
      if (book.StockQuantity > 0 && book.StockQuantity <= 10) lowStock++;
    });

    setStats({
      total: bookData.length,
      active,
      outOfStock,
      lowStock,
    });
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination((prev) => ({
      ...prev,
      currentPage: 1, // Reset to first page on new search
    }));
  };

  // Handle adding a new book
  const handleAddBook = () => {
    navigate("/books/create");
  };

  return (
    <div className="container-xxl">
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="fw-bold py-3 mb-2">Products</h4>
        </div>
      </div>

      <div className="row mb-4">
        <StatCard
          title="Total Products"
          count={pagination.total.toString()}
          icon="📚"
        />
        <StatCard
          title="Active Products"
          count={stats.active.toString()}
          icon="✅"
        />
        <StatCard
          title="Out of Stock"
          count={stats.outOfStock.toString()}
          icon="⚠️"
        />
        <StatCard
          title="Low Stock"
          count={stats.lowStock.toString()}
          icon="📉"
        />
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">All Products List</h5>
              <div className="d-flex gap-2">
                <SearchBar
                  placeholder="Search products..."
                  width="200px"
                  onSearch={handleSearch}
                />
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleAddBook}
                >
                  <span className="align-middle me-1">+</span>
                  Add Product
                </button>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <ProductTableHeader />
                    <ProductTableBody products={books} onRefresh={fetchBooks} />
                  </table>
                </div>
              )}
            </div>
            <div className="card-footer">
              <ProductPagination
                showing={books.length}
                total={pagination.total}
                currentPage={pagination.currentPage}
                lastPage={pagination.lastPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
