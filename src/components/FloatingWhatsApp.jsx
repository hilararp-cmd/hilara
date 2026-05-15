import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { NEGOCIO } from '../utils/config';
import './FloatingWhatsApp.css';

const FloatingWhatsApp = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenWA = () => {
    const msg = encodeURIComponent(`Hola ${NEGOCIO.nombre}, quisiera hacer una consulta sobre sus productos.`);
    window.open(`https://wa.me/${NEGOCIO.telefono}?text=${msg}`, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="wa-wrapper">
      {isOpen && (
        <div className="wa-bubble animate-in">
          <div className="wa-bubble-header">
            <div className="wa-info">
              <div className="wa-avatar">H</div>
              <div>
                <h4>{NEGOCIO.nombre}</h4>
                <p>En línea</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={18} /></button>
          </div>
          <div className="wa-bubble-body">
            <p>¡Hola! 👋 ¿En qué podemos ayudarte?</p>
          </div>
          <button className="wa-bubble-btn" onClick={handleOpenWA}>
            Abrir WhatsApp
          </button>
        </div>
      )}
      
      <button 
        className={`wa-btn ${!isOpen ? 'pulse-3' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle size={32} />
      </button>
    </div>
  );
};

export default FloatingWhatsApp;
