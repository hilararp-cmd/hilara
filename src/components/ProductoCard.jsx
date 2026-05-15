import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCarrito } from '../context/CarritoContext';
import './ProductoCard.css';

const ProductoCard = ({ producto }) => {
  const { agregarAlCarrito, carrito } = useCarrito();
  const [agregado, setAgregado] = useState(false);

  const itemEnCarrito = carrito.find(item => item.id_producto === producto.id_producto);
  const sinStock = producto.stock === 0;
  const pocasUnidades = producto.stock > 0 && producto.stock <= 5;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (sinStock) return;
    agregarAlCarrito(producto, 1);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  return (
    <div className="producto-card">
      <div className="image-container">
        <img src={producto.foto_url} alt={producto.titulo} loading="lazy" />
        {producto.destacado && <span className="badge-destacado">Destacado</span>}
        {sinStock && <div className="overlay-sin-stock">Sin Stock</div>}
        {pocasUnidades && !sinStock && (
          <span className="badge-low-stock">Últimas {producto.stock} unidades</span>
        )}
      </div>

      <div className="info-container">
        <h3 className="producto-titulo">{producto.titulo}</h3>
        <p className="producto-precio">
          ${Number(producto.precio).toLocaleString('es-AR')}
        </p>
        
        <button 
          className={`add-btn ${agregado ? 'success' : ''} ${sinStock ? 'disabled' : ''}`}
          onClick={handleAdd}
          disabled={sinStock}
        >
          {agregado ? (
            <>
              <Check size={18} />
              <span>¡Listo!</span>
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              <span>{sinStock ? 'Sin Stock' : 'Agregar'}</span>
            </>
          )}
          {itemEnCarrito && <span className="item-count">{itemEnCarrito.cantidad}</span>}
        </button>
      </div>
    </div>
  );
};

export default ProductoCard;
