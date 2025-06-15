import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);



  useEffect(() => {
    // Get order data from location state
    const orderInfo = location.state?.orderData;
    
    if (!orderInfo) {
      // If no order data, redirect to home
      navigate("/", { replace: true });
      return;
    }

    setOrderData(orderInfo);

    // Clear cart from localStorage since order is successful
    localStorage.removeItem("cart");

    // Also clear any other cart-related data
    localStorage.removeItem("cartItems");
    localStorage.removeItem("cartTotal");

    // Dispatch a custom event to notify other components that cart is cleared
    window.dispatchEvent(new CustomEvent('cartCleared'));
  }, [location.state, navigate]);

  if (!orderData) {
    return (
      <div>
        <PageHeader title="Order Confirmation" curPage="Order Success" />
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center">
              <div className="alert alert-warning">
                <i className="icofont-exclamation-triangle" style={{ fontSize: "2rem" }}></i>
                <h4 className="mt-3">No Order Information Found</h4>
                <p>We couldn't find any order details. This might happen if you accessed this page directly.</p>
                <Link to="/shop" className="btn btn-primary me-2">
                  <i className="icofont-shopping-cart me-2"></i>
                  Go Shopping
                </Link>
                <Link to="/" className="btn btn-outline-secondary">
                  <i className="icofont-home me-2"></i>
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    orderNumber
  } = orderData;

  return (
    <div>
      <PageHeader title="Order Confirmation" curPage="Order Success" />

      {/* Custom CSS for order success page */}
      <style>
        {`
          .order-success-section {
            background-color: #f8f9fa;
            min-height: 80vh;
          }

          .success-icon {
            animation: successPulse 2s ease-in-out infinite;
          }

          @keyframes successPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }

          .card {
            border: none;
            border-radius: 12px;
          }

          .card-header {
            border-radius: 12px 12px 0 0 !important;
            font-weight: 600;
          }

          .table th {
            border-top: none;
            font-weight: 600;
            color: #495057;
          }

          .badge {
            font-size: 0.9em;
            padding: 0.5em 0.8em;
          }

          .btn {
            border-radius: 8px;
            font-weight: 500;
            padding: 0.75rem 1.5rem;
          }

          .alert {
            border-radius: 8px;
          }

          /* Print styles */
          @media print {
            .btn, .no-print {
              display: none !important;
            }

            .card {
              border: 1px solid #dee2e6 !important;
              box-shadow: none !important;
            }

            .card-header {
              background-color: #f8f9fa !important;
              color: #000 !important;
            }

            body {
              background: white !important;
            }

            .order-success-section {
              background: white !important;
              padding: 0 !important;
            }
          }
        `}
      </style>
      
      <div className="order-success-section padding-tb">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              
              {/* Success Header */}
              <div className="success-header text-center mb-5">
                <div className="success-icon mb-4">
                  <i className="icofont-check-circled" style={{
                    fontSize: "4rem",
                    color: "#28a745",
                    background: "#f8f9fa",
                    borderRadius: "50%",
                    padding: "1rem",
                    border: "3px solid #28a745"
                  }}></i>
                </div>
                <h2 className="text-success mb-3">Order Placed Successfully!</h2>
                <p className="lead text-muted">
                  Thank you for your order. We've received your order and will process it shortly.
                </p>
                {orderNumber && (
                  <div className="alert alert-info">
                    <strong>Order Number:</strong> #{orderNumber}
                  </div>
                )}
              </div>







            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
