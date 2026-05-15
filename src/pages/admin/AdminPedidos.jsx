import React, { useState, useEffect } from 'react';
import { Search, Eye, Filter, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { pedidosService } from '../../services/pedidosService';
import './AdminPedidos.css';

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      const data = await pedidosService.getAll();
      setPedidos(data);
    } catch (error) {
      toast.error('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (id) => {
    navigate(`/admin/pedidos/${id}`);
  };

  const filtered = pedidos.filter(p => {
    const matchesEstado = filtroEstado === 'Todos' ? true : p.estado_pedido === filtroEstado;
    const matchesSearch = p.numero_ticket.toLowerCase().includes(busqueda.toLowerCase()) || 
                         p.clientes?.nombre_apellido.toLowerCase().includes(busqueda.toLowerCase());
    return matchesEstado && matchesSearch;
  });

  const estados = ['Pendiente', 'En preparación', 'Enviado', 'Finalizado', 'Cancelado'];

  return (
    <div className="admin-pedidos">
      <header className="page-header">
        <div>
          <h1>Pedidos</h1>
          <p>Gestiona las órdenes de compra</p>
        </div>
      </header>

      <div className="filters-row">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" placeholder="Ticket o cliente..." 
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
          />
        </div>
        <div className="estado-chips">
          <button 
            className={`chip ${filtroEstado === 'Todos' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('Todos')}
          >
            Todos
          </button>
          {estados.map(est => (
            <button 
              key={est}
              className={`chip ${filtroEstado === est ? 'active' : ''}`}
              onClick={() => setFiltroEstado(est)}
            >
              {est}
            </button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Entrega</th>
              <th>Pago</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id_pedido}>
                <td className="font-mono"><strong>{p.numero_ticket}</strong></td>
                <td>{p.clientes?.nombre_apellido}</td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                <td>{p.forma_entrega}</td>
                <td>{p.forma_pago}</td>
                <td>${Number(p.total).toLocaleString('es-AR')}</td>
                <td>
                  <span className={`status-badge ${p.estado_pedido.toLowerCase().replace(' ', '-')}`}>
                    {p.estado_pedido}
                  </span>
                </td>
                <td>
                  <button className="view-btn" onClick={() => handleOpenDetail(p.id_pedido)}>
                    <ExternalLink size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default AdminPedidos;
