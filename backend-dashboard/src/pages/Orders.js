import React from 'react';
import StatCard from '../components/common/StatCard';
import SearchBar from '../components/common/SearchBar';
import OrderTableHeader from '../components/orders/OrderTableHeader';
import OrderTableBody from '../components/orders/OrderTableBody';
import OrderPagination from '../components/orders/OrderPagination';

function Orders() {
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
          count="1,235"
          icon="🛍️"
        />
        <StatCard 
          title="Pending Orders"
          count="35"
          icon="⏳"
        />
        <StatCard 
          title="Completed Orders"
          count="1,190"
          icon="✅"
        />
        <StatCard 
          title="Cancelled Orders"
          count="10"
          icon="❌"
        />
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">All Orders</h5>
              <div className="d-flex gap-2">
                <SearchBar placeholder="Search orders..." width="200px" />
                <button className="btn btn-primary btn-sm">
                  <span className="align-middle me-1">+</span>
                  Add Order
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <OrderTableHeader />
                  <OrderTableBody />
                </table>
              </div>
            </div>
            <div className="card-footer">
              <OrderPagination 
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

export default Orders;