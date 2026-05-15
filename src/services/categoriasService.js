import { supabase } from './supabaseClient';

export const categoriasService = {
  async getAll() {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('nombre');
    if (error) throw error;
    return data;
  },

  async getActivas() {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('estado', true)
      .order('nombre');
    if (error) throw error;
    return data;
  },

  async create(categoria) {
    const { data, error } = await supabase
      .from('categorias')
      .insert([categoria])
      .select();
    if (error) throw error;
    return data[0];
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('categorias')
      .update(updates)
      .eq('id_categoria', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async toggleEstado(id, estadoActual) {
    return this.update(id, { estado: !estadoActual });
  }
};
