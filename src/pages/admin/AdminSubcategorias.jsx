import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { subcategoriasService } from '../../services/subcategoriasService';
import { categoriasService } from '../../services/categoriasService';
import './AdminSubcategorias.css';

const AdminSubcategorias = () => {
  const [subcategorias, setSubcategorias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(null);
  
  const [nombre, setNombre] = useState('');
  const [idCategoria, setIdCategoria] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [s, c] = await Promise.all([
        subcategoriasService.getAll(),
        categoriasService.getAll()
      ]);
      setSubcategorias(s);
      setCategorias(c);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (sub = null) => {
    if (sub) {
      setCurrent(sub);
      setNombre(sub.nombre);
      setIdCategoria(sub.id_categoria);
    } else {
      setCurrent(null);
      setNombre('');
      setIdCategoria('');
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (current) {
        await subcategoriasService.update(current.id_subcategoria, { nombre, id_categoria: idCategoria });
        toast.success('Subcategoría actualizada');
      } else {
        await subcategoriasService.create({ nombre, id_categoria: idCategoria });
        toast.success('Subcategoría creada');
      }
      loadData();
      setShowModal(false);
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta subcategoría?')) {
      try {
        await subcategoriasService.delete(id);
        toast.success('Eliminada correctamente');
        loadData();
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  return (
    <div className="admin-subcategorias">
      <header className="page-header">
        <div>
          <h1>Subcategorías</h1>
          <p>Detalle adicional para tus productos</p>
        </div>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          <Plus size={20} /> Nueva Subcategoría
        </button>
      </header>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría Padre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {subcategorias.map(sub => (
              <tr key={sub.id_subcategoria}>
                <td><strong>{sub.nombre}</strong></td>
                <td>{sub.categorias?.nombre}</td>
                <td className="actions-cell">
                  <button onClick={() => handleOpenModal(sub)}><Edit size={18} /></button>
                  <button onClick={() => handleDelete(sub.id_subcategoria)} className="delete-btn"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="admin-modal small">
            <div className="modal-header">
              <h2>{current ? 'Editar Subcategoría' : 'Nueva Subcategoría'}</h2>
              <button onClick={() => setShowModal(false)} className="close-btn">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="field">
                <label>Categoría Padre</label>
                <select 
                  required value={idCategoria} 
                  onChange={e => setIdCategoria(e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Nombre de Subcategoría</label>
                <input 
                  type="text" required 
                  value={nombre} onChange={e => setNombre(e.target.value)} 
                />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancelar</button>
                <button type="submit" className="save-btn">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubcategorias;
