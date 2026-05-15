import React, { useState } from 'react';
import { ShoppingBasket, Search, Menu, X } from 'lucide-react';
import { useCarrito } from '../context/CarritoContext';
import './Navbar.css';

const Navbar = ({ onOpenCart, onToggleMenu }) => {
  const { totalItems } = useCarrito();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-left">
          <button className="mobile-menu-btn" onClick={onToggleMenu}>
            <Menu size={24} />
          </button>
          <div className={`search-pill ${isSearchOpen ? 'open' : ''}`}>
            <Search size={18} className="search-icon" onClick={() => setIsSearchOpen(!isSearchOpen)} />
            <input type="text" placeholder="Buscar..." />
          </div>
        </div>

        <div className="nav-center">
          <h1 className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            HILARA
          </h1>
        </div>

        <div className="nav-right">
          <button className="cart-btn" onClick={onOpenCart}>
            <ShoppingBasket size={24} />
            {totalItems > 0 && (
              <span className="cart-badge animate-pulse-ring">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
