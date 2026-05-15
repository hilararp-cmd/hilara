import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { productosService } from '../../services/productosService';
import { categoriasService } from '../../services/categoriasService';
import { subcategoriasService } from '../../services/subcategoriasService';
import ProductoCard from '../../components/ProductoCard';
import './Home.css';

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filtroCat, setFiltroCat] = useState(null);
  const [filtroSub, setFiltroSub] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [debouncedBusqueda, setDebouncedBusqueda] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedBusqueda(busqueda);
    }, 280);
    return () => clearTimeout(timer);
  }, [busqueda]);

  const loadData = async () => {
    try {
      const [p, c, s] = await Promise.all([
        productosService.getActivos(),
        categoriasService.getActivas(),
        subcategoriasService.getAll()
      ]);
      setProductos(p);
      setCategorias(c);
      setSubcategorias(s);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = productos.filter(p => {
    const matchesCat = filtroCat ? p.id_categoria === filtroCat : true;
    const matchesSub = filtroSub ? p.id_subcategoria === filtroSub : true;
    const matchesSearch = p.titulo.toLowerCase().includes(debouncedBusqueda.toLowerCase()) || 
                         p.descripcion?.toLowerCase().includes(debouncedBusqueda.toLowerCase());
    return matchesCat && matchesSub && matchesSearch;
  });

  const subCatsFiltradas = subcategorias.filter(s => s.id_categoria === filtroCat);

  return (
    <div className="home-page">
      <header className="hero">
        <div className="hero-grid-bg"></div>
        <div className="hero-content">
          <div className="floating-logo">H</div>
          <h1 className="hero-title">Arte Textil con Esencia Natural</h1>
          <p className="hero-tagline">
            Ruanas y pashminas con identidad cálida, diseño artesanal y una estética inspirada en tonos tierra.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">100%</span>
              <span className="stat-label">Artesanal</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">Premium</span>
              <span className="stat-label">Calidad</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">Tucumán</span>
              <span className="stat-label">Origen</span>
            </div>
          </div>
        </div>
      </header>

      <main className="store-container">
        <section className="filters-section">
          <div className="search-bar-full">
            <Search size={20} />
            <input 
              type="text" 
              placeholder="¿Qué estás buscando hoy?" 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="categories-pills">
            <button 
              className={`pill ${!filtroCat ? 'active' : ''}`}
              onClick={() => { setFiltroCat(null); setFiltroSub(null); }}
            >
              Todos
            </button>
            {categorias.map(cat => (
              <button 
                key={cat.id_categoria}
                className={`pill ${filtroCat === cat.id_categoria ? 'active' : ''}`}
                onClick={() => { setFiltroCat(cat.id_categoria); setFiltroSub(null); }}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          {filtroCat && subCatsFiltradas.length > 0 && (
            <div className="subcategories-pills animate-in">
              <button 
                className={`sub-pill ${!filtroSub ? 'active' : ''}`}
                onClick={() => setFiltroSub(null)}
              >
                Todas las {categorias.find(c => c.id_categoria === filtroCat)?.nombre}
              </button>
              {subCatsFiltradas.map(sub => (
                <button 
                  key={sub.id_subcategoria}
                  className={`sub-pill ${filtroSub === sub.id_subcategoria ? 'active' : ''}`}
                  onClick={() => setFiltroSub(sub.id_subcategoria)}
                >
                  {sub.nombre}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="products-grid">
          {loading ? (
            <div className="loading-state">Cargando colección...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-results">No encontramos productos con esos filtros.</div>
          ) : (
            <div className="grid">
              {filteredProducts.map(prod => (
                <ProductoCard key={prod.id_producto} producto={prod} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
