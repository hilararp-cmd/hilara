import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { pedidosService } from '../../services/pedidosService';
import './AdminDetallePedido.css';

const AdminDetallePedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  const estados = ['Pendiente', 'En preparación', 'Enviado', 'Finalizado', 'Cancelado'];

  useEffect(() => {
    loadPedido();
  }, [id]);

  const loadPedido = async () => {
    try {
      const data = await pedidosService.getById(id);
      setPedido(data);
    } catch (error) {
      toast.error('Error al cargar detalle');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await pedidosService.updateEstado(id, newStatus);
      toast.success('Estado actualizado');
      setPedido({ ...pedido, estado_pedido: newStatus });
    } catch (error) {
      toast.error('Error al actualizar');
    }
  };

  if (loading) return <div className="p-8">Cargando detalle...</div>;
  if (!pedido) return <div className="p-8">Pedido no encontrado</div>;

  return (
    <div className="admin-detalle-pedido">
      <header className="page-header">
        <div>
          <button onClick={() => navigate('/admin/pedidos')} className="back-link">← Volver a Pedidos</button>
          <h1>Pedido {pedido.numero_ticket}</h1>
        </div>
      </header>

      <div className="detail-layout">
        <div className="main-info">
          <section className="detail-card">
            <h3>Información del Cliente</h3>
            <div className="info-row">
              <span className="label">Nombre:</span>
              <span>{pedido.clientes?.nombre_apellido}</span>
            </div>
            <div className="info-row">
              <span className="label">Teléfono:</span>
              <span>{pedido.clientes?.telefono}</span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span>{pedido.clientes?.email || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="label">Dirección:</span>
              <span>{pedido.direccion_entrega || 'N/A'}</span>
            </div>
          </section>

          <section className="detail-card mt-6">
            <h3>Detalle de Productos</h3>
            <table className="products-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cant.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {pedido.pedido_detalle?.map((det, idx) => (
                  <tr key={idx}>
                    <td>{det.titulo_producto}</td>
                    <td>${Number(det.precio_unitario).toLocaleString('es-AR')}</td>
                    <td>{det.cantidad}</td>
                    <td>${Number(det.subtotal).toLocaleString('es-AR')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3">TOTAL</td>
                  <td className="total-val">${Number(pedido.total).toLocaleString('es-AR')}</td>
                </tr>
              </tfoot>
            </table>
          </section>
        </div>

        <aside className="status-panel">
          <section className="detail-card">
            <h3>Gestión de Estado</h3>
            <select 
              value={pedido.estado_pedido} 
              onChange={(e) => handleUpdateStatus(e.target.value)}
              className="status-select"
            >
              {estados.map(est => <option key={est} value={est}>{est}</option>)}
            </select>
            
            <div className="meta-info mt-6">
              <p><strong>Fecha:</strong> {new Date(pedido.created_at).toLocaleString()}</p>
              <p><strong>Pago:</strong> {pedido.forma_pago}</p>
              <p><strong>Entrega:</strong> {pedido.forma_entrega}</p>
            </div>
          </section>

          {pedido.observaciones_cliente && (
            <section className="detail-card mt-6">
              <h3>Observaciones</h3>
              <p className="obs-box">{pedido.observaciones_cliente}</p>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};

export default AdminDetallePedido;
