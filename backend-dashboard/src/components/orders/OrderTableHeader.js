import React from 'react';

function OrderTableHeader() {
  return (
    <thead className="bg-light-subtle">
      <tr>
        <th>Order ID</th>
        <th>Date</th>
        <th>Customer</th>
        <th>Total</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
  );
}

export default OrderTableHeader;