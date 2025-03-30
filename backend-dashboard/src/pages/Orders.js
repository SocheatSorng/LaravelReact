import React, { useState, useEffect } from "react";
import StatCard from "../components/common/StatCard";
import SearchBar from "../components/common/SearchBar";
import OrderTableHeader from "../components/orders/OrderTableHeader";
import OrderTableBody from "../components/orders/OrderTableBody";
import OrderPagination from "../components/orders/OrderPagination";
import OrderFilter from "../components/orders/OrderFilter";
import { orderService } from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });

  // Pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dateRange, setDateRange] = useState({ from_date: "", to_date: "" });

  // Test API connection
  const testApiConnection = async () => {
    // If mock data is enabled, skip the connection test
    if (localStorage.getItem("useMockData") === "true") {
      setApiStatus("connected");
      setError(null);
      fetchOrders();
      fetchOrderStats();
      return;
    }

    setApiStatus("testing");
    try {
      // Try to get a single order
      const response = await orderService.getOrders({ per_page: 1 });
      console.log("API Test Response:", response);
      setApiStatus("connected");
      setError(null);
      // If successful, load the data
      fetchOrders();
      fetchOrderStats();
    } catch (err) {
      console.error("API Connection Test Failed:", err);
      setApiStatus("failed");
      if (err.response) {
        setError(
          `API connection failed: ${err.response.status} - ${
            err.response.data?.message || "Unknown error"
          }`
        );
      } else if (err.request) {
        setError(
          "API connection failed: No response from server. Check if Laravel API is running."
        );
      } else {
        setError(`API connection failed: ${err.message}`);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    // Test API connection on component mount
    testApiConnection();
  }, []);

  useEffect(() => {
    // Only fetch if we're connected
    if (apiStatus === "connected") {
      fetchOrders();
    }
  }, [apiStatus, currentPage, perPage, searchTerm, filterStatus, dateRange]);

  const fetchOrderStats = async () => {
    try {
      const response = await orderService.getOrderStats();
      console.log("Order stats response:", response);
      
      if (response.success) {
        const { 
          totalOrders, 
          pendingOrders, 
          processingOrders, 
          shippedOrders, 
          deliveredOrders, 
          cancelledOrders 
        } = response.data;
        
        setStats({
          total: totalOrders,
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders
        });
      }
    } catch (error) {
      console.error("Error fetching order statistics:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create clean params object (remove empty values)
      const params = {
        page: currentPage,
        per_page: perPage,
      };

      // Only add filter parameters if they have values
      if (filterStatus) {
        params.status = filterStatus;
      }

      if (dateRange.from_date) {
        params.from_date = dateRange.from_date;
      }

      if (dateRange.to_date) {
        params.to_date = dateRange.to_date;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      console.log("Fetching orders with params:", params);
      const response = await orderService.getOrders(params);
      console.log("Orders API response:", response);

      // Handle the response format from your Laravel backend
      if (response.data) {
        // The standard Laravel-style response should have a data property
        if (response.data.data) {
          if (Array.isArray(response.data.data)) {
            // Direct array in data property
            setOrders(response.data.data);
            setTotalItems(response.data.total || response.data.data.length);
          } else if (
            response.data.data.data &&
            Array.isArray(response.data.data.data)
          ) {
            // Nested data structure with pagination
            setOrders(response.data.data.data);
            setTotalItems(response.data.data.total);
          }
        } else if (Array.isArray(response.data)) {
          // Direct array response
          setOrders(response.data);
          setTotalItems(response.data.length);
        } else {
          console.error("Unexpected API response format:", response.data);
          setOrders([]);
          setTotalItems(0);
          setError(
            "Unexpected API response format. Check browser console for details."
          );
        }
      } else {
        setOrders([]);
        setTotalItems(0);
        setError("Empty response from API");
      }
      
      // After getting orders, fetch the latest stats
      fetchOrderStats();
    } catch (err) {
      console.error("API Error:", err);

      if (err.response) {
        // Server responded with error status
        const errorMsg =
          err.response.data?.message ||
          JSON.stringify(err.response.data) ||
          "Unknown server error";
        setError(`Error ${err.response.status}: ${errorMsg}`);
      } else if (err.request) {
        // No response received from server
        setError(
          "No response from server. Check your API connection and CORS settings."
        );
      } else {
        // Error in setting up the request
        setError(`Error: ${err.message}`);
      }

      setOrders([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleDateRangeChange = (from, to) => {
    setDateRange({
      from_date: from || undefined,
      to_date: to || undefined,
    });
    setCurrentPage(1); // Reset to first page when changing date range
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="container-xxl">
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="fw-bold py-3 mb-2">Orders</h4>
        </div>
      </div>

      <div className="row mb-4">
        <StatCard
          title="Total Orders"
          count={stats.total.toString()}
          icon="🛍️"
        />
        <StatCard
          title="Pending Orders"
          count={stats.pending.toString()}
          icon="⏳"
        />
        <StatCard
          title="Delivered Orders"
          count={stats.delivered.toString()}
          icon="✅"
        />
        <StatCard
          title="Cancelled Orders"
          count={stats.cancelled.toString()}
          icon="❌"
        />
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <SearchBar
                  placeholder="Search orders..."
                  width="250px"
                  onSearch={handleSearch}
                />
                <OrderFilter
                  onStatusChange={handleFilterChange}
                  onDateRangeChange={handleDateRangeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">All Orders</h5>
              <div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => (window.location.href = "/orders/new")}
                >
                  <span className="align-middle me-1">+</span>
                  Add Order
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <OrderTableHeader />
                  <OrderTableBody
                    orders={orders}
                    loading={loading}
                    error={error}
                    onRefresh={fetchOrders}
                  />
                </table>
              </div>
            </div>
            <div className="card-footer">
              <OrderPagination
                showing={orders.length}
                total={totalItems}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
