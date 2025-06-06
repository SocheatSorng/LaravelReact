// Cart utility functions for managing cart operations

/**
 * Get cart items from localStorage
 * @returns {Array} Array of cart items
 */
export const getCartItems = () => {
  try {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    return cartItems.map((item) => ({
      ...item,
      price: parseFloat(item.price) || 0,
      quantity: parseInt(item.quantity) || 1,
    }));
  } catch (error) {
    console.error("Error getting cart items:", error);
    return [];
  }
};

/**
 * Get total number of items in cart
 * @returns {number} Total quantity of items
 */
export const getCartItemCount = () => {
  const cartItems = getCartItems();
  return cartItems.reduce((total, item) => total + (parseInt(item.quantity) || 1), 0);
};

/**
 * Add item to cart
 * @param {Object} product - Product to add to cart
 * @param {number} quantity - Quantity to add (default: 1)
 * @returns {boolean} Success status
 */
export const addToCart = (product, quantity = 1) => {
  try {
    const existingCart = getCartItems();
    const numericPrice = parseFloat(product.Price || product.price) || 0;
    
    // Create standardized product object
    const cartItem = {
      id: product.BookID || product.id,
      BookID: product.BookID || product.id, // Store BookID for image
      name: product.Title || product.title || product.name,
      price: numericPrice,
      quantity: parseInt(quantity),
      author: product.Author || product.author || "",
    };

    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex(
      (item) => item.id === cartItem.id
    );

    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      existingCart[existingItemIndex].quantity += cartItem.quantity;
    } else {
      // Add new item to cart
      existingCart.push(cartItem);
    }

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));
    return true;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return false;
  }
};

/**
 * Remove item from cart
 * @param {string|number} itemId - ID of item to remove
 * @returns {boolean} Success status
 */
export const removeFromCart = (itemId) => {
  try {
    const existingCart = getCartItems();
    const updatedCart = existingCart.filter((item) => item.id !== itemId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    return true;
  } catch (error) {
    console.error("Error removing from cart:", error);
    return false;
  }
};

/**
 * Update item quantity in cart
 * @param {string|number} itemId - ID of item to update
 * @param {number} newQuantity - New quantity
 * @returns {boolean} Success status
 */
export const updateCartItemQuantity = (itemId, newQuantity) => {
  try {
    const existingCart = getCartItems();
    const itemIndex = existingCart.findIndex((item) => item.id === itemId);
    
    if (itemIndex !== -1) {
      if (newQuantity <= 0) {
        // Remove item if quantity is 0 or less
        return removeFromCart(itemId);
      } else {
        existingCart[itemIndex].quantity = parseInt(newQuantity);
        localStorage.setItem("cart", JSON.stringify(existingCart));
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return false;
  }
};

/**
 * Clear entire cart
 * @returns {boolean} Success status
 */
export const clearCart = () => {
  try {
    localStorage.removeItem("cart");
    return true;
  } catch (error) {
    console.error("Error clearing cart:", error);
    return false;
  }
};

/**
 * Calculate cart total
 * @returns {number} Total price of all items in cart
 */
export const getCartTotal = () => {
  const cartItems = getCartItems();
  return cartItems.reduce((total, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 1;
    return total + (price * quantity);
  }, 0);
};
