import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

console.log("Hilara: Initializing React App...");

window.onerror = function(message, source, lineno, colno, error) {
  const errDiv = document.createElement('div');
  errDiv.style.padding = '20px';
  errDiv.style.color = 'red';
  errDiv.style.background = 'white';
  errDiv.style.position = 'fixed';
  errDiv.style.zIndex = '10000';
  errDiv.innerHTML = `<h1>Critical JS Error</h1><p>${message}</p><small>${source}:${lineno}</small>`;
  document.body.appendChild(errDiv);
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  alert("FATAL: #root element not found in DOM!");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
