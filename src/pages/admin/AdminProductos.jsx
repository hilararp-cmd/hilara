import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { productosService } from '../../services/productosService';
import { categoriasService } from '../../services/categoriasService';
import { subcategoriasService } from '../../services/subcategoriasService';
import './AdminProductos.css';

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(null);
  
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    foto_url: '',
    id_categoria: '',
    id_subcategoria: '',
    destacado: false,
    estado: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [p, c, s] = await Promise.all([
        productosService.getAll(),
        categoriasService.getAll(),
        subcategoriasService.getAll()
      ]);
      setProductos(p);
      setCategorias(c);
      setSubcategorias(s);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (prod = null) => {
    if (prod) {
      setCurrent(prod);
      setFormData({
        titulo: prod.titulo,
        descripcion: prod.descripcion || '',
        precio: prod.precio,
        stock: prod.stock || 0,
        foto_url: prod.foto_url || '',
        id_categoria: prod.id_categoria || '',
        id_subcategoria: prod.id_subcategoria || '',
        destacado: prod.destacado,
        estado: prod.estado
      });
    } else {
      setCurrent(null);
      setFormData({
        titulo: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        foto_url: '',
        id_categoria: '',
        id_subcategoria: '',
        destacado: false,
        estado: true
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (current) {
        await productosService.update(current.id_producto, formData);
        toast.success('Producto actualizado');
      } else {
        await productosService.create(formData);
        toast.success('Producto creado');
      }
      loadData();
      setShowModal(false);
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await productosService.delete(id);
        toast.success('Producto eliminado');
        loadData();
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  const filtered = productos.filter(p => {
    const matchesEstado = filtroEstado === 'Todos' ? true : (filtroEstado === 'Activos' ? p.estado : !p.estado);
    const matchesSearch = p.titulo.toLowerCase().includes(busqueda.toLowerCase());
    return matchesEstado && matchesSearch;
  });

  const subCatsFiltradas = subcategorias.filter(s => s.id_categoria === Number(formData.id_categoria));

  return (
    <div className="admin-products">
      <header className="page-header">
        <div>
          <h1>Productos</h1>
          <p>Gestiona el catálogo de ruanas y pashminas</p>
        </div>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          <Plus size={20} /> Nuevo Producto
        </button>
      </header>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" placeholder="Buscar producto..." 
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
          />
        </div>
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option>Todos</option>
          <option>Activos</option>
          <option>Inactivos</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Título</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id_producto}>
                <td>
                  <img src={p.foto_url} alt="" className="table-img" />
                </td>
                <td>
                  <div className="prod-name">
                    <strong>{p.titulo}</strong>
                    {p.destacado && <span className="dest-tag">Destacado</span>}
                  </div>
                </td>
                <td>{p.categorias?.nombre}</td>
                <td>${Number(p.precio).toLocaleString('es-AR')}</td>
                <td>{p.stock}</td>
                <td>
                  <span className={`pill-status ${p.estado ? 'active' : 'inactive'}`}>
                    {p.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="actions-cell">
                  <button onClick={() => handleOpenModal(p)}><Edit size={18} /></button>
                  <button onClick={() => handleDelete(p.id_producto)} className="delete-btn"><Trash2 size={18} /></button>
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
              <h2>{current ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={() => setShowModal(false)} className="close-btn">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-grid">
                <div className="field">
                  <label>Título *</label>
                  <input 
                    type="text" required 
                    value={formData.titulo} 
                    onChange={e => setFormData({...formData, titulo: e.target.value})}
                  />
                </div>
                <div className="field">
                  <label>Precio *</label>
                  <input 
                    type="number" step="0.01" required 
                    value={formData.precio} 
                    onChange={e => setFormData({...formData, precio: e.target.value})}
                  />
                </div>
                <div className="field">
                  <label>Stock</label>
                  <input 
                    type="number" 
                    value={formData.stock} 
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
                <div className="field">
                  <label>Categoría</label>
                  <select 
                    value={formData.id_categoria} 
                    onChange={e => setFormData({...formData, id_categoria: e.target.value, id_subcategoria: ''})}
                  >
                    <option value="">Seleccionar...</option>
                    {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Subcategoría</label>
                  <select 
                    value={formData.id_subcategoria} 
                    onChange={e => setFormData({...formData, id_subcategoria: e.target.value})}
                    disabled={!formData.id_categoria}
                  >
                    <option value="">Seleccionar...</option>
                    {subCatsFiltradas.map(s => <option key={s.id_subcategoria} value={s.id_subcategoria}>{s.nombre}</option>)}
                  </select>
                </div>
                <div className="field full">
                  <label>Descripción</label>
                  <textarea 
                    value={formData.descripcion} 
                    onChange={e => setFormData({...formData, descripcion: e.target.value})}
                  />
                </div>
                <div className="field full">
                  <label>URL Imagen</label>
                  <input 
                    type="text" 
                    value={formData.foto_url} 
                    onChange={e => setFormData({...formData, foto_url: e.target.value})}
                  />
                  {formData.foto_url && <img src={formData.foto_url} alt="Preview" className="img-preview" />}
                </div>
                <div className="field row">
                  <label className="checkbox">
                    <input 
                      type="checkbox" 
                      checked={formData.destacado} 
                      onChange={e => setFormData({...formData, destacado: e.target.checked})}
                    /> Destacado
                  </label>
                  <label className="checkbox">
                    <input 
                      type="checkbox" 
                      checked={formData.estado} 
                      onChange={e => setFormData({...formData, estado: e.target.checked})}
                    /> Activo
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancelar</button>
                <button type="submit" className="save-btn">Guardar Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductos;
