export const NEGOCIO = {
  nombre: 'Hilara',
  slogan: 'Tejidos nobles, estilo atemporal',
  telefono: '5493875809594',
  alias_mp: 'hilara.boutique.mp',
  cbu: '',
  direccion: 'San Miguel de Tucumán',
  horario: 'Lunes a Sábado 10:00 - 20:00',
  instagram: '@hilara_tuc',
  logo: '/logo.png',
  ticket_prefix: 'HLR',
  admin_user: 'admin',
  admin_pass: '123456',
};

export const generarLinkWhatsApp = (pedido, items, cliente, total) => {
  const fmt = (n) => `$${Number(n).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
  const fecha = new Date(pedido.created_at).toLocaleString('es-AR', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  const lineas = items
    .map((i) => `  • ${i.titulo || i.titulo_producto} x${i.cantidad} → ${fmt(i.subtotal || (i.precio * i.cantidad))}`)
    .join('\n');

  const msg = [
    `🛒 *NUEVO PEDIDO — ${NEGOCIO.nombre}*`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `📋 Pedido: *${pedido.numero_ticket}*`,
    `📅 Fecha: ${fecha}`,
    ``,
    `👤 *DATOS DEL CLIENTE*`,
    `Nombre: ${cliente.nombre_apellido}`,
    `📱 Teléfono: ${cliente.telefono}`,
    cliente.email ? `📧 Email: ${cliente.email}` : '',
    pedido.direccion_entrega ? `🏠 Dirección: ${pedido.direccion_entrega}` : '',
    ``,
    `📦 *PRODUCTOS*`,
    lineas,
    ``,
    `💰 *TOTAL: ${fmt(total)}*`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `🚚 Entrega: ${pedido.forma_entrega}`,
    `💳 Pago: ${pedido.forma_pago}`,
    pedido.observaciones_cliente ? `📝 Obs: ${pedido.observaciones_cliente}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${NEGOCIO.telefono}?text=${encodeURIComponent(msg)}`;
};
