import React, { useState, useEffect, useCallback } from "react";
import { bookService, userService, orderService } from "../services/api";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    TotalBooks: 0,
    TotalCategories: 0,
    TotalUsers: 0,
    TotalOrders: 0,
    TotalPurchases: 0,
    TotalRevenue: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define fetchStats outside of useEffect
  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null); // Clear any previous errors
      
      try {
        // Use the dedicated dashboard stats endpoint
        const response = await axios.get('http://localhost:8000/api/dashboard/stats');
        
        if (response.data && response.data.success) {
          // Use the data from the response
          setStats(response.data.data);
          return;
        }
      } catch (dashboardError) {
        console.error("Error fetching from dashboard endpoint:", dashboardError);
        // Continue to fallback method
      }
      
      // Fall back to individual API calls if the dashboard stats endpoint fails
      try {
        // Fetch books count
        const booksResponse = await bookService.getBooks();
        let bookCount = 0;
        if (booksResponse.data?.meta?.total) {
          bookCount = booksResponse.data.meta.total;
        } else if (booksResponse.data?.data?.length) {
          bookCount = booksResponse.data.data.length;
        }
        
        // Fetch categories count
        const categoriesResponse = await bookService.getCategories();
        let categoryCount = 0;
        if (categoriesResponse.success) {
          categoryCount = categoriesResponse.data.length;
        } else {
          console.error("Error fetching categories:", categoriesResponse.message);
        }
        
        // Fetch users count from user stats
        const usersResponse = await userService.getUserStats();
        let userCount = 0;
        if (usersResponse.success) {
          userCount = usersResponse.data.adminCount + usersResponse.data.activeUsersCount;
        }
        
        // Fetch orders count from order stats
        const ordersResponse = await orderService.getOrderStats();
        let orderCount = 0;
        let totalRevenue = 0;
        if (ordersResponse.success) {
          orderCount = ordersResponse.data.totalOrders;
        }
        
        // Fetch purchases count (assuming similar structure to orders)
        let purchaseCount = 0;
        try {
          const purchasesResponse = await axios.get('http://localhost:8000/api/purchases');
          if (purchasesResponse.data?.data?.length) {
            purchaseCount = purchasesResponse.data.data.length;
          }
        } catch (purchaseError) {
          console.error("Error fetching purchases:", purchaseError);
        }
        
        // Update the state with actual data
        setStats({
          TotalBooks: bookCount,
          TotalCategories: categoryCount,
          TotalUsers: userCount,
          TotalOrders: orderCount,
          TotalPurchases: purchaseCount,
          TotalRevenue: totalRevenue
        });
      } catch (fallbackError) {
        console.error("Error in fallback fetching:", fallbackError);
        
        // Set a user-friendly error message
        setError(
          "Unable to load dashboard data. Please check your network connection and try again."
        );
        
        // Fall back to zero values if all API calls fail
        setStats({
          TotalBooks: 0,
          TotalCategories: 0,
          TotalUsers: 0,
          TotalOrders: 0,
          TotalPurchases: 0,
          TotalRevenue: 0
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error loading dashboard!</h4>
        <p>{error}</p>
        <hr />
        <p className="mb-0">Please try refreshing or click the button below.</p>
        <button 
          className="btn btn-primary mt-3" 
          onClick={fetchStats}
        >
          <i className="bi bi-arrow-clockwise me-1"></i> Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading dashboard data...</p>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-6 col-xl-3">
            <div className="card overflow-hidden">
              <div className="card-body">
                <div className="row">
                  <div className="col-6">
                    <div className="avatar-md bg-soft-primary rounded">
                      <i className="bi bi-book fs-32 text-primary avatar-title"></i>
                    </div>
                  </div>
                  <div className="col-6 text-end">
                    <p className="text-muted mb-0 text-truncate">Books</p>
                    <h3 className="text-dark mt-1 mb-0">{stats.TotalBooks.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
              <div className="card-footer py-2 bg-light">
                <a href="/products" className="text-reset fw-semibold fs-12">View Details</a>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div className="card overflow-hidden">
              <div className="card-body">
                <div className="row">
                  <div className="col-6">
                    <div className="avatar-md bg-soft-primary rounded">
                      <i className="bi bi-list-check fs-32 text-primary avatar-title"></i>
                    </div>
                  </div>
                  <div className="col-6 text-end">
                    <p className="text-muted mb-0 text-truncate">Categories</p>
                    <h3 className="text-dark mt-1 mb-0">{stats.TotalCategories.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
              <div className="card-footer py-2 bg-light">
                <a href="/categories" className="text-reset fw-semibold fs-12">View Details</a>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div className="card overflow-hidden">
              <div className="card-body">
                <div className="row">
                  <div className="col-6">
                    <div className="avatar-md bg-soft-primary rounded">
                      <i className="bi bi-people fs-32 text-primary avatar-title"></i>
                    </div>
                  </div>
                  <div className="col-6 text-end">
                    <p className="text-muted mb-0 text-truncate">Users</p>
                    <h3 className="text-dark mt-1 mb-0">{stats.TotalUsers.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
              <div className="card-footer py-2 bg-light">
                <a href="/users" className="text-reset fw-semibold fs-12">View Details</a>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div className="card overflow-hidden">
              <div className="card-body">
                <div className="row">
                  <div className="col-6">
                    <div className="avatar-md bg-soft-primary rounded">
                      <i className="bi bi-bag fs-32 text-primary avatar-title"></i>
                    </div>
                  </div>
                  <div className="col-6 text-end">
                    <p className="text-muted mb-0 text-truncate">Orders</p>
                    <h3 className="text-dark mt-1 mb-0">{stats.TotalOrders.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
              <div className="card-footer py-2 bg-light">
                <a href="/orders" className="text-reset fw-semibold fs-12">View Details</a>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div className="card overflow-hidden">
              <div className="card-body">
                <div className="row">
                  <div className="col-6">
                    <div className="avatar-md bg-soft-primary rounded">
                      <i className="bi bi-credit-card fs-32 text-primary avatar-title"></i>
                    </div>
                  </div>
                  <div className="col-6 text-end">
                    <p className="text-muted mb-0 text-truncate">Purchases</p>
                    <h3 className="text-dark mt-1 mb-0">{stats.TotalPurchases.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
              <div className="card-footer py-2 bg-light">
                <a href="/purchases" className="text-reset fw-semibold fs-12">View Details</a>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div className="card overflow-hidden">
              <div className="card-body">
                <div className="row">
                  <div className="col-6">
                    <div className="avatar-md bg-soft-success rounded">
                      <i className="bi bi-currency-dollar fs-32 text-success avatar-title"></i>
                    </div>
                  </div>
                  <div className="col-6 text-end">
                    <p className="text-muted mb-0 text-truncate">Revenue</p>
                    <h3 className="text-dark mt-1 mb-0">${stats.TotalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
                  </div>
                </div>
              </div>
              <div className="card-footer py-2 bg-light">
                <span className="text-muted fw-semibold fs-12">From Orders</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 