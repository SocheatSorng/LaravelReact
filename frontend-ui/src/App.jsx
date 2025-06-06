import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavItems from "./components/NavItems";
import Footer from "./components/Footer";
import CartToast from "./components/CartToast";

const App = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    let toastId = 0;

    const handleShowToast = (event) => {
      const { message, type = 'success', duration = 3000 } = event.detail;
      const id = ++toastId;

      const newToast = { id, message, type, duration };
      setToasts(prev => [...prev, newToast]);

      // Auto remove toast
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, duration + 300);
    };

    window.addEventListener('showToast', handleShowToast);

    return () => {
      window.removeEventListener('showToast', handleShowToast);
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <>
      <NavItems />
      <Outlet />
      <Footer />

      {/* Toast Container */}
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            position: 'fixed',
            top: `${20 + (index * 70)}px`,
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
    </>
  );
};

export default App;
