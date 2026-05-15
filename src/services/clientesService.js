import { supabase } from './supabaseClient';

export const clientesService = {
  async upsertByTelefono(cliente) {
    // Intentar buscar por teléfono
    const { data: existing } = await supabase
      .from('clientes')
      .select('*')
      .eq('telefono', cliente.telefono)
      .single();

    if (existing) {
      // Actualizar datos
      const { data, error } = await supabase
        .from('clientes')
        .update(cliente)
        .eq('id_cliente', existing.id_cliente)
        .select();
      if (error) throw error;
      return data[0];
    } else {
      // Crear nuevo
      const { data, error } = await supabase
        .from('clientes')
        .insert([cliente])
        .select();
      if (error) throw error;
      return data[0];
    }
  },

  async getAll() {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nombre_apellido');
    if (error) throw error;
    return data;
  }
};
