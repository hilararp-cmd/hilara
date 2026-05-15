import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCarrito } from '../context/CarritoContext';
import './MobileCartBar.css';

const MobileCartBar = ({ onOpenCart, onOpenCheckout }) => {
  const { totalItems, subtotal } = useCarrito();

  if (totalItems === 0) return null;

  return (
    <div className="mobile-cart-bar">
      <button className="mobile-cart-info" onClick={onOpenCart}>
        <div className="icon-badge">
          <ShoppingBag size={20} />
          <span>{totalItems}</span>
        </div>
      </button>
      
      <button className="mobile-checkout-btn" onClick={onOpenCheckout}>
        Finalizar · ${subtotal.toLocaleString('es-AR')}
      </button>
    </div>
  );
};

export default MobileCartBar;
