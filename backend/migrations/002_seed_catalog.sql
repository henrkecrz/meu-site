INSERT INTO categories (name, slug, icon) VALUES
  ('Notebooks', 'notebooks', 'laptop'),
  ('Smartphones', 'smartphones', 'phone'),
  ('Componentes', 'componentes', 'chip'),
  ('Perifericos', 'perifericos', 'keyboard'),
  ('Games', 'games', 'gamepad')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sellers (name, slug, reputation, is_verified) VALUES
  ('Nexus Oficial', 'nexus-oficial', 4.9, true),
  ('ASUS Oficial', 'asus-oficial', 4.8, true),
  ('Acer Oficial', 'acer-oficial', 4.7, true)
ON CONFLICT (slug) DO NOTHING;
