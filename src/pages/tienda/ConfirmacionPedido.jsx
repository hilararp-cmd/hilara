import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Phone, Mail, MapPin, CreditCard, Package, Printer, Copy } from 'lucide-react';
import { toast } from 'react-toastify';
import { NEGOCIO, generarLinkWhatsApp } from '../../utils/config';
import './ConfirmacionPedido.css';

const ConfirmacionPedido = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pedido, items, cliente } = location.state || {};

  useEffect(() => {
    if (!pedido) {
      navigate('/');
    }
  }, [pedido, navigate]);

  if (!pedido) return null;

  const handleCopyAlias = () => {
    navigator.clipboard.writeText(NEGOCIO.alias_mp);
    toast.success('Alias copiado al portapapeles');
  };

  const handleWhatsApp = () => {
    const link = generarLinkWhatsApp(pedido, items, cliente, pedido.total);
    window.open(link, '_blank');
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <header className="conf-header">
          <CheckCircle size={48} className="success-icon" />
          <h1>¡Pedido Recibido!</h1>
          <div className="ticket-number">
            <span>TICKET #</span>
            <code className="font-mono">{pedido.numero_ticket}</code>
          </div>
        </header>

        <main className="conf-body">
          <section className="conf-section client-info">
            <h3><CheckCircle size={18} /> Datos del Cliente</h3>
            <div className="info-grid">
              <div className="info-item">
                <Phone size={16} />
                <span>{cliente.nombre_apellido} ({cliente.telefono})</span>
              </div>
              {cliente.email && (
                <div className="info-item">
                  <Mail size={16} />
                  <span>{cliente.email}</span>
                </div>
              )}
              {pedido.direccion_entrega && (
                <div className="info-item">
                  <MapPin size={16} />
                  <span>{pedido.direccion_entrega}</span>
                </div>
              )}
            </div>
          </section>

          {(pedido.forma_pago === 'Transferencia' || pedido.forma_pago === 'Mercado Pago') && (
            <section className="conf-section payment-info">
              <h3><CreditCard size={18} /> Datos de Pago</h3>
              <div className="alias-box">
                <p>Alias: <strong>{NEGOCIO.alias_mp}</strong></p>
                <button onClick={handleCopyAlias} className="copy-btn">
                  <Copy size={16} /> Copiar Alias
                </button>
              </div>
              <p className="payment-note">Por favor, envíe el comprobante por WhatsApp.</p>
            </section>
          )}

          <section className="conf-section order-details">
            <h3><Package size={18} /> Resumen de Compra</h3>
            <table className="products-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cant.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.titulo}</td>
                    <td>{item.cantidad}</td>
                    <td>${(item.precio * item.cantidad).toLocaleString('es-AR')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2">TOTAL</td>
                  <td className="total-cell">${pedido.total.toLocaleString('es-AR')}</td>
                </tr>
              </tfoot>
            </table>
          </section>
        </main>

        <footer className="conf-footer no-print">
          <button className="wa-confirm-btn" onClick={handleWhatsApp}>
            <Phone size={18} /> Enviar WhatsApp
          </button>
          <button className="print-btn" onClick={() => window.print()}>
            <Printer size={18} /> Imprimir Ticket
          </button>
          <button className="back-btn" onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ConfirmacionPedido;
