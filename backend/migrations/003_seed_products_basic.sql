INSERT INTO products (seller_id, category_id, name, slug, description, image_emoji, price_cents, old_price_cents, stock, rating, review_count, is_featured)
SELECT s.id, c.id, 'Notebook Gamer Pro 16', 'notebook-gamer-pro-16', 'Notebook gamer com GPU dedicada, tela rapida, 16GB RAM e SSD.', 'laptop', 699900, 849900, 18, 4.8, 256, true
FROM sellers s, categories c
WHERE s.slug = 'nexus-oficial' AND c.slug = 'notebooks'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (seller_id, category_id, name, slug, description, image_emoji, price_cents, old_price_cents, stock, rating, review_count, is_featured)
SELECT s.id, c.id, 'Notebook Nitro Performance', 'notebook-nitro-performance', 'Notebook para jogos e produtividade com SSD NVMe e tela IPS.', 'laptop', 439900, 499900, 24, 4.7, 198, true
FROM sellers s, categories c
WHERE s.slug = 'acer-oficial' AND c.slug = 'notebooks'
ON CONFLICT (slug) DO NOTHING;
