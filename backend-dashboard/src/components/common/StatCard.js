import React from 'react';

function StatCard({ title, count, icon }) {
  return (
    <div className="col-md-6 col-xl-3">
      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h4 className="card-title mb-2">{title}</h4>
              <p className="text-muted fw-medium fs-22 mb-0">{count}</p>
            </div>
            <div className="avatar-md bg-primary bg-opacity-10 rounded">
              <span className="fs-24 align-middle">{icon}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatCard;