import { supabase } from './supabaseClient';

export const productosService = {
  async getAll() {
    const { data, error } = await supabase
      .from('productos')
      .select('*, categorias(nombre), subcategorias(nombre)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getActivos() {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('estado', true)
      .order('titulo');
    if (error) throw error;
    return data;
  },

  async getDestacados() {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('estado', true)
      .eq('destacado', true)
      .limit(8);
    if (error) throw error;
    return data;
  },

  async create(producto) {
    const { data, error } = await supabase
      .from('productos')
      .insert([producto])
      .select();
    if (error) throw error;
    return data[0];
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('productos')
      .update(updates)
      .eq('id_producto', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id_producto', id);
    if (error) throw error;
    return true;
  }
};
