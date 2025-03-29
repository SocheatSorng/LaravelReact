import React from "react";
import OrderActions from "./OrderActions";

function OrderTableBody({ orders = [], loading, error, onRefresh }) {
  if (loading) {
    return (
      <tbody>
        <tr>
          <td colSpan="6" className="text-center py-4">
            <div
              className="spinner-border spinner-border-sm text-primary me-2"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            Loading orders...
          </td>
        </tr>
      </tbody>
    );
  }

  if (error) {
    return (
      <tbody>
        <tr>
          <td colSpan="6" className="text-center py-4">
            <div className="alert alert-danger mb-0">
              <i className="bx bx-error-circle me-2"></i>
              {error}
              <button
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={onRefresh}
              >
                <i className="bx bx-refresh me-1"></i> Retry
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan="6" className="text-center py-4">
            <div className="alert alert-info mb-0">
              <i className="bx bx-info-circle me-2"></i>
              No orders found
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  // Helper to safely get property with multiple possible capitalizations
  const getProp = (obj, propName, defaultValue = "") => {
    if (!obj) return defaultValue;

    // Try camelCase, PascalCase, and lowercase
    const camelCase = propName.charAt(0).toLowerCase() + propName.slice(1);
    const pascalCase = propName.charAt(0).toUpperCase() + propName.slice(1);
    const lowercase = propName.toLowerCase();

    return (
      obj[propName] ||
      obj[camelCase] ||
      obj[pascalCase] ||
      obj[lowercase] ||
      defaultValue
    );
  };

  // Helper to format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "$0.00";
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <tbody>
      {orders.map((order) => {
        // Extract user info
        const user = order.user || {};
        const firstName = getProp(user, "FirstName", "");
        const lastName = getProp(user, "LastName", "");
        const userName =
          firstName && lastName
            ? `${firstName} ${lastName}`
            : getProp(user, "UserName", "Unknown User");

        // Extract order properties
        const orderId = getProp(order, "OrderID", getProp(order, "id", "0"));
        const orderDate = getProp(order, "OrderDate", new Date().toISOString());
        const totalAmount = getProp(order, "TotalAmount", 0);
        const status = getProp(order, "Status", "unknown");

        return (
          <tr key={orderId}>
            <td>#{orderId}</td>
            <td>{new Date(orderDate).toLocaleDateString()}</td>
            <td>
              <a href="#!" className="link-primary fw-medium">
                {userName}
              </a>
            </td>
            <td>{formatCurrency(totalAmount)}</td>
            <td>
              <span
                className={`badge ${getStatusBadgeClass(
                  status
                )} px-2 py-1 fs-13`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
              </span>
            </td>
            <td>
              <OrderActions orderId={orderId} onRefresh={onRefresh} />
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}

// Helper function to determine badge class based on status
function getStatusBadgeClass(status) {
  switch ((status || "").toLowerCase()) {
    case "pending":
      return "bg-warning text-dark";
    case "processing":
      return "bg-info text-white";
    case "shipped":
      return "bg-primary text-white";
    case "delivered":
      return "bg-success text-white";
    case "cancelled":
      return "bg-danger text-white";
    default:
      return "bg-secondary text-white";
  }
}

export default OrderTableBody;
