import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexts
import { useCarrito, CarritoProvider } from './context/CarritoContext';
import { useAuth, AuthProvider } from './context/AuthContext';

// Services
import { clientesService } from './services/clientesService';
import { pedidosService } from './services/pedidosService';
import { NEGOCIO } from './utils/config';

// Components
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import CarritoSidebar from './components/CarritoSidebar';
import CheckoutModal from './components/CheckoutModal';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import MobileCartBar from './components/MobileCartBar';
import AdminSidebar from './components/AdminSidebar';

// Pages - Shop
import Home from './pages/tienda/Home';
import ConfirmacionPedido from './pages/tienda/ConfirmacionPedido';

// Pages - Admin
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminCategorias from './pages/admin/AdminCategorias';
import AdminSubcategorias from './pages/admin/AdminSubcategorias';
import AdminProductos from './pages/admin/AdminProductos';
import AdminPedidos from './pages/admin/AdminPedidos';
import AdminDetallePedido from './pages/admin/AdminDetallePedido';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/admin/login" />;
};

const MainApp = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const navigate = useNavigate();
  const { carrito, subtotal, vaciarCarrito } = useCarrito();

  const handleFinishOrder = async (formData) => {
    try {
      // 1. Upsert client
      const clienteData = {
        nombre_apellido: formData.nombre,
        telefono: formData.telefono,
        email: formData.email,
        direccion: formData.direccion
      };
      const cliente = await clientesService.upsertByTelefono(clienteData);

      // 2. Create order
      const ticket = `${NEGOCIO.ticket_prefix}-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const pedidoData = {
        id_cliente: cliente.id_cliente,
        numero_ticket: ticket,
        forma_entrega: formData.formaEntrega,
        forma_pago: formData.formaPago,
        subtotal: subtotal,
        total: subtotal,
        direccion_entrega: formData.direccion,
        observaciones_cliente: formData.observaciones
      };

      const items = carrito.map(item => ({
        id_producto: item.id_producto,
        titulo: item.titulo,
        precio: item.precio,
        cantidad: item.cantidad
      }));

      const newPedido = await pedidosService.create(pedidoData, items);

      // 3. Success!
      toast.success('¡Pedido realizado con éxito!');
      vaciarCarrito();
      setIsCheckoutOpen(false);
      
      // Navigate to confirmation page
      navigate('/confirmacion', { state: { pedido: newPedido, items, cliente } });

    } catch (error) {
      console.error('Error finishing order:', error);
      toast.error('Hubo un problema al procesar tu pedido');
    }
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Routes>
      {/* Tienda Pública */}
      <Route path="/" element={
        <>
          <Navbar onOpenCart={() => setIsCartOpen(true)} />
          <Home />
          <CarritoSidebar 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
            onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
          />
          <CheckoutModal 
            isOpen={isCheckoutOpen} 
            onClose={() => setIsCheckoutOpen(false)}
            onFinish={handleFinishOrder}
          />
          <FloatingWhatsApp />
          <MobileCartBar 
            onOpenCart={() => setIsCartOpen(true)} 
            onOpenCheckout={() => setIsCheckoutOpen(true)} 
          />
        </>
      } />
      <Route path="/confirmacion" element={<ConfirmacionPedido />} />

      {/* Admin Section */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/*" element={
        <ProtectedRoute>
          <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-main">
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="categorias" element={<AdminCategorias />} />
                <Route path="subcategorias" element={<AdminSubcategorias />} />
                <Route path="productos" element={<AdminProductos />} />
                <Route path="pedidos" element={<AdminPedidos />} />
                <Route path="pedidos/:id" element={<AdminDetallePedido />} />
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </main>
          </div>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CarritoProvider>
          <MainApp />
          <ToastContainer position="bottom-right" autoClose={3000} />
        </CarritoProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
