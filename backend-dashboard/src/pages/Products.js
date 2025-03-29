import React from 'react';
import StatCard from '../components/common/StatCard';
import SearchBar from '../components/common/SearchBar';
import ProductTableHeader from '../components/products/ProductTableHeader';
import ProductTableBody from '../components/products/ProductTableBody';
import ProductPagination from '../components/products/ProductPagination';

function Products() {
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
          count="1,530"
          icon="👕"
        />
        <StatCard 
          title="Active Products"
          count="1,260"
          icon="✅"
        />
        <StatCard 
          title="Out of Stock"
          count="240"
          icon="⚠️"
        />
        <StatCard 
          title="Low Stock"
          count="30"
          icon="📉"
        />
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">All Product List</h5>
              <div className="d-flex gap-2">
                <SearchBar placeholder="Search products..." width="200px" />
                <button className="btn btn-primary btn-sm">
                  <span className="align-middle me-1">+</span>
                  Add Product
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <ProductTableHeader />
                  <ProductTableBody />
                </table>
              </div>
            </div>
            <div className="card-footer">
              <ProductPagination 
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

export default Products;