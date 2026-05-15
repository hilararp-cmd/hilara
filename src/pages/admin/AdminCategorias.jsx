import React, { useState, useEffect } from 'react';
import { Plus, Edit, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { categoriasService } from '../../services/categoriasService';
import './AdminCategorias.css';

const AdminCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      const data = await categoriasService.getAll();
      setCategorias(data);
    } catch (error) {
      toast.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setCurrent(cat);
      setNombre(cat.nombre);
      setDescripcion(cat.descripcion || '');
    } else {
      setCurrent(null);
      setNombre('');
      setDescripcion('');
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (current) {
        await categoriasService.update(current.id_categoria, { nombre, descripcion });
        toast.success('Categoría actualizada');
      } else {
        await categoriasService.create({ nombre, descripcion });
        toast.success('Categoría creada');
      }
      loadCategorias();
      setShowModal(false);
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleToggle = async (cat) => {
    try {
      await categoriasService.toggleEstado(cat.id_categoria, cat.estado);
      toast.success('Estado actualizado');
      loadCategorias();
    } catch (error) {
      toast.error('Error al actualizar');
    }
  };

  return (
    <div className="admin-categorias">
      <header className="page-header">
        <div>
          <h1>Categorías</h1>
          <p>Organiza tus productos por tipo</p>
        </div>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          <Plus size={20} /> Nueva Categoría
        </button>
      </header>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map(cat => (
              <tr key={cat.id_categoria}>
                <td><strong>{cat.nombre}</strong></td>
                <td>{cat.descripcion}</td>
                <td>
                  <span className={`pill-status ${cat.estado ? 'active' : 'inactive'}`}>
                    {cat.estado ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="actions-cell">
                  <button onClick={() => handleOpenModal(cat)}><Edit size={18} /></button>
                  <button onClick={() => handleToggle(cat)}>
                    {cat.estado ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="admin-modal">
            <div className="modal-header">
              <h2>{current ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
              <button onClick={() => setShowModal(false)} className="close-btn">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="field">
                <label>Nombre</label>
                <input 
                  type="text" required 
                  value={nombre} onChange={e => setNombre(e.target.value)} 
                />
              </div>
              <div className="field">
                <label>Descripción</label>
                <textarea 
                  value={descripcion} onChange={e => setDescripcion(e.target.value)} 
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

export default AdminCategorias;
