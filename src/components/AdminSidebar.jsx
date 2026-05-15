import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Tag, Layers, ShoppingBag, ClipboardList, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { pedidosService } from '../services/pedidosService';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [pendientes, setPendientes] = useState(0);

  useEffect(() => {
    loadPendientes();
  }, []);

  const loadPendientes = async () => {
    try {
      const data = await pedidosService.getAll();
      const count = data.filter(p => p.estado_pedido === 'Pendiente').length;
      setPendientes(count);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <h2>HILARA <span>Admin</span></h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/categorias" className={({ isActive }) => isActive ? 'active' : ''}>
          <Tag size={20} />
          <span>Categorías</span>
        </NavLink>
        <NavLink to="/admin/subcategorias" className={({ isActive }) => isActive ? 'active' : ''}>
          <Layers size={20} />
          <span>Subcategorías</span>
        </NavLink>
        <NavLink to="/admin/productos" className={({ isActive }) => isActive ? 'active' : ''}>
          <ShoppingBag size={20} />
          <span>Productos</span>
        </NavLink>
        <NavLink to="/admin/pedidos" className={({ isActive }) => isActive ? 'active' : ''}>
          <ClipboardList size={20} />
          <span>Pedidos</span>
          {pendientes > 0 && <span className="pending-badge">{pendientes}</span>}
        </NavLink>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={20} />
        <span>Cerrar Sesión</span>
      </button>
    </aside>
  );
};

export default AdminSidebar;
