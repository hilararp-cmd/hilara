import React, { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const saved = localStorage.getItem('hilara_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('hilara_cart', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id_producto === producto.id_producto);
      if (existe) {
        return prev.map(item =>
          item.id_producto === producto.id_producto
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prev, { ...producto, cantidad }];
    });
  };

  const actualizarCantidad = (id_producto, delta) => {
    setCarrito(prev => prev.map(item => {
      if (item.id_producto === id_producto) {
        const nuevaCant = Math.max(0, item.cantidad + delta);
        return { ...item, cantidad: nuevaCant };
      }
      return item;
    }).filter(item => item.cantidad > 0));
  };

  const eliminarProducto = (id_producto) => {
    setCarrito(prev => prev.filter(item => item.id_producto !== id_producto));
  };

  const vaciarCarrito = () => setCarrito([]);

  const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CarritoContext.Provider value={{
      carrito,
      agregarAlCarrito,
      actualizarCantidad,
      eliminarProducto,
      vaciarCarrito,
      subtotal,
      totalItems
    }}>
      {children}
    </CarritoContext.Provider>
  );
};
