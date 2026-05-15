# Hilara Store - Sucursal Digital

Sistema completo de e-commerce para Hilara (Ruanas y Pashminas).

## 🚀 Tecnologías
- **Frontend**: React + Vite
- **Base de Datos**: Supabase
- **Estilos**: Vanilla CSS (Variables & Glassmorphism)
- **Iconos**: Lucide React
- **Notificaciones**: React Toastify

## 🛠️ Instalación y Desarrollo
1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno:
   - Crear un archivo `.env` basado en `.env.example`.
   - Cargar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
4. Ejecutar localmente:
   ```bash
   npm run dev
   ```

## 🗃️ Base de Datos (Supabase)
1. Copiar el contenido de `supabase_script.sql` en el SQL Editor de Supabase.
2. Ejecutar para crear las tablas, funciones y cargar datos iniciales.

## 🔐 Administración
- **URL**: `/admin/login`
- **Usuario**: `admin`
- **Contraseña**: `123456`
(Configurable en `src/utils/config.js`)

## 📦 Deploy (Netlify)
El proyecto incluye un archivo `_redirects` en la carpeta `public` para soportar el ruteo de React (SPA).
Asegurarse de configurar las variables de entorno en el panel de Netlify.
