import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import "../components/modal.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const CheckoutPage = ({ orderTotal, cartItems }) => {
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Guest form data
  const [guestData, setGuestData] = useState({
    GuestName: "",
    GuestEmail: "",
    GuestPhone: "",
    ShippingAddress: "",
  });

  // handle Tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  // direct to home page
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  // Handle guest input changes
  const handleGuestInputChange = (e) => {
    const { name, value } = e.target;
    setGuestData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit guest order
  const handleGuestOrder = async () => {
    // Validate form
    if (
      !guestData.GuestName ||
      !guestData.GuestEmail ||
      !guestData.GuestPhone ||
      !guestData.ShippingAddress
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare order items
      const items = cartItems.map((item) => ({
        BookID: item.BookID,
        Quantity: item.quantity,
        Price: item.price,
      }));

      // Create order payload
      const orderPayload = {
        ...guestData,
        TotalAmount: orderTotal,
        PaymentMethod: "Cash",
        items: items,
      };

      // Send API request
      const response = await axios.post(
        "http://localhost:8000/api/orders/guest",
        orderPayload
      );

      if (response.data.success) {
        alert("Your order has been placed successfully!");
        localStorage.removeItem("cart");
        navigate(from, { replace: true });
      } else {
        setError(response.data.message || "Failed to place order");
      }
    } catch (err) {
      console.error("Order error:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while placing your order"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOrderConfirm = () => {
    alert("Your Order is placed successfully!");
    localStorage.removeItem("cart");
    navigate(from, { replace: true });
  };

  // PayPal payment handling
  const handlePayPalSuccess = (details, data) => {
    alert("Payment Successful! Thank you for your order.");
    handleOrderConfirm();
  };

  const handlePayPalError = (err) => {
    alert("Payment Failed: " + err);
  };

  useEffect(() => {
    if (activeTab === "paypal") {
      // Clean up previous PayPal button
      const paypalButtonContainer = document.getElementById(
        "paypal-button-container"
      );
      if (paypalButtonContainer) {
        paypalButtonContainer.innerHTML = ""; // Clear any existing button
      }

      // Dynamically load PayPal Buttons when PayPal tab is active
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: orderTotal.toFixed(2), // Use the dynamic total amount
                  },
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then(handlePayPalSuccess);
          },
          onError: handlePayPalError,
        })
        .render("#paypal-button-container");
    }
  }, [activeTab, orderTotal]); // Re-render PayPal buttons when activeTab or orderTotal changes

  return (
    <div className="modalCard">
      <Button variant="primary" className="py-2" onClick={handleShow}>
        Proceed to Checkout
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        className="modal fade"
        centered
        size="lg"
      >
        <div className="modal-dialog">
          <h5 className="px-3 mb-3">Select Your Payment Method</h5>
          <div className="modal-content">
            <div className="modal-body">
              <div className="tabs mt-3">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <a
                      className={`nav-link ${
                        activeTab === "cash" ? "active" : ""
                      }`}
                      id="cash-tab"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="cash"
                      aria-selected={activeTab === "cash"}
                      onClick={() => handleTabChange("cash")}
                      href="#cash"
                    >
                      <span className="payment-icon">
                        <i
                          className="fas fa-money-bill"
                          style={{ marginRight: "5px" }}
                        ></i>
                        Cash
                      </span>
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className={`nav-link ${
                        activeTab === "visa" ? "active" : ""
                      }`}
                      id="visa-tab"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="visa"
                      aria-selected={activeTab === "visa"}
                      onClick={() => handleTabChange("visa")}
                      href="#visa"
                    >
                      <img
                        src="https://i.imgur.com/sB4jftM.png"
                        alt=""
                        width="80"
                      />
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className={`nav-link ${
                        activeTab === "paypal" ? "active" : ""
                      }`}
                      id="paypal-tab"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="paypal"
                      aria-selected={activeTab === "paypal"}
                      onClick={() => handleTabChange("paypal")}
                      href="#paypal"
                    >
                      <img
                        src="https://i.imgur.com/yK7EDD1.png"
                        alt=""
                        width="80"
                      />
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className={`nav-link ${
                        activeTab === "aba" ? "active" : ""
                      }`}
                      id="aba-tab"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="aba"
                      aria-selected={activeTab === "aba"}
                      onClick={() => handleTabChange("aba")}
                      href="#aba"
                    >
                      <span className="payment-icon">
                        <i
                          className="fas fa-university"
                          style={{ marginRight: "5px" }}
                        ></i>
                        ABA
                      </span>
                    </a>
                  </li>
                </ul>

                {/* content */}
                <div className="tab-content" id="myTabContent">
                  {/* cash content */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "cash" ? "show active" : ""
                    }`}
                    id="cash"
                    role="tabpanel"
                    aria-labelledby="cash-tab"
                  >
                    <div className="mt-4 mx-4">
                      <div className="text-center mb-4">
                        <h5>Pay with Cash</h5>
                        <p>Pay upon delivery or pickup</p>
                      </div>

                      {error && (
                        <div className="alert alert-danger">{error}</div>
                      )}

                      <form className="guest-form">
                        <div className="form-group mb-3">
                          <label htmlFor="GuestName">Full Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            id="GuestName"
                            name="GuestName"
                            value={guestData.GuestName}
                            onChange={handleGuestInputChange}
                            required
                          />
                        </div>

                        <div className="form-group mb-3">
                          <label htmlFor="GuestEmail">Email Address *</label>
                          <input
                            type="email"
                            className="form-control"
                            id="GuestEmail"
                            name="GuestEmail"
                            value={guestData.GuestEmail}
                            onChange={handleGuestInputChange}
                            required
                          />
                        </div>

                        <div className="form-group mb-3">
                          <label htmlFor="GuestPhone">Phone Number *</label>
                          <input
                            type="tel"
                            className="form-control"
                            id="GuestPhone"
                            name="GuestPhone"
                            value={guestData.GuestPhone}
                            onChange={handleGuestInputChange}
                            required
                          />
                        </div>

                        <div className="form-group mb-3">
                          <label htmlFor="ShippingAddress">
                            Shipping Address *
                          </label>
                          <textarea
                            className="form-control"
                            id="ShippingAddress"
                            name="ShippingAddress"
                            value={guestData.ShippingAddress}
                            onChange={handleGuestInputChange}
                            rows="3"
                            required
                          ></textarea>
                        </div>
                      </form>

                      <div className="px-5 pay mt-4">
                        <button
                          className="btn btn-success btn-block"
                          onClick={handleGuestOrder}
                          disabled={loading}
                        >
                          {loading ? "Processing..." : "Confirm Cash Payment"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* visa content */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "visa" ? "active" : ""
                    }`}
                    id="visa"
                    role="tabpanel"
                    aria-labelledby="visa-tab"
                  >
                    <div className="mt-4 mx-4">
                      <div className="text-center">
                        <h5>Credit Card</h5>
                      </div>
                      <div className="form mt-3">
                        <div className="inputbox">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="form-control"
                            required
                          />
                          <span>Cardholder Name</span>
                        </div>
                        <div className="inputbox">
                          <input
                            type="text"
                            name="number"
                            id="number"
                            min="1"
                            max="999"
                            className="form-control"
                            required
                          />
                          <span>Card Number</span>
                          <i className="fa fa-eye"></i>
                        </div>
                        <div className="d-flex flex-row">
                          <div className="inputbox">
                            <input
                              type="text"
                              name="number"
                              id="number"
                              min="1"
                              max="999"
                              className="form-control"
                              required
                            />
                            <span>Expiration Date</span>
                          </div>
                          <div className="inputbox">
                            <input
                              type="text"
                              name="number"
                              id="number"
                              min="1"
                              max="999"
                              className="form-control"
                              required
                            />
                            <span>CVV</span>
                          </div>
                        </div>

                        <div className="px-5 pay">
                          <button
                            className="btn btn-success btn-block"
                            onClick={handleOrderConfirm}
                          >
                            Order Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* paypal content */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "paypal" ? "show active" : ""
                    }`}
                    id="paypal"
                    role="tabpanel"
                    aria-labelledby="paypal-tab"
                  >
                    <div className="mt-4 mx-4">
                      <div className="text-center">
                        <h5>Pay with PayPal</h5>
                      </div>
                      {/* PayPal Buttons */}
                      <div className="px-5 pay">
                        <div id="paypal-button-container"></div>
                      </div>
                    </div>
                  </div>

                  {/* ABA content */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "aba" ? "show active" : ""
                    }`}
                    id="aba"
                    role="tabpanel"
                    aria-labelledby="aba-tab"
                  >
                    <div className="mt-4 mx-4">
                      <div className="text-center">
                        <h5>Pay with ABA</h5>
                        <p className="mt-3">
                          Scan the QR code with ABA mobile app
                        </p>
                        {/* Placeholder for ABA QR code */}
                        <div
                          className="qr-placeholder mt-3 mb-3"
                          style={{
                            width: "150px",
                            height: "150px",
                            margin: "0 auto",
                            border: "1px solid #ddd",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                          }}
                        >
                          <i
                            className="fas fa-qrcode"
                            style={{ fontSize: "70px", color: "#666" }}
                          ></i>
                          <span style={{ marginTop: "10px" }}>ABA QR Code</span>
                        </div>
                      </div>
                      <div className="px-5 pay">
                        <button
                          className="btn btn-success btn-block"
                          onClick={handleOrderConfirm}
                        >
                          Confirm ABA Payment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* payment disclaimer */}
                <p className="mt-3 px-3 p-Disclaimer">
                  <em>Payment Disclaimer</em>: By confirming your order, you
                  agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CheckoutPage;
