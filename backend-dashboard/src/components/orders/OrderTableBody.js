import React from 'react';
import OrderActions from './OrderActions';

function OrderTableBody() {
  const orders = [
    {
      id: "#583488/80",
      date: "Apr 23, 2024",
      customer: "Gail C. Anderson",
      priority: "Normal", 
      total: "$1,230.00",
      paymentStatus: "Paid",
      items: 4,
      deliveryNumber: "#D-35227268",
      orderStatus: "Completed"
    },
    // Add more orders as needed
  ];

  return (
    <tbody>
      {orders.map(order => (
        <tr key={order.id}>
          <td>{order.id}</td>
          <td>{order.date}</td>
          <td>
            <a href="#!" className="link-primary fw-medium">{order.customer}</a>
          </td>
          <td>{order.priority}</td>
          <td>{order.total}</td>
          <td>
            <span className="badge bg-success text-light px-2 py-1 fs-13">
              {order.paymentStatus}
            </span>
          </td>
          <td>{order.items}</td>
          <td>{order.deliveryNumber}</td>
          <td>
            <span className="badge border border-success text-success px-2 py-1 fs-13">
              {order.orderStatus}
            </span>
          </td>
          <td>
            <OrderActions />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default OrderTableBody;