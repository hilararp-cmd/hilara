import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(user, pass)) {
      toast.success('¡Bienvenido, Administrador!');
      navigate('/admin/dashboard');
    } else {
      toast.error('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <header className="login-header">
          <h1>HILARA</h1>
          <p>Panel de Administración</p>
        </header>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Usuario</label>
            <input 
              type="text" value={user} 
              onChange={(e) => setUser(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input 
              type="password" value={pass} 
              onChange={(e) => setPass(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="login-btn">
            Ingresar al Sistema
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
