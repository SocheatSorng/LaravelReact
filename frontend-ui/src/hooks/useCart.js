import { useState, useEffect, useCallback } from 'react';
import { 
  getCartItems, 
  getCartItemCount, 
  addToCart as addToCartUtil, 
  removeFromCart as removeFromCartUtil,
  updateCartItemQuantity as updateCartItemQuantityUtil,
  clearCart as clearCartUtil,
  getCartTotal
} from '../utilis/cartUtils';

/**
 * Custom hook for cart management
 * Provides cart state and operations with real-time updates
 */
export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(0);

  // Load cart data from localStorage with debouncing
  const loadCartData = useCallback((skipEvent = false) => {
    const now = Date.now();

    // Debounce rapid calls (prevent calls within 100ms)
    if (now - lastUpdate < 100) {
      return;
    }

    console.log('Loading cart data...', { skipEvent });

    const items = getCartItems();
    const count = getCartItemCount();
    const total = getCartTotal();

    setCartItems(items);
    setCartCount(count);
    setCartTotal(total);
    setLastUpdate(now);

    // Only dispatch event if not triggered by an event listener (to prevent infinite loops)
    if (!skipEvent) {
      console.log('Dispatching cartUpdated event');
      window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: { items, count, total }
      }));
    }
  }, [lastUpdate]);

  // Initialize cart data on mount and listen for storage changes
  useEffect(() => {
    loadCartData();

    // Listen for localStorage changes (from other tabs/windows)
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        loadCartData(true); // Skip event dispatch to prevent loops
      }
    };

    // Listen for custom cart events (from same window)
    const handleCartEvent = () => {
      loadCartData(true); // Skip event dispatch to prevent loops
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartCleared', handleCartEvent);
    // Remove cartUpdated listener to prevent infinite loops
    // window.addEventListener('cartUpdated', handleCartEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartCleared', handleCartEvent);
      // window.removeEventListener('cartUpdated', handleCartEvent);
    };
  }, [loadCartData]);

  // Listen for storage changes (cart updates from other tabs/components)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        loadCartData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadCartData]);

  // Add item to cart
  const addToCart = useCallback(async (product, quantity = 1) => {
    // Prevent multiple simultaneous operations
    if (isLoading) {
      console.log('Cart operation already in progress, skipping...');
      return { success: false, message: 'Please wait, processing previous request...' };
    }

    console.log('Adding to cart:', product.Title || product.title);
    setIsLoading(true);

    try {
      const success = addToCartUtil(product, quantity);
      if (success) {
        console.log('Successfully added to cart, refreshing data...');

        // Use setTimeout to prevent blocking the UI
        setTimeout(() => {
          loadCartData(false); // Allow event dispatch for this operation
        }, 50);

        // Dispatch toast event
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('showToast', {
            detail: {
              message: `${product.Title || product.title || 'Item'} added to cart!`,
              type: 'success'
            }
          }));
        }, 150);

        return { success: true, message: 'Item added to cart successfully!' };
      } else {
        return { success: false, message: 'Failed to add item to cart' };
      }
    } catch (error) {
      console.error('Error in addToCart:', error);
      return { success: false, message: 'An error occurred while adding to cart' };
    } finally {
      // Use setTimeout to ensure UI doesn't freeze
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  }, [loadCartData, isLoading]);

  // Remove item from cart
  const removeFromCart = useCallback(async (itemId) => {
    setIsLoading(true);
    try {
      // Get item name before removing
      const items = getCartItems();
      const itemToRemove = items.find(item => item.id === itemId);
      const itemName = itemToRemove?.name || 'Item';

      const success = removeFromCartUtil(itemId);
      if (success) {
        loadCartData(false); // Allow event dispatch for this operation

        // Dispatch toast event with delay
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('showToast', {
            detail: {
              message: `${itemName} removed from cart`,
              type: 'success'
            }
          }));
        }, 100);

        return { success: true, message: 'Item removed from cart' };
      } else {
        return { success: false, message: 'Failed to remove item from cart' };
      }
    } catch (error) {
      console.error('Error in removeFromCart:', error);
      return { success: false, message: 'An error occurred while removing from cart' };
    } finally {
      setIsLoading(false);
    }
  }, [loadCartData]);

  // Update item quantity
  const updateItemQuantity = useCallback(async (itemId, newQuantity) => {
    setIsLoading(true);
    try {
      const success = updateCartItemQuantityUtil(itemId, newQuantity);
      if (success) {
        loadCartData(false); // Allow event dispatch for this operation
        return { success: true, message: 'Quantity updated successfully' };
      } else {
        return { success: false, message: 'Failed to update quantity' };
      }
    } catch (error) {
      console.error('Error in updateItemQuantity:', error);
      return { success: false, message: 'An error occurred while updating quantity' };
    } finally {
      setIsLoading(false);
    }
  }, [loadCartData]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const success = clearCartUtil();
      if (success) {
        loadCartData(); // Refresh cart data
        return { success: true, message: 'Cart cleared successfully' };
      } else {
        return { success: false, message: 'Failed to clear cart' };
      }
    } catch (error) {
      console.error('Error in clearCart:', error);
      return { success: false, message: 'An error occurred while clearing cart' };
    } finally {
      setIsLoading(false);
    }
  }, [loadCartData]);

  // Check if item is in cart
  const isInCart = useCallback((productId) => {
    return cartItems.some(item => item.id === productId);
  }, [cartItems]);

  // Get item quantity in cart
  const getItemQuantity = useCallback((productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }, [cartItems]);

  return {
    // State
    cartItems,
    cartCount,
    cartTotal,
    isLoading,
    
    // Actions
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    
    // Utilities
    isInCart,
    getItemQuantity,
    refreshCart: loadCartData,
  };
};
