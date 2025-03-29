import React, { useState } from "react";
import { orderService } from "../../services/api";

function OrderActions({ orderId, onRefresh }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleViewOrder = () => {
    window.location.href = `/orders/${orderId}`;
  };

  const handleEditStatus = async (status) => {
    try {
      setIsLoading(true);
      const response = await orderService.updateOrder(orderId, {
        Status: status,
      });
      if (response.data.success) {
        alert(`Order status updated to: ${status}`);
        if (onRefresh) onRefresh();
      } else {
        alert("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("An error occurred while updating the order");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        setIsLoading(true);
        const response = await orderService.deleteOrder(orderId);
        if (response.data.success) {
          alert("Order deleted successfully");
          if (onRefresh) onRefresh();
        } else {
          alert("Failed to delete order");
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("An error occurred while deleting the order");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-sm dropdown-toggle hide-arrow"
        data-bs-toggle="dropdown"
        disabled={isLoading}
      >
        <i className="bx bx-dots-vertical-rounded"></i>
      </button>
      <div className="dropdown-menu">
        <a className="dropdown-item" href="#!" onClick={handleViewOrder}>
          <i className="bx bx-show-alt me-1"></i> View Details
        </a>
        <div className="dropdown-divider"></div>
        <a
          className="dropdown-item"
          href="#!"
          onClick={() => handleEditStatus("processing")}
        >
          <i className="bx bx-refresh me-1"></i> Mark Processing
        </a>
        <a
          className="dropdown-item"
          href="#!"
          onClick={() => handleEditStatus("shipped")}
        >
          <i className="bx bx-package me-1"></i> Mark Shipped
        </a>
        <a
          className="dropdown-item"
          href="#!"
          onClick={() => handleEditStatus("delivered")}
        >
          <i className="bx bx-check-circle me-1"></i> Mark Delivered
        </a>
        <a
          className="dropdown-item"
          href="#!"
          onClick={() => handleEditStatus("cancelled")}
        >
          <i className="bx bx-x-circle me-1"></i> Mark Cancelled
        </a>
        <div className="dropdown-divider"></div>
        <a
          className="dropdown-item text-danger"
          href="#!"
          onClick={handleDeleteOrder}
        >
          <i className="bx bx-trash me-1"></i> Delete
        </a>
      </div>
    </div>
  );
}

export default OrderActions;
