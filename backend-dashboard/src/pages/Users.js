import React from 'react';
import StatCard from '../components/common/StatCard';
import SearchBar from '../components/common/SearchBar';
import UserTableHeader from '../components/users/UserTableHeader';
import UserTableBody from '../components/users/UserTableBody';
import UserPagination from '../components/users/UserPagination';

function Users() {
  return (
    <div className="container-xxl">
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="fw-bold py-3 mb-2">Customer List</h4>
        </div>
      </div>

      <div className="row mb-4">
        <StatCard 
          title="All Customers"
          count="+22.63k"
          icon="👥"
          trend={{
            value: "34.4%",
            isPositive: true
          }}
        />
        <StatCard 
          title="Orders"
          count="+4.5k"
          icon="📦"
          trend={{
            value: "8.1%",
            isPositive: false
          }}
        />
        <StatCard 
          title="Services Request"
          count="+1.03k"
          icon="🎧"
          trend={{
            value: "12.6%",
            isPositive: true
          }}
        />
        <StatCard 
          title="Invoice & Payment"
          count="$38,908.00"
          icon="📃"
          trend={{
            value: "45.9%",
            isPositive: true
          }}
        />
      </div>

      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="d-flex card-header justify-content-between align-items-center">
              <h4 className="card-title">All Customers List</h4>
              <div className="dropdown">
                <button 
                  className="dropdown-toggle btn btn-sm btn-outline-light rounded"
                  data-bs-toggle="dropdown"
                >
                  This Month
                </button>
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
                  <UserTableHeader />
                  <UserTableBody />
                </table>
              </div>
            </div>
            <div className="card-footer">
              <UserPagination />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;