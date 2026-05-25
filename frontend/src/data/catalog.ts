import type { Category, Product } from '../types'

export const productsSeed: Product[] = [
  { id: '1', name: 'Notebook Gamer Pro 16', slug: 'notebook-gamer-pro-16', description: 'GPU dedicada, 16GB RAM, SSD NVMe e tela rapida para games, edicao e produtividade.', imageEmoji: '💻', priceCents: 699900, oldPriceCents: 849900, stock: 18, rating: 4.8, reviewCount: 256, sellerName: 'Nexus Oficial', categorySlug: 'notebooks' },
  { id: '2', name: 'Smartphone Ultra 5G 256GB', slug: 'smartphone-ultra-5g', description: 'Tela OLED, camera avancada, bateria para o dia todo e carregamento rapido.', imageEmoji: '📱', priceCents: 429900, oldPriceCents: 499900, stock: 42, rating: 4.7, reviewCount: 412, sellerName: 'Mobile Prime', categorySlug: 'smartphones' },
  { id: '3', name: 'SSD Kingston NV2 1TB NVMe M.2', slug: 'ssd-kingston-nv2-1tb', description: 'Upgrade de performance para notebooks, PCs e workstations com leitura ultrarrapida.', imageEmoji: '💾', priceCents: 28990, oldPriceCents: 38990, stock: 120, rating: 4.7, reviewCount: 842, sellerName: 'Nexus Oficial', categorySlug: 'componentes' },
  { id: '4', name: 'Mouse Gamer Logitech G502 HERO', slug: 'mouse-logitech-g502-hero', description: 'Sensor 25K, RGB, pesos ajustaveis e botoes programaveis para alta precisao.', imageEmoji: '🖱️', priceCents: 33990, oldPriceCents: 39990, stock: 80, rating: 4.6, reviewCount: 621, sellerName: 'Logitech Store', categorySlug: 'perifericos' },
  { id: '5', name: 'Xbox Series S 512GB SSD', slug: 'console-xbox-series-s-512gb', description: 'Console compacto de nova geracao com SSD, Quick Resume e Game Pass.', imageEmoji: '🎮', priceCents: 219900, oldPriceCents: null, stock: 33, rating: 4.8, reviewCount: 1102, sellerName: 'Microsoft Store', categorySlug: 'games' },
  { id: '6', name: 'Monitor Gamer 27 QHD 165Hz', slug: 'monitor-gamer-27-qhd', description: 'Painel QHD, baixa latencia, 165Hz e base ajustavel para setup premium.', imageEmoji: '🖥️', priceCents: 189900, oldPriceCents: 239900, stock: 21, rating: 4.9, reviewCount: 178, sellerName: 'Display Tech', categorySlug: 'perifericos' },
]

export const categories: Category[] = [
  { id: 'notebooks', name: 'Notebooks', slug: 'notebooks', icon: '💻' },
  { id: 'smartphones', name: 'Smartphones', slug: 'smartphones', icon: '📱' },
  { id: 'componentes', name: 'Componentes', slug: 'componentes', icon: '🧩' },
  { id: 'perifericos', name: 'Perifericos', slug: 'perifericos', icon: '⌨️' },
  { id: 'games', name: 'Games', slug: 'games', icon: '🎮' },
]
