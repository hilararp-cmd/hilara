import { supabase } from './supabaseClient';

export const pedidosService = {
  async create(pedido, items) {
    // 1. Insertar pedido
    const { data: pedidoData, error: pedidoError } = await supabase
      .from('pedidos')
      .insert([pedido])
      .select();

    if (pedidoError) throw pedidoError;
    const newPedido = pedidoData[0];

    // 2. Insertar detalles
    const detalles = items.map(item => ({
      id_pedido: newPedido.id_pedido,
      id_producto: item.id_producto,
      titulo_producto: item.titulo,
      precio_unitario: item.precio,
      cantidad: item.cantidad,
      subtotal: item.precio * item.cantidad
    }));

    const { error: detalleError } = await supabase
      .from('pedido_detalle')
      .insert(detalles);

    if (detalleError) throw detalleError;

    // 3. Actualizar stock (Opcional pero recomendado)
    for (const item of items) {
      await supabase.rpc('decrement_stock', { 
        product_id: item.id_producto, 
        amount: item.cantidad 
      });
    }

    return newPedido;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*, clientes(nombre_apellido, telefono)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*, clientes(*), pedido_detalle(*)')
      .eq('id_pedido', id)
      .single();
    if (error) throw error;
    return data;
  },

  async updateEstado(id, estado) {
    const { data, error } = await supabase
      .from('pedidos')
      .update({ estado_pedido: estado })
      .eq('id_pedido', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async getStats() {
    const { data, error } = await supabase
      .from('pedidos')
      .select('estado_pedido, total, created_at');
    if (error) throw error;
    return data;
  }
};
