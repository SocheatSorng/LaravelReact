import React, { useState } from "react";

function OrderFilter({ onStatusChange, onDateRangeChange }) {
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    onStatusChange(newStatus);
  };

  const handleFromDateChange = (e) => {
    const newFromDate = e.target.value;
    setFromDate(newFromDate);
    onDateRangeChange(newFromDate, toDate);
  };

  const handleToDateChange = (e) => {
    const newToDate = e.target.value;
    setToDate(newToDate);
    onDateRangeChange(fromDate, newToDate);
  };

  const clearFilters = () => {
    setStatus("");
    setFromDate("");
    setToDate("");
    onStatusChange("");
    onDateRangeChange("", "");
  };

  return (
    <div className="d-flex gap-2 flex-wrap">
      <select
        className="form-select form-select-sm"
        value={status}
        onChange={handleStatusChange}
        style={{ width: "150px" }}
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <div className="input-group input-group-sm" style={{ width: "170px" }}>
        <span className="input-group-text">From</span>
        <input
          type="date"
          className="form-control"
          value={fromDate}
          onChange={handleFromDateChange}
        />
      </div>

      <div className="input-group input-group-sm" style={{ width: "170px" }}>
        <span className="input-group-text">To</span>
        <input
          type="date"
          className="form-control"
          value={toDate}
          onChange={handleToDateChange}
        />
      </div>

      <button
        className="btn btn-sm btn-outline-secondary"
        onClick={clearFilters}
      >
        Clear
      </button>
    </div>
  );
}

export default OrderFilter;
