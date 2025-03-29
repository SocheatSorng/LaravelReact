import React from 'react';
import StatCard from '../components/common/StatCard';
import SearchBar from '../components/common/SearchBar';
import PurchaseTableHeader from '../components/purchases/PurchaseTableHeader';
import PurchaseTableBody from '../components/purchases/PurchaseTableBody';
import PurchasePagination from '../components/purchases/PurchasePagination';

function Purchases() {
  return (
    <div className="container-xxl">
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="fw-bold py-3 mb-2">Purchases</h4>
        </div>
      </div>

      <div className="row mb-4">
        <StatCard 
          title="Total Purchases"
          count="2,380"
          icon="💳"
        />
        <StatCard 
          title="Pending"
          count="120"
          icon="⏳"
        />
        <StatCard 
          title="Completed"
          count="1,950"
          icon="✅"
        />
        <StatCard 
          title="Cancelled"
          count="310"
          icon="❌"
        />
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">All Purchases</h5>
              <div className="d-flex gap-2">
                <SearchBar placeholder="Search purchases..." width="200px" />
                <button className="btn btn-primary btn-sm">
                  <span className="align-middle me-1">+</span>
                  Add Purchase
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <PurchaseTableHeader />
                  <PurchaseTableBody />
                </table>
              </div>
            </div>
            <div className="card-footer">
              <PurchasePagination 
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

export default Purchases;