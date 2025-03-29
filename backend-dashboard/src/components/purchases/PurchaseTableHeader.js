import React from 'react';

function PurchaseTableHeader() {
  return (
    <thead className="bg-light-subtle">
      <tr>
        <th>Purchase ID</th>
        <th>Date</th>
        <th>Supplier</th>
        <th>Amount</th>
        <th>Payment Status</th>
        <th>Delivery Status</th>
        <th>Actions</th>
      </tr>
    </thead>
  );
}

export default PurchaseTableHeader;