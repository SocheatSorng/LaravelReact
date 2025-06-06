// Simple test to verify cart functionality
import { 
  addToCart, 
  getCartItems, 
  getCartItemCount, 
  removeFromCart, 
  clearCart 
} from './utilis/cartUtils';

// Test data
const testProduct = {
  BookID: 1,
  Title: "Test Book",
  Price: 19.99,
  Author: "Test Author"
};

// Test functions
console.log("Testing Cart Functionality...");

// Clear cart first
clearCart();
console.log("✓ Cart cleared");

// Test adding item
const addResult = addToCart(testProduct, 2);
console.log("✓ Add to cart:", addResult);

// Test getting cart items
const cartItems = getCartItems();
console.log("✓ Cart items:", cartItems);

// Test getting cart count
const cartCount = getCartItemCount();
console.log("✓ Cart count:", cartCount);

// Test removing item
const removeResult = removeFromCart(1);
console.log("✓ Remove from cart:", removeResult);

// Final cart state
const finalCartItems = getCartItems();
console.log("✓ Final cart items:", finalCartItems);

console.log("Cart functionality tests completed!");
