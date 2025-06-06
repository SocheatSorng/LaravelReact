import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import delImgUrl from "../assets/images/shop/del.png";
import CheckoutPage from "./CheckOutPage";
import { getImageUrl } from "../utilis/apiService";
import { useCart } from "../hooks/useCart";


// Fallback image in case the item image is missing or broken
const fallbackImage = "/assets/images/product-placeholder.png";

const CartPage = () => {
  const {
    cartItems,
    cartCount,
    cartTotal,
    updateItemQuantity,
    removeFromCart,
    refreshCart,
    isLoading
  } = useCart();

  const [error, setError] = useState(null);

  // Delivery information state (simplified)
  const [shippingInfo, setShippingInfo] = useState({
    phone: '',
    address: ''
  });

  // Refresh cart data when component mounts
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // calculate prices
  const calculateTotalPrice = (item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 1;
    return price * quantity;
  };

  // handle quantity increase
  const handleIncrease = async (item) => {
    try {
      const newQuantity = parseInt(item.quantity) + 1;
      const result = await updateItemQuantity(item.id, newQuantity);
      if (!result.success) {
        setError(result.message || "Failed to update quantity");
      }
    } catch (error) {
      console.error("Error increasing quantity:", error);
      setError("Failed to update quantity");
    }
  };

  // handle quantity decrease
  const handleDecrease = async (item) => {
    try {
      const newQuantity = parseInt(item.quantity) - 1;
      if (newQuantity > 0) {
        const result = await updateItemQuantity(item.id, newQuantity);
        if (!result.success) {
          setError(result.message || "Failed to update quantity");
        }
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      setError("Failed to update quantity");
    }
  };

  // handle item removal
  const handleRemoveItem = async (item) => {
    try {
      const result = await removeFromCart(item.id);
      if (!result.success) {
        setError(result.message || "Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      setError("Failed to remove item");
    }
  };

  // Delivery information handler
  const handleShippingInfoChange = (field, value) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // cart subtotal
  const cartSubTotal = cartItems.reduce((total, item) => {
    return total + calculateTotalPrice(item);
  }, 0);

  // order total (always includes $1 delivery)
  const orderTotal = cartSubTotal + 1.00;

  if (error) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-danger">{error}</h3>
        <Link to="/shop" className="btn btn-primary mt-3">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={"Shop Cart"} curPage={"Cart Page"} />

      <div className="shop-cart padding-tb">
        <div className="container">
          {/* Error Display */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError(null)}
                aria-label="Close"
              ></button>
            </div>
          )}

          <div className="section-wrapper">
            {cartItems.length === 0 ? (
              <div className="text-center py-5">
                <h4>Your cart is empty</h4>
                <Link to="/shop" className="btn btn-primary mt-3">
                  Browse Books
                </Link>
              </div>
            ) : (
              <>
                {/* cart top */}
                <div className="cart-top">
                  <table>
                    <thead>
                      <tr>
                        <th className="cat-product">Product</th>
                        <th className="cat-price">Price</th>
                        <th className="cat-quantity">Quantity</th>
                        <th className="cat-toprice">Total</th>
                        <th className="cat-edit">Edit</th>
                      </tr>
                    </thead>

                    {/* table body */}
                    <tbody>
                      {cartItems.map((item, indx) => (
                        <tr key={indx}>
                          <td className="product-item cat-product">
                            <div className="p-thumb">
                              <Link to={`/shop/${item.id}`}>
                                {/* Use BookID to display the image */}
                                <img
                                  src={
                                    item.BookID
                                      ? getImageUrl(
                                          `books/${item.BookID}/image`
                                        )
                                      : fallbackImage
                                  }
                                  alt={item.name}
                                  onError={(e) => {
                                    e.target.src = fallbackImage;
                                  }}
                                />
                              </Link>
                            </div>
                            <div className="p-content">
                              <Link to={`/shop/${item.id}`}>{item.name}</Link>
                            </div>
                          </td>

                          <td className="cat-price">
                            ${parseFloat(item.price).toFixed(2)}
                          </td>

                          <td className="cat-quantity">
                            <div className="cart-plus-minus">
                              <div
                                className="dec qtybutton"
                                onClick={() => handleDecrease(item)}
                                style={{
                                  opacity: isLoading ? 0.6 : 1,
                                  pointerEvents: isLoading ? 'none' : 'auto'
                                }}
                              >
                                -
                              </div>
                              <input
                                type="text"
                                className="cart-plus-minus-box"
                                name="qtybutton"
                                value={item.quantity}
                                readOnly
                              />
                              <div
                                className="inc qtybutton"
                                onClick={() => handleIncrease(item)}
                                style={{
                                  opacity: isLoading ? 0.6 : 1,
                                  pointerEvents: isLoading ? 'none' : 'auto'
                                }}
                              >
                                +
                              </div>
                            </div>
                          </td>

                          <td className="cat-toprice">
                            ${calculateTotalPrice(item).toFixed(2)}
                          </td>

                          <td className="cat-edit">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item)}
                              disabled={isLoading}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: '0',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.6 : 1
                              }}
                              title="Remove item from cart"
                            >
                              {isLoading ? (
                                <div className="spinner-border spinner-border-sm" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                              ) : (
                                <img src={delImgUrl} alt="Delete Item" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* cart top ends */}

                {/* card bottom */}
                <div className="cart-bottom">
                  {/* checkout box */}
                  <div className="cart-checkout-box">
                    <form
                      className="coupon"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <input
                        className="cart-page-input-text"
                        type="text"
                        name="coupon"
                        id="coupon"
                        placeholder="Coupon code ...."
                      />
                      <input type="submit" value={"Apply Coupon"} />
                    </form>
                    <form
                      className="cart-checkout"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <input type="submit" value="Update Cart" />
                      <div>
                        {/* Pass the orderTotal and cartItems to CheckoutPage */}
                        <CheckoutPage
                          orderTotal={orderTotal}
                          cartItems={cartItems}
                        />
                      </div>
                    </form>
                  </div>

                  {/* checkout box end */}

                  {/* shopping box */}
                  <div className="shiping-box">
                    <div className="row">
                      <div className="col-md-6 col-12">
                        <div className="calculate-shiping">
                          <h3>🚚 Delivery Information</h3>
                          <div className="delivery-notice mb-3 p-3" style={{backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px'}}>
                            <div className="d-flex align-items-center">
                              <span style={{fontSize: '1.2em', marginRight: '8px'}}>🇰🇭</span>
                              <strong>Cambodia Delivery - $1.00</strong>
                            </div>
                            <small className="text-muted">Fixed delivery cost within Cambodia</small>
                          </div>






                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="cart-overview">
                          <h3>Cart Totals</h3>
                          <ul className="lab-ul">
                            <li>
                              <span className="pull-left">Cart Subtotal</span>
                              <p className="pull-right">
                                $ {cartSubTotal.toFixed(2)}
                              </p>
                            </li>
                            <li>
                              <span className="pull-left">Items Count</span>
                              <p className="pull-right">
                                {cartItems.reduce((total, item) => total + item.quantity, 0)} books
                              </p>
                            </li>



                            <li className="order-total-row">
                              <span className="pull-left fw-bold">Order Total</span>
                              <p className="pull-right fw-bold fs-5">
                                $ {orderTotal.toFixed(2)}
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
