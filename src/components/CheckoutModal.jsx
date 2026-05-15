import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCarrito } from '../context/CarritoContext';
import { NEGOCIO } from '../utils/config';
import './CheckoutModal.css';

const CheckoutModal = ({ isOpen, onClose, onFinish }) => {
  const { carrito, subtotal, vaciarCarrito } = useCarrito();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    formaEntrega: 'Retiro en local',
    formaPago: 'Efectivo',
    observaciones: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.telefono) {
      toast.error('Nombre y teléfono son obligatorios');
      return;
    }

    if (formData.formaEntrega !== 'Retiro en local' && !formData.direccion) {
      toast.error('La dirección es obligatoria para envíos');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call or call onFinish directly
      await onFinish(formData);
      onClose();
    } catch (error) {
      toast.error('Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="checkout-modal">
        <div className="modal-header">
          <h2>Finalizar Pedido</h2>
          <button onClick={onClose} className="close-btn"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-sections">
            <section className="client-data">
              <h3>Tus Datos</h3>
              <input 
                type="text" name="nombre" placeholder="Nombre completo *" 
                value={formData.nombre} onChange={handleChange} required 
              />
              <input 
                type="tel" name="telefono" placeholder="WhatsApp (Ej: 3816419602) *" 
                value={formData.telefono} onChange={handleChange} required 
              />
              <input 
                type="email" name="email" placeholder="Email (Opcional)" 
                value={formData.email} onChange={handleChange} 
              />
            </section>

            <section className="delivery-options">
              <h3>Forma de Entrega</h3>
              <div className="pills-container">
                {['Retiro en local', 'Envío por correo', 'Envío por Andreani'].map(opt => (
                  <button 
                    key={opt} type="button"
                    className={`pill ${formData.formaEntrega === opt ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, formaEntrega: opt }))}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {formData.formaEntrega !== 'Retiro en local' && (
                <input 
                  type="text" name="direccion" placeholder="Dirección de envío *" 
                  value={formData.direccion} onChange={handleChange} required 
                />
              )}
            </section>

            <section className="payment-options">
              <h3>Forma de Pago</h3>
              <div className="pills-container">
                {['Efectivo', 'Transferencia', 'Mercado Pago'].map(opt => (
                  <button 
                    key={opt} type="button"
                    className={`pill ${formData.formaPago === opt ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, formaPago: opt }))}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </section>

            <section className="notes-section">
              <textarea 
                name="observaciones" placeholder="Observaciones adicionales..." 
                value={formData.observaciones} onChange={handleChange}
              />
            </section>
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal ({carrito.length} items)</span>
              <span>${subtotal.toLocaleString('es-AR')}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${subtotal.toLocaleString('es-AR')}</span>
            </div>
            <button type="submit" className="confirm-btn" disabled={loading}>
              {loading ? 'Procesando...' : (
                <>
                  <Send size={18} />
                  Confirmar Pedido
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
