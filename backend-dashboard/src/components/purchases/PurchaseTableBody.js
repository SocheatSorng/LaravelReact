import React from 'react';
import PurchaseActions from './PurchaseActions';

function PurchaseTableBody() {
  const purchases = [
    {
      id: "PUR-2024-001",
      date: "29 Mar 2024",
      supplier: "Global Suppliers Inc.",
      amount: "$5,230.00",
      paymentStatus: "Paid",
      deliveryStatus: "Delivered",
    },
    // Add more purchases as needed
  ];

  return (
    <tbody>
      {purchases.map(purchase => (
        <tr key={purchase.id}>
          <td>
            <a href="#!" className="text-body fw-medium">{purchase.id}</a>
          </td>
          <td>{purchase.date}</td>
          <td>{purchase.supplier}</td>
          <td>{purchase.amount}</td>
          <td>
            <span className="badge bg-success-subtle text-success px-2 py-1">
              {purchase.paymentStatus}
            </span>
          </td>
          <td>
            <span className="badge bg-primary-subtle text-primary px-2 py-1">
              {purchase.deliveryStatus}
            </span>
          </td>
          <td>
            <PurchaseActions />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default PurchaseTableBody;