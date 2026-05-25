ALTER TABLE products ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

UPDATE products SET status = 'active' WHERE status IS NULL;
