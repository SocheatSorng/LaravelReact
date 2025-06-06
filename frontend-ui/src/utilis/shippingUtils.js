// Shipping calculation utilities

/**
 * Delivery rates configuration - Cambodia only
 */
export const SHIPPING_RATES = {
  cambodia: {
    standard: { base: 1.00, perKg: 0, days: '2-3', description: 'Standard delivery within Cambodia' }
  }
};

/**
 * Cambodia provinces/cities for delivery
 */
export const SHIPPING_LOCATIONS = {
  cambodia: {
    name: 'Cambodia',
    states: [
      { value: 'phnom-penh', name: 'Phnom Penh' },
      { value: 'siem-reap', name: 'Siem Reap' },
      { value: 'battambang', name: 'Battambang' },
      { value: 'kampong-cham', name: 'Kampong Cham' },
      { value: 'kampong-speu', name: 'Kampong Speu' },
      { value: 'kandal', name: 'Kandal' },
      { value: 'kampot', name: 'Kampot' },
      { value: 'sihanoukville', name: 'Sihanoukville' },
      { value: 'takeo', name: 'Takeo' },
      { value: 'kampong-thom', name: 'Kampong Thom' },
      { value: 'prey-veng', name: 'Prey Veng' },
      { value: 'svay-rieng', name: 'Svay Rieng' }
    ]
  }
};

/**
 * Calculate package weight based on cart items
 * @param {Array} cartItems - Array of cart items
 * @param {number} bookWeight - Weight per book in kg (default: 0.5)
 * @returns {number} Total weight in kg
 */
export const calculatePackageWeight = (cartItems, bookWeight = 0.5) => {
  return cartItems.reduce((total, item) => {
    const quantity = parseInt(item.quantity) || 1;
    return total + (quantity * bookWeight);
  }, 0);
};

/**
 * Calculate delivery cost for Cambodia (fixed $1)
 * @param {string} country - Country code (defaults to cambodia)
 * @param {string} method - Delivery method (defaults to standard)
 * @param {number} weight - Package weight in kg (not used, fixed cost)
 * @returns {Object} Delivery calculation result
 */
export const calculateShippingCost = (country = 'cambodia', method = 'standard', weight = 0) => {
  const methodRate = SHIPPING_RATES.cambodia.standard;

  return {
    cost: methodRate.base, // Fixed $1 delivery
    estimatedDays: methodRate.days,
    description: methodRate.description,
    method: 'standard',
    country: 'cambodia'
  };
};

/**
 * Calculate delivery cost for Cambodia (fixed $1)
 * @param {Array} cartItems - Array of cart items
 * @returns {Object} Delivery calculation result
 */
export const calculateShipping = (cartItems) => {
  if (!cartItems || cartItems.length === 0) {
    return { cost: 0, method: 'standard', breakdown: [] };
  }

  const rates = SHIPPING_RATES.cambodia.standard;
  const totalCost = rates.base; // Fixed $1 delivery

  return {
    cost: totalCost,
    method: 'standard',
    estimatedDays: rates.days,
    description: rates.description,
    breakdown: [
      { item: 'Delivery fee (Cambodia)', cost: totalCost }
    ]
  };
};

/**
 * Check if order qualifies for free shipping
 * @param {number} subtotal - Cart subtotal
 * @param {number} freeShippingThreshold - Minimum amount for free shipping
 * @returns {boolean} Whether order qualifies for free shipping
 */
export const qualifiesForFreeShipping = (subtotal, freeShippingThreshold = 50) => {
  return subtotal >= freeShippingThreshold;
};

/**
 * Get final shipping cost considering free shipping promotions
 * @param {number} subtotal - Cart subtotal
 * @param {number} calculatedShippingCost - Calculated shipping cost
 * @param {number} freeShippingThreshold - Minimum amount for free shipping
 * @returns {number} Final shipping cost
 */
export const getFinalShippingCost = (subtotal, calculatedShippingCost, freeShippingThreshold = 50) => {
  return qualifiesForFreeShipping(subtotal, freeShippingThreshold) ? 0 : calculatedShippingCost;
};

/**
 * Get delivery methods for Cambodia
 * @param {string} country - Country code (defaults to cambodia)
 * @returns {Array} Available delivery methods
 */
export const getShippingMethods = (country = 'cambodia') => {
  const countryRates = SHIPPING_RATES.cambodia;

  return Object.keys(countryRates).map(method => ({
    value: method,
    name: method.charAt(0).toUpperCase() + method.slice(1) + ' Delivery',
    ...countryRates[method]
  }));
};

/**
 * Validate delivery information for Cambodia
 * @param {Object} shippingInfo - Shipping information object
 * @returns {Object} Validation result
 */
export const validateShippingInfo = (shippingInfo) => {
  const errors = [];

  if (!shippingInfo.address || shippingInfo.address.trim().length < 10) {
    errors.push('Complete delivery address is required (minimum 10 characters)');
  }

  if (!shippingInfo.phone || shippingInfo.phone.trim().length < 8) {
    errors.push('Valid phone number is required (minimum 8 digits)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format shipping information for display
 * @param {Object} shippingInfo - Shipping information object
 * @returns {string} Formatted shipping address
 */
export const formatShippingAddress = (shippingInfo) => {
  const country = SHIPPING_LOCATIONS[shippingInfo.country];
  const state = country?.states.find(s => s.value === shippingInfo.state);
  
  const parts = [
    shippingInfo.address,
    state?.name,
    shippingInfo.postalCode,
    country?.name
  ].filter(Boolean);
  
  return parts.join(', ');
};
