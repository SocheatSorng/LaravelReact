import React, { useState, useEffect } from 'react';

const CartToast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastClass = () => {
    const baseClass = 'cart-toast';
    const typeClass = type === 'success' ? 'cart-toast-success' : 'cart-toast-error';
    const visibilityClass = isVisible ? 'cart-toast-visible' : 'cart-toast-hidden';
    return `${baseClass} ${typeClass} ${visibilityClass}`;
  };

  return (
    <>
      <style>
        {`
          .cart-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            max-width: 300px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .cart-toast-success {
            background-color: #28a745;
          }
          
          .cart-toast-error {
            background-color: #dc3545;
          }
          
          .cart-toast-visible {
            opacity: 1;
            transform: translateX(0);
          }
          
          .cart-toast-hidden {
            opacity: 0;
            transform: translateX(100%);
          }
          
          .cart-toast-icon {
            font-size: 1.2em;
          }
          
          .cart-toast-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2em;
            cursor: pointer;
            margin-left: auto;
            padding: 0;
            opacity: 0.8;
          }
          
          .cart-toast-close:hover {
            opacity: 1;
          }
        `}
      </style>
      
      <div className={getToastClass()}>
        <span className="cart-toast-icon">
          {type === 'success' ? '✓' : '⚠'}
        </span>
        <span className="cart-toast-message">{message}</span>
        <button 
          className="cart-toast-close" 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
        >
          ×
        </button>
      </div>
    </>
  );
};

export default CartToast;
