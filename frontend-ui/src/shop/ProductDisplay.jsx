import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductDisplay = ({ item }) => {
  const { title, id, price, brand, stock, description, images } = item;
  const [prequantity, setQuantity] = useState(1);
  const [coupon, setCoupon] = useState("");

  const handleIncrease = () => {
    setQuantity(prequantity + 1);
  };

  const handleDecrease = () => {
    if (prequantity > 0) {
      setQuantity(prequantity - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const product = {
      id: id,
      img: images,
      name: title,
      price: price,
      quantity: prequantity,
      coupon: coupon,
    };

    // Retrieve cart from local storage or initialize a new one
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProductIndex = existingCart.findIndex(
      (item) => item.id === id
    );

    if (existingProductIndex !== -1) {
      existingCart[existingProductIndex].quantity += prequantity;
    } else {
      existingCart.push(product);
    }

    // Update local storage
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Reset form fields
    setQuantity(1);
    setCoupon("");
  };

  return (
    <div>
      <div>
        <h4>{title}</h4>
        <h4>${price}</h4>
        <h6>{brand}</h6>
        <p>{description}</p>
      </div>

      {/* Cart component */}
      <div>
        <form onSubmit={handleSubmit}>
          {/* Container for quantity and discount code */}
          <div className="mb-3 d-flex justify-content-between align-items-center">
            {/* Updated Cart quantity input */}
            <div className="select-product" style={{ width: "100%" }}>
              <div className="d-flex align-items-center">
                <div className="cart-plus-minus">
                  <div className="dec qtybutton" onClick={handleDecrease}>
                    -
                  </div>
                  <input
                    type="text"
                    className="cart-plus-minus-box"
                    name="qtybutton"
                    id="qtybutton"
                    value={prequantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                  />
                  <div className="inc qtybutton" onClick={handleIncrease}>
                    +
                  </div>
                </div>
              </div>
            </div>

            {/* Coupon field */}
            <div className="select-product" style={{ width: "100%" }}>
              <input
                type="text"
                placeholder="Enter Discount Code"
                onChange={(e) => setCoupon(e.target.value)}
                className="form-control"
                style={{ fontSize: "0.85rem" }}
              />
            </div>
          </div>

          {/* Button section */}
          <button type="submit" className="lab-btn">
            <span>Add to Cart</span>
          </button>
          <Link to="/cart-page" className="lab-btn bg-primary">
            Check Out<span></span>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ProductDisplay;
