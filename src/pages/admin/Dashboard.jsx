import React, { useState, useEffect } from 'react';
import { ShoppingCart, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { pedidosService } from '../../services/pedidosService';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    ventasDia: 0,
    completados: 0
  });
  const [ultimosPedidos, setUltimosPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await pedidosService.getAll();
      const hoy = new Date().toISOString().split('T')[0];
      
      const res = data.reduce((acc, p) => {
        acc.total++;
        if (p.estado_pedido === 'Pendiente') acc.pendientes++;
        if (p.estado_pedido === 'Finalizado') acc.completados++;
        if (p.created_at.startsWith(hoy)) acc.ventasDia += Number(p.total);
        return acc;
      }, { total: 0, pendientes: 0, ventasDia: 0, completados: 0 });

      setStats(res);
      setUltimosPedidos(data.slice(0, 10));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <header className="admin-header">
        <h1>Dashboard</h1>
        <p>Resumen general de tu negocio</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card pending">
          <div className="stat-icon"><Clock size={24} /></div>
          <div className="stat-info">
            <h3>Pedidos Pendientes</h3>
            <p>{stats.pendientes}</p>
          </div>
        </div>
        <div className="stat-card sales">
          <div className="stat-icon"><TrendingUp size={24} /></div>
          <div className="stat-info">
            <h3>Ventas del Día</h3>
            <p>${stats.ventasDia.toLocaleString('es-AR')}</p>
          </div>
        </div>
        <div className="stat-card total">
          <div className="stat-icon"><ShoppingCart size={24} /></div>
          <div className="stat-info">
            <h3>Total Pedidos</h3>
            <p>{stats.total}</p>
          </div>
        </div>
        <div className="stat-card finished">
          <div className="stat-icon"><CheckCircle size={24} /></div>
          <div className="stat-info">
            <h3>Finalizados</h3>
            <p>{stats.completados}</p>
          </div>
        </div>
      </div>

      <section className="recent-orders">
        <h2>Últimos Pedidos</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {ultimosPedidos.map(p => (
                <tr key={p.id_pedido}>
                  <td className="font-mono">{p.numero_ticket}</td>
                  <td>{p.clientes?.nombre_apellido}</td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td>${Number(p.total).toLocaleString('es-AR')}</td>
                  <td>
                    <span className={`status-badge ${p.estado_pedido.toLowerCase().replace(' ', '-')}`}>
                      {p.estado_pedido}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
