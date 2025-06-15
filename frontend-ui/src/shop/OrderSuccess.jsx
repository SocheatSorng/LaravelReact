import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

  // Print function
  const handlePrint = () => {
    window.print();
  };

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
    orderId,
    orderNumber,
    customerInfo,
    items,
    totalAmount,
    paymentMethod,
    deliveryAddress,
    phone
  } = orderData;

  // // Debug logging to help identify the issue
  // console.log('OrderSuccess - Full orderData:', orderData);
  // console.log('OrderSuccess - deliveryAddress:', deliveryAddress);
  // console.log('OrderSuccess - deliveryAddress type:', typeof deliveryAddress);
  // console.log('OrderSuccess - deliveryAddress length:', deliveryAddress?.length);

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

              {/* Order Details Card */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="icofont-list me-2"></i>
                    Order Details
                  </h5>
                </div>
                <div className="card-body">
                  
                  {/* Customer Information */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <h6 className="text-primary">
                        <i className="icofont-user me-2"></i>
                        Customer Information
                      </h6>
                      <p className="mb-1">
                        <strong>Name:</strong> {customerInfo?.name || "Guest Customer"}
                      </p>
                      <p className="mb-1">
                        <strong>Phone:</strong> {phone}
                      </p>
                      <p className="mb-0">
                        <strong>Email:</strong> {customerInfo?.email || "guest@delivery.com"}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-primary">
                        <i className="icofont-location-pin me-2"></i>
                        Delivery Information
                      </h6>
                      <p className="mb-1">
                        <strong>Address:</strong>
                      </p>
                      <p className="mb-1" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {(() => {
                          // Handle different data types for deliveryAddress
                          if (typeof deliveryAddress === 'string') {
                            return deliveryAddress.trim() || 'No address provided';
                          } else if (typeof deliveryAddress === 'object' && deliveryAddress !== null) {
                            // If it's an object, try to format it nicely
                            if (deliveryAddress.address || deliveryAddress.street) {
                              return [
                                deliveryAddress.address || deliveryAddress.street,
                                deliveryAddress.city,
                                deliveryAddress.state,
                                deliveryAddress.postalCode || deliveryAddress.zipCode,
                                deliveryAddress.country
                              ].filter(Boolean).join(', ');
                            } else {
                              return JSON.stringify(deliveryAddress, null, 2);
                            }
                          } else {
                            return deliveryAddress || 'No address provided';
                          }
                        })()}
                      </p>
                      <p className="mb-0">
                        <strong>Delivery Cost:</strong> $1.00 (Cambodia only)
                      </p>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <h6 className="text-primary">
                        <i className="icofont-credit-card me-2"></i>
                        Payment Method
                      </h6>
                      <p className="mb-0">
                        <span className={`badge ${paymentMethod === 'PayPal' ? 'bg-info' : 'bg-success'}`}>
                          {paymentMethod === 'PayPal' ? 'PayPal' : 'Cash on Delivery'}
                        </span>
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-primary">
                        <i className="icofont-dollar me-2"></i>
                        Total Amount
                      </h6>
                      <p className="mb-0">
                        <strong className="text-success fs-5">${totalAmount?.toFixed(2)}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <h6 className="text-primary">
                      <i className="icofont-shopping-cart me-2"></i>
                      Ordered Items ({items?.length || 0} items)
                    </h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead className="table-light">
                          <tr>
                            <th>Book</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items?.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <div className="d-flex align-items-center">
                                  {item.image && (
                                    <img 
                                      src={item.image} 
                                      alt={item.title || item.name}
                                      className="me-2"
                                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                    />
                                  )}
                                  <span>{item.title || item.name || `Book #${item.BookID}`}</span>
                                </div>
                              </td>
                              <td>{item.quantity || item.Quantity}</td>
                              <td>${(item.price || item.Price)?.toFixed(2)}</td>
                              <td>${((item.price || item.Price) * (item.quantity || item.Quantity))?.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="table-light">
                          <tr>
                            <th colSpan="3">Subtotal:</th>
                            <th>${(totalAmount - 1)?.toFixed(2)}</th>
                          </tr>
                          <tr>
                            <th colSpan="3">Delivery:</th>
                            <th>$1.00</th>
                          </tr>
                          <tr className="table-success">
                            <th colSpan="3">Total:</th>
                            <th>${totalAmount?.toFixed(2)}</th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                </div>
              </div>

              {/* Next Steps */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-info text-white">
                  <h5 className="mb-0">
                    <i className="icofont-info-circle me-2"></i>
                    What's Next?
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="text-info">
                        <i className="icofont-clock-time me-2"></i>
                        Processing Time
                      </h6>
                      <p className="mb-3">
                        Your order will be processed within 1-2 business days. 
                        We'll prepare your books for delivery.
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-info">
                        <i className="icofont-delivery-time me-2"></i>
                        Delivery
                      </h6>
                      <p className="mb-3">
                        Delivery within Cambodia typically takes 2-5 business days. 
                        Our delivery team will contact you before delivery.
                      </p>
                    </div>
                  </div>
                  
                  {paymentMethod === 'Cash' && (
                    <div className="alert alert-warning">
                      <i className="icofont-info-circle me-2"></i>
                      <strong>Cash on Delivery:</strong> Please have the exact amount ready when our delivery team arrives.
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="text-center">
                <button onClick={handlePrint} className="btn btn-outline-primary me-3">
                  <i className="icofont-print me-2"></i>
                  Print Order
                </button>
                <Link to="/shop" className="btn btn-primary me-3">
                  <i className="icofont-shopping-cart me-2"></i>
                  Continue Shopping
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
    </div>
  );
};

export default OrderSuccess;
