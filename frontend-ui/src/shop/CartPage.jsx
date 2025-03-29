import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import delImgUrl from "../assets/images/shop/del.png";
import CheckoutPage from './CheckOutPage';

// Fallback image in case the item image is missing or broken
const fallbackImage = "../assets/images/shop/default-product.png";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // fetch cart items from local storage
        const storedCartItems = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCartItems);
    }, []);

    // calculate prices
    const calculateTotalPrice = (item) => {
        return item.price * item.quantity;
    };

    // handle quantity increase
    const handleIncrease = (item) => {
        item.quantity += 1;
        setCartItems([...cartItems]);

        // update local storage with new cart items
        localStorage.setItem("cart", JSON.stringify(cartItems));
    };

    // handle quantity decrease
    const handleDecrease = (item) => {
        if (item.quantity > 1) {
            item.quantity -= 1;
            setCartItems([...cartItems]);

            // update local storage with new cart items
            localStorage.setItem("cart", JSON.stringify(cartItems));
        }
    };

    // handle item removal
    const handleRemoveItem = (item) => {
        const updatedCart = cartItems.filter((cartItem) => cartItem.id !== item.id);

        // update new cart
        setCartItems(updatedCart);

        updateLocalStorage(updatedCart);
    };

    const updateLocalStorage = (cart) => {
        localStorage.setItem("cart", JSON.stringify(cart));
    };

    // cart subtotal
    const cartSubTotal = cartItems.reduce((total, item) => {
        return total + calculateTotalPrice(item);
    }, 0);

    // order total
    const orderTotal = cartSubTotal;

    return (
        <div>
            <PageHeader title={"Shop Cart"} curPage={"Cart Page"} />

            <div className="shop-cart padding-tb">
                <div className="container">
                    <div className="section-wrapper">
                        {/* cart top */}
                        <div className="cart-top">
                            <table>
                                <thead>
                                    <tr>
                                        <th className='cat-product'>Product</th>
                                        <th className='cat-price'>Price</th>
                                        <th className='cat-quantity'>Quantity</th>
                                        <th className='cat-toprice'>Total</th>
                                        <th className='cat-edit'>Edit</th>
                                    </tr>
                                </thead>

                                {/* table body */}
                                <tbody>
                                    {
                                        cartItems.map((item, indx) => (
                                            <tr key={indx}>
                                                <td className="product-item cat-product">
                                                    <div className="p-thumb">
                                                        <Link to="/shop">
                                                            {/* Use the first image from the array or fallback */}
                                                            <img src={item.img && item.img[0] ? item.img[0] : fallbackImage} alt={item.name} />
                                                        </Link>
                                                    </div>
                                                    <div className="p-content">
                                                        <Link to="/shop">{item.name}</Link>
                                                    </div>
                                                </td>

                                                <td className="cat-price">${item.price.toFixed(2)}</td>

                                                <td className="cat-quantity">
                                                    <div className="cart-plus-minus">
                                                        <div className="dec qtybutton" onClick={() => handleDecrease(item)}>-</div>
                                                        <input
                                                            type="text"
                                                            className='cart-plus-minus-box'
                                                            name="qtybutton"
                                                            value={item.quantity}
                                                            readOnly
                                                        />
                                                        <div className="inc qtybutton" onClick={() => handleIncrease(item)}>+</div>
                                                    </div>
                                                </td>

                                                <td className='cat-toprice'>${calculateTotalPrice(item).toFixed(2)}</td>

                                                <td className="cat-edit">
                                                    <a href="#" onClick={() => handleRemoveItem(item)} >
                                                        <img src={delImgUrl} alt="Delete Item" />
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>

                        {/* cart top ends */}

                        {/* card bottom */}
                        <div className="cart-bottom">
                            {/* checkout box */}
                            <div className="cart-checkout-box">
                                <form className="coupon">
                                    <input className="cart-page-input-text" type="text" name="coupon" id="coupon" placeholder='Coupon code ....' />
                                    <input type="submit" value={"Apply Coupon"} />
                                </form>
                                <form className='cart-checkout'>
                                    <input type="submit" value="Update Cart" />
                                    <div>
                                        {/* Pass the orderTotal to CheckoutPage */}
                                        <CheckoutPage orderTotal={orderTotal} />
                                    </div>
                                </form>
                            </div>

                            {/* checkout box end */}

                            {/* shopping box */}
                            <div className="shiping-box">
                                <div className="row">
                                    <div className="col-md-6 col-12">
                                        <div className="calculate-shiping">
                                            <h3>Calculate Shipping</h3>
                                            <div className="outline-select">
                                                <select>
                                                    <option value="uk">Cambodia</option>
                                                    <option value="us">United State</option>
                                                    <option value="cat">Canada</option>
                                                    <option value="jp">Japan</option>
                                                </select>
                                                <span className="select-icon">
                                                    <i className='icofont-rounded-down'></i>
                                                </span>
                                            </div>

                                            <div className="outline-select shipping-select">
                                                <select>
                                                    <option value="pp">Phnom Penh</option>
                                                    <option value="ny">New York</option>
                                                    <option value="syd">Sydney</option>
                                                    <option value="tk">Tokyo</option>
                                                </select>
                                                <span className="select-icon">
                                                    <i className="icofont-rounded-down"></i>
                                                </span>
                                            </div>
                                            <input type="text" name="postalCode" id="postalCode" placeholder='Postalcode/ZIP *' className='cart-page-input-text' />
                                            <button type="submit">Update Address</button>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12">
                                        <div className="cart-overview">
                                            <h3>Cart Totals</h3>
                                            <ul className='lab-ul'>
                                                <li>
                                                    <span className='pull-left'>Cart Subtotal</span>
                                                    <p className='pull-right'>$ {cartSubTotal.toFixed(2)}</p>
                                                </li>
                                                <li>
                                                    <span className='pull-left'>Shipping and Handling</span>
                                                    <p className='pull-right'>Free Shipping</p>
                                                </li>
                                                <li>
                                                    <span className='pull-left'>Order Total</span>
                                                    <p className='pull-right'>$ {orderTotal.toFixed(2)}</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
