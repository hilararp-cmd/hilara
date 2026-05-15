-- DATABASE SCHEMA FOR HILARA
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Tables
CREATE TABLE IF NOT EXISTS categorias (
  id_categoria  SERIAL PRIMARY KEY,
  nombre        TEXT NOT NULL,
  descripcion   TEXT,
  estado        BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subcategorias (
  id_subcategoria SERIAL PRIMARY KEY,
  id_categoria    INTEGER REFERENCES categorias(id_categoria) ON DELETE CASCADE,
  nombre          TEXT NOT NULL,
  estado          BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS productos (
  id_producto     SERIAL PRIMARY KEY,
  id_categoria    INTEGER REFERENCES categorias(id_categoria) ON DELETE SET NULL,
  id_subcategoria INTEGER REFERENCES subcategorias(id_subcategoria) ON DELETE SET NULL,
  titulo          TEXT NOT NULL,
  descripcion     TEXT,
  precio          NUMERIC(12,2) NOT NULL DEFAULT 0,
  stock           INTEGER DEFAULT 0,
  foto_url        TEXT,
  destacado       BOOLEAN DEFAULT false,
  estado          BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clientes (
  id_cliente      SERIAL PRIMARY KEY,
  nombre_apellido TEXT NOT NULL,
  telefono        TEXT NOT NULL UNIQUE,
  email           TEXT,
  direccion       TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pedidos (
  id_pedido             SERIAL PRIMARY KEY,
  id_cliente            INTEGER REFERENCES clientes(id_cliente) ON DELETE SET NULL,
  numero_ticket         TEXT UNIQUE NOT NULL,
  fecha_pedido          TIMESTAMPTZ DEFAULT now(),
  estado_pedido         TEXT DEFAULT 'Pendiente'
                        CHECK (estado_pedido IN
                          ('Pendiente','En preparación','Enviado','Finalizado','Cancelado')),
  forma_entrega         TEXT NOT NULL,
  forma_pago            TEXT NOT NULL,
  subtotal              NUMERIC(12,2) DEFAULT 0,
  total                 NUMERIC(12,2) DEFAULT 0,
  direccion_entrega     TEXT,
  observaciones_cliente TEXT,
  notas_internas        TEXT,
  created_at            TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pedido_detalle (
  id_pedido_detalle SERIAL PRIMARY KEY,
  id_pedido         INTEGER REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
  id_producto       INTEGER REFERENCES productos(id_producto) ON DELETE SET NULL,
  titulo_producto   TEXT NOT NULL,
  precio_unitario   NUMERIC(12,2) NOT NULL,
  cantidad          INTEGER NOT NULL DEFAULT 1,
  subtotal          NUMERIC(12,2) NOT NULL
);

-- 2. RLS (Row Level Security)
ALTER TABLE categorias     ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategorias  ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_detalle ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pub_select_cat"  ON categorias     FOR SELECT USING (true);
CREATE POLICY "pub_select_sub" ON subcategorias  FOR SELECT USING (true);
CREATE POLICY "pub_select_prod" ON productos      FOR SELECT USING (true);
CREATE POLICY "all_clientes"    ON clientes       FOR ALL    USING (true);
CREATE POLICY "all_pedidos"     ON pedidos        FOR ALL    USING (true);
CREATE POLICY "all_detalle"     ON pedido_detalle FOR ALL    USING (true);

-- Admin policies (Simplified for this use case as per prompt instructions)
CREATE POLICY "admin_cat"       ON categorias     FOR ALL    USING (true);
CREATE POLICY "admin_sub"       ON subcategorias  FOR ALL    USING (true);
CREATE POLICY "admin_prod"      ON productos      FOR ALL    USING (true);

-- 3. Functions
CREATE OR REPLACE FUNCTION decrement_stock(product_id INT, amount INT)
RETURNS VOID AS $$
BEGIN
  UPDATE productos
  SET stock = stock - amount
  WHERE id_producto = product_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Seed Data
INSERT INTO categorias (nombre, descripcion) VALUES
('Ruanas', 'Ruanas artesanales de lana seleccionada'),
('Pashminas', 'Pashminas suaves y elegantes'),
('Bufandas', 'Bufandas para el invierno'),
('Estolas', 'Estolas para eventos y fiestas'),
('Colección Especial', 'Piezas únicas y limitadas');

INSERT INTO subcategorias (id_categoria, nombre) VALUES
(1, 'Alpaca'),
(1, 'Lana de Oveja'),
(2, 'Seda'),
(2, 'Cachemira'),
(5, 'Edición Limitada');

INSERT INTO productos (id_categoria, id_subcategoria, titulo, descripcion, precio, stock, foto_url, destacado) VALUES
(1, 1, 'Ruana Alpaca Gold', 'Lana de alpaca seleccionada con terminación premium.', 185000, 10, 'https://images.unsplash.com/photo-1601924921557-45e6ecd080ee', true),
(1, 1, 'Ruana Mistral', 'Diseño sobrio con caída envolvente y textura noble.', 195000, 5, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea', true),
(1, 2, 'Ruana Norte Beige', 'Inspirada en tonos arena y fibras visualmente cálidas.', 172000, 8, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246', false),
(2, 3, 'Pashmina Seda Real', 'Seda natural con caída impecable, textura suave.', 85000, 15, 'https://images.unsplash.com/photo-1456889419948-46c84916da65', true),
(2, 4, 'Pashmina Nude Light', 'Diseño minimalista y luminoso.', 79000, 12, 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b', false);
