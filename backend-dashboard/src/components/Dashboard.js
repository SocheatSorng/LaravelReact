import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/api';
import '../styles/dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    TotalBooks: 0,
    TotalCategories: 0,
    TotalUsers: 0,
    TotalOrders: 0,
    TotalRevenue: 0
  });
  const [recentData, setRecentData] = useState({
    recentBooks: [],
    recentOrders: [],
    recentUsers: [],
    counts: { booksCount: 0, ordersCount: 0, usersCount: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard statistics first
        let statsData = { TotalBooks: 0, TotalCategories: 0, TotalUsers: 0, TotalOrders: 0, TotalRevenue: 0 };
        try {
          statsData = await dashboardService.getDashboardStats();
          console.log('Dashboard stats data:', statsData);
        } catch (statsError) {
          console.error('Error fetching dashboard stats:', statsError);
        }
        
        // Fetch recent items
        const recentItems = await dashboardService.getRecentData();
        console.log('Dashboard recent data:', recentItems);
        
        // Make sure we have the expected data structure for recent items
        setRecentData({
          recentBooks: recentItems.recentBooks || [],
          recentOrders: recentItems.recentOrders || [],
          recentUsers: recentItems.recentUsers || [],
          counts: recentItems.counts || { booksCount: 0, ordersCount: 0, usersCount: 0 }
        });
        
        // Use the total counts from statsData if available, otherwise fall back to the length of recent items
        setStats({
          TotalBooks: statsData.TotalBooks > 0 ? statsData.TotalBooks : recentItems.counts?.booksCount || 0,
          TotalCategories: statsData.TotalCategories > 0 ? statsData.TotalCategories : 0,
          TotalUsers: statsData.TotalUsers > 0 ? statsData.TotalUsers : recentItems.counts?.usersCount || 0,
          TotalOrders: statsData.TotalOrders > 0 ? statsData.TotalOrders : recentItems.counts?.ordersCount || 0,
          TotalRevenue: statsData.TotalRevenue || 0
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const DashboardCard = ({ title, value, icon, color = 'primary', link, footer }) => (
    <div className="col-md-6 col-xl-3 mb-4">
      <div className="card overflow-hidden">
        <div className="card-body">
          <div className="row">
            <div className="col-6">
              <div className={`avatar-md bg-soft-${color} rounded`}>
                <i className={`${icon} avatar-title fs-32 text-${color}`}></i>
              </div>
            </div>
            <div className="col-6 text-end">
              <p className="text-muted mb-0 text-truncate">{title}</p>
              <h3 className="text-dark mt-1 mb-0">
                {title === 'Revenue' ? '$' : ''}{Number(value).toLocaleString(undefined, title === 'Revenue' ? { minimumFractionDigits: 2 } : undefined)}
              </h3>
            </div>
          </div>
        </div>
        <div className="card-footer py-2 bg-light">
          {link ? (
            <Link to={link} className="text-reset fw-semibold fs-12">View Details</Link>
          ) : (
            <span className="text-muted fw-semibold fs-12">{footer}</span>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="page-title-box">
            <h4 className="page-title">Dashboard</h4>
          </div>
        </div>
      </div>

      <div className="row">
        <DashboardCard
          title="Books"
          value={stats.TotalBooks}
          icon="fas fa-book" 
          link="/products"
          color="primary"
        />
        <DashboardCard
          title="Categories"
          value={stats.TotalCategories}
          icon="fas fa-list"
          link="/categories"
          color="info"
        />
        <DashboardCard
          title="Users"
          value={stats.TotalUsers}
          icon="fas fa-users"
          link="/users"
          color="warning"
        />
        <DashboardCard
          title="Orders"
          value={stats.TotalOrders}
          icon="fas fa-shopping-bag"
          link="/orders"
          color="danger"
        />
      </div>

      <div className="row">
        {/* Recent Books */}
        <div className="col-xl-4">
          <div className="card">
            <div className="card-header bg-transparent">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Recent Books</h5>
                <Link to="/products" className="btn btn-sm btn-primary">View All</Link>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentData.recentBooks.length > 0 ? (
                      recentData.recentBooks.map((book) => (
                        <tr key={book.BookID || book.id}>
                          <td>
                            <Link to={`/products/${book.BookID || book.id}`}>
                              {book.Title}
                            </Link>
                          </td>
                          <td>{book.Author}</td>
                          <td>${Number(book.Price).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">No books found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="col-xl-4">
          <div className="card">
            <div className="card-header bg-transparent">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Recent Orders</h5>
                <Link to="/orders" className="btn btn-sm btn-primary">View All</Link>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentData.recentOrders && recentData.recentOrders.length > 0 ? (
                      recentData.recentOrders.map((order) => (
                        <tr key={order.OrderID || order.id}>
                          <td>
                            <Link to={`/orders/${order.OrderID || order.id}`}>
                              #{order.OrderID || order.id}
                            </Link>
                          </td>
                          <td>
                            {order.user ? 
                              `${order.user.FirstName || ''} ${order.user.LastName || ''}` : 
                              (order.UserName || 'Unknown')}
                          </td>
                          <td>
                            <span className={`badge bg-${
                              order.Status === 'delivered' ? 'success' : 
                              order.Status === 'shipped' ? 'info' : 
                              order.Status === 'processing' ? 'warning' : 
                              order.Status === 'cancelled' ? 'danger' : 'secondary'
                            }`}>
                              {order.Status || 'Pending'}
                            </span>
                          </td>
                          <td>${Number(order.TotalAmount || 0).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">No orders found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="col-xl-4">
          <div className="card">
            <div className="card-header bg-transparent">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Recent Users</h5>
                <Link to="/users" className="btn btn-sm btn-primary">View All</Link>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentData.recentUsers && recentData.recentUsers.length > 0 ? (
                      recentData.recentUsers.map((user) => (
                        <tr key={user.UserID || user.id}>
                          <td>
                            <Link to={`/users/${user.UserID || user.id}`}>
                              {user.FirstName || ''} {user.LastName || ''}
                            </Link>
                          </td>
                          <td>{user.Email || ''}</td>
                          <td>
                            <span className={`badge bg-${
                              user.Role === 'admin' ? 'danger' : 
                              user.Role === 'staff' ? 'warning' : 'info'
                            }`}>
                              {user.Role || 'User'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">No users found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;