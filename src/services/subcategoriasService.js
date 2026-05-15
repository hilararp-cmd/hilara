import { supabase } from './supabaseClient';

export const subcategoriasService = {
  async getAll() {
    const { data, error } = await supabase
      .from('subcategorias')
      .select('*, categorias(nombre)')
      .order('nombre');
    if (error) throw error;
    return data;
  },

  async getByCategoria(idCategoria) {
    const { data, error } = await supabase
      .from('subcategorias')
      .select('*')
      .eq('id_categoria', idCategoria)
      .eq('estado', true)
      .order('nombre');
    if (error) throw error;
    return data;
  },

  async create(subcategoria) {
    const { data, error } = await supabase
      .from('subcategorias')
      .insert([subcategoria])
      .select();
    if (error) throw error;
    return data[0];
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('subcategorias')
      .update(updates)
      .eq('id_subcategoria', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('subcategorias')
      .delete()
      .eq('id_subcategoria', id);
    if (error) throw error;
    return true;
  }
};
