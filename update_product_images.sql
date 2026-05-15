-- UPDATE PRODUCT IMAGES WITH REAL UNSPLASH URLS
-- Keywords: ruana, pashmina, shawl, knitwear, wool textile

UPDATE productos SET foto_url = 'https://images.unsplash.com/photo-1601924921557-45e6ecd080ee?w=800' WHERE titulo = 'Ruana Alpaca Gold';
UPDATE productos SET foto_url = 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800' WHERE titulo = 'Ruana Mistral';
UPDATE productos SET foto_url = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800' WHERE titulo = 'Ruana Norte Beige';
UPDATE productos SET foto_url = 'https://images.unsplash.com/photo-1456889419948-46c84916da65?w=800' WHERE titulo = 'Pashmina Seda Real';
UPDATE productos SET foto_url = 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800' WHERE titulo = 'Pashmina Nude Light';
UPDATE productos SET foto_url = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800' WHERE titulo LIKE '%Ruana%' AND foto_url IS NULL;
UPDATE productos SET foto_url = 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800' WHERE titulo LIKE '%Pashmina%' AND foto_url IS NULL;
