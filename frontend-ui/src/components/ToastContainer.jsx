import React from 'react';
import CartToast from './CartToast';
import { useToast } from '../hooks/useToast';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast, index) => (
        <div 
          key={toast.id} 
          style={{ 
            position: 'fixed',
            top: `${20 + (index * 70)}px`, // Stack toasts vertically
            right: '20px',
            zIndex: 10000 + index
          }}
        >
          <CartToast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
