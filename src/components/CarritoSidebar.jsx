import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCarrito } from '../context/CarritoContext';
import './CarritoSidebar.css';

const CarritoSidebar = ({ isOpen, onClose, onCheckout }) => {
  const { carrito, actualizarCantidad, eliminarProducto, subtotal } = useCarrito();

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div className="header-title">
            <ShoppingBag size={24} />
            <h2>Mi Selección</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-content">
          {carrito.length === 0 ? (
            <div className="empty-cart">
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="cart-items">
              {carrito.map((item) => (
                <div key={item.id_producto} className="cart-item">
                  <div className="item-img">
                    <img src={item.foto_url} alt={item.titulo} />
                  </div>
                  <div className="item-details">
                    <h3>{item.titulo}</h3>
                    <p className="item-price">${Number(item.precio).toLocaleString('es-AR')}</p>
                    <div className="item-controls">
                      <div className="qty-picker">
                        <button onClick={() => actualizarCantidad(item.id_producto, -1)}>
                          <Minus size={14} />
                        </button>
                        <span>{item.cantidad}</span>
                        <button onClick={() => actualizarCantidad(item.id_producto, 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                      <button className="remove-btn" onClick={() => eliminarProducto(item.id_producto)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {carrito.length > 0 && (
          <div className="cart-footer">
            <div className="total-row">
              <span>Total</span>
              <span className="total-amount">${subtotal.toLocaleString('es-AR')}</span>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>
              Finalizar Pedido
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CarritoSidebar;
