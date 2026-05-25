import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Menu, Search, ShoppingCart, UserRound, LogOut, Star, Truck, ShieldCheck, Zap, X, Minus, Plus, PackageCheck, Store, LayoutDashboard, Heart, Headphones, CreditCard, Users, Boxes, ClipboardList } from 'lucide-react'
import { cents, Product, Category } from './types'
import { getCategories, getProducts, getMe, syncProfile, getCart, addCartItem, createOrder, getOrders, getSellerDashboard, getSellerProducts, getSellerOrders, getAdminDashboard, getAdminUsers, getAdminSellers, getAdminProducts, getAdminOrders, Cart, Order, SellerDashboard as SellerDashboardData, AdminDashboard as AdminDashboardData, AdminUser, AdminSeller } from './api'

type Page = 'home' | 'products' | 'productDetail' | 'cart' | 'checkout' | 'orders' | 'account' | 'support' | 'seller' | 'sellerProducts' | 'sellerOrders' | 'admin' | 'adminUsers' | 'adminSellers' | 'adminProducts' | 'adminOrders'
type LocalCartItem = Product & { quantity: number }
type DemoUser = { name: string; email: string; role: 'customer' | 'seller' | 'admin' }

const DEMO_EMAIL = 'demo@nexuscommerce.com'
const DEMO_PASSWORD = 'demo123'

const fallbackProducts: Product[] = [
  { id: '1', name: 'Notebook Gamer Pro 16', slug: 'notebook-gamer-pro-16', description: 'GPU dedicada, 16GB RAM, SSD NVMe e tela de alta taxa para games, edicao e produtividade.', imageEmoji: '💻', priceCents: 699900, oldPriceCents: 849900, stock: 18, rating: 4.8, reviewCount: 256, sellerName: 'Nexus Oficial', categorySlug: 'notebooks' },
  { id: '2', name: 'Smartphone Ultra 5G 256GB', slug: 'smartphone-ultra-5g', description: 'Tela OLED, camera avancada, bateria para o dia todo e carregamento rapido.', imageEmoji: '📱', priceCents: 429900, oldPriceCents: 499900, stock: 42, rating: 4.7, reviewCount: 412, sellerName: 'Mobile Prime', categorySlug: 'smartphones' },
  { id: '3', name: 'SSD Kingston NV2 1TB NVMe M.2', slug: 'ssd-kingston-nv2-1tb', description: 'Upgrade de performance para notebooks, PCs e workstations com leitura ultrarrapida.', imageEmoji: '💾', priceCents: 28990, oldPriceCents: 38990, stock: 120, rating: 4.7, reviewCount: 842, sellerName: 'Nexus Oficial', categorySlug: 'componentes' },
  { id: '4', name: 'Mouse Gamer Logitech G502 HERO', slug: 'mouse-logitech-g502-hero', description: 'Sensor 25K, RGB, pesos ajustaveis e botoes programaveis para alta precisao.', imageEmoji: '🖱️', priceCents: 33990, oldPriceCents: 39990, stock: 80, rating: 4.6, reviewCount: 621, sellerName: 'Logitech Store', categorySlug: 'perifericos' },
  { id: '5', name: 'Xbox Series S 512GB SSD', slug: 'console-xbox-series-s-512gb', description: 'Console compacto de nova geracao com SSD, Quick Resume e Game Pass.', imageEmoji: '🎮', priceCents: 219900, oldPriceCents: null, stock: 33, rating: 4.8, reviewCount: 1102, sellerName: 'Microsoft Store', categorySlug: 'games' },
  { id: '6', name: 'Monitor Gamer 27 QHD 165Hz', slug: 'monitor-gamer-27-qhd', description: 'Painel QHD, baixa latencia, 165Hz e base ajustavel para setup premium.', imageEmoji: '🖥️', priceCents: 189900, oldPriceCents: 239900, stock: 21, rating: 4.9, reviewCount: 178, sellerName: 'Display Tech', categorySlug: 'perifericos' },
]

const fallbackCategories: Category[] = [
  { id: 'notebooks', name: 'Notebooks', slug: 'notebooks', icon: '💻' },
  { id: 'smartphones', name: 'Smartphones', slug: 'smartphones', icon: '📱' },
  { id: 'componentes', name: 'Componentes', slug: 'componentes', icon: '🧩' },
  { id: 'perifericos', name: 'Perifericos', slug: 'perifericos', icon: '⌨️' },
  { id: 'games', name: 'Games', slug: 'games', icon: '🎮' },
]

const navGroups: { title: string; items: { label: string; page: Page }[] }[] = [
  { title: 'Loja', items: [{ label: 'Home', page: 'home' }, { label: 'Catalogo', page: 'products' }, { label: 'Carrinho', page: 'cart' }, { label: 'Checkout', page: 'checkout' }] },
  { title: 'Cliente', items: [{ label: 'Pedidos', page: 'orders' }, { label: 'Conta', page: 'account' }, { label: 'Suporte', page: 'support' }] },
  { title: 'Vendedor', items: [{ label: 'Dashboard', page: 'seller' }, { label: 'Produtos', page: 'sellerProducts' }, { label: 'Pedidos', page: 'sellerOrders' }] },
  { title: 'Admin', items: [{ label: 'Painel', page: 'admin' }, { label: 'Usuarios', page: 'adminUsers' }, { label: 'Sellers', page: 'adminSellers' }, { label: 'Produtos', page: 'adminProducts' }, { label: 'Pedidos', page: 'adminOrders' }] },
]

function Header({ page, setPage, cartCount, openCart, onSearch, demoUser, demoLogout }: { page: Page; setPage: (page: Page) => void; cartCount: number; openCart: () => void; onSearch: (term: string) => void; demoUser?: DemoUser; demoLogout: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [term, setTerm] = useState('')
  const { isAuthenticated, user, logout } = useAuth0()
  const logged = isAuthenticated || !!demoUser
  const accountName = demoUser?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Conta'
  const primaryNav = ['home', 'products', 'cart', 'orders', 'seller', 'admin'] as Page[]
  const labelFor = (p: Page) => navGroups.flatMap(g => g.items).find(i => i.page === p)?.label || p

  function submit(event: FormEvent) {
    event.preventDefault()
    onSearch(term)
    setPage('products')
    setMobileOpen(false)
  }

  function go(next: Page) {
    setPage(next)
    setMobileOpen(false)
  }

  function signOut() {
    if (demoUser) demoLogout()
    else logout({ logoutParams: { returnTo: window.location.origin } })
    setMobileOpen(false)
  }

  return (
    <header className="site-header">
      <div className="topbar"><span>Marketplace dark premium • Todas as paginas integradas</span><span>Login demo: {DEMO_EMAIL} / {DEMO_PASSWORD}</span></div>
      <div className="header-main container">
        <button className="menu-button" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Menu size={22} /></button>
        <button className="brand" onClick={() => go('home')}><strong>Nexus</strong><span>Commerce</span></button>
        <form className="searchbar" onSubmit={submit}>
          <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Buscar notebook, SSD, celular..." />
          <button aria-label="Buscar"><Search size={18} /></button>
        </form>
        <nav className="desktop-nav">{primaryNav.map(item => <button key={item} className={page === item ? 'active' : ''} onClick={() => item === 'cart' ? openCart() : go(item)}>{labelFor(item)}</button>)}</nav>
        <button className="account-pill" onClick={() => go('account')}><UserRound size={18} />{logged ? accountName : 'Entrar'}</button>
        <button className="cart-button" onClick={openCart}><ShoppingCart size={20} /><b>{cartCount}</b></button>
      </div>
      {mobileOpen ? <div className="mobile-panel"><div className="mobile-panel-head"><strong>Mapa do site</strong><button onClick={() => setMobileOpen(false)}><X /></button></div>{navGroups.map(group => <div className="mobile-group" key={group.title}><small>{group.title}</small>{group.items.map(item => <button key={item.page} className={page === item.page ? 'active' : ''} onClick={() => item.page === 'cart' ? (openCart(), setMobileOpen(false)) : go(item.page)}>{item.label}</button>)}</div>)}{logged ? <button onClick={signOut}><LogOut size={18} /> Sair</button> : null}</div> : null}
    </header>
  )
}

function SiteMap({ page, setPage }: { page: Page; setPage: (page: Page) => void }) {
  return <nav className="site-map container">{navGroups.map(group => <div key={group.title}><strong>{group.title}</strong>{group.items.map(item => <button key={item.page} className={page === item.page ? 'active' : ''} onClick={() => setPage(item.page)}>{item.label}</button>)}</div>)}</nav>
}

function ProductCard({ product, onAdd, onView }: { product: Product; onAdd: (product: Product) => void; onView: (product: Product) => void }) {
  return <article className="product-card"><button className="product-media" onClick={() => onView(product)}><span>{product.imageEmoji}</span>{product.oldPriceCents ? <em>Oferta</em> : null}</button><div className="product-info"><small>{product.sellerName}</small><h3>{product.name}</h3><p>{product.description}</p><div className="rating"><Star size={14} fill="currentColor" /> {product.rating} <span>({product.reviewCount})</span></div><div className="price-row"><strong>{cents(product.priceCents)}</strong>{product.oldPriceCents ? <del>{cents(product.oldPriceCents)}</del> : null}</div><div className="card-actions"><button className="secondary full" onClick={() => onView(product)}>Detalhes</button><button className="primary full" onClick={() => onAdd(product)}>Adicionar</button></div></div></article>
}

function HomePage({ categories, products, setPage, onAdd, onView }: { categories: Category[]; products: Product[]; setPage: (page: Page) => void; onAdd: (product: Product) => void; onView: (product: Product) => void }) {
  return <><section className="hero container"><div className="hero-copy"><span className="eyebrow">Marketplace de tecnologia</span><h1>Todas as telas agora viraram produto.</h1><p>Home, catalogo, detalhes, carrinho, checkout, cliente, vendedor, admin e suporte em uma experiencia escura e responsiva.</p><div className="hero-actions"><button className="primary" onClick={() => setPage('products')}>Explorar catalogo</button><button className="secondary" onClick={() => setPage('checkout')}>Ver checkout</button></div></div><div className="hero-card"><span>⚡</span><strong>Dark Commerce OS</strong><small>Loja, vendedor e admin integrados</small></div></section><section className="benefits container"><div><Truck /><strong>Loja completa</strong><small>Catalogo, detalhes e carrinho</small></div><div><ShieldCheck /><strong>Cliente</strong><small>Conta, pedidos e suporte</small></div><div><Zap /><strong>Operacao</strong><small>Seller e Admin visiveis</small></div></section><SiteMap page="home" setPage={setPage} /><section className="section container"><div className="section-head"><h2>Categorias</h2><button onClick={() => setPage('products')}>Ver tudo</button></div><div className="category-grid">{categories.map(c => <button key={c.slug} onClick={() => setPage('products')}><span>{c.icon}</span><strong>{c.name}</strong></button>)}</div></section><section className="section container"><div className="section-head"><h2>Produtos em destaque</h2><button onClick={() => setPage('products')}>Catalogo completo</button></div><div className="product-strip">{products.slice(0, 4).map(product => <ProductCard key={product.id} product={product} onAdd={onAdd} onView={onView} />)}</div></section></>
}

function ProductsPage({ products, categories, selectedCategory, setSelectedCategory, onAdd, onView, search }: { products: Product[]; categories: Category[]; selectedCategory: string; setSelectedCategory: (slug: string) => void; onAdd: (product: Product) => void; onView: (product: Product) => void; search: string }) {
  const filtered = products.filter(product => (!selectedCategory || product.categorySlug === selectedCategory) && (!search || product.name.toLowerCase().includes(search.toLowerCase())))
  return <section className="catalog container"><aside className="filters"><h2>Catalogo</h2><p>Produtos reais do marketplace. Clique em detalhes para abrir a pagina do produto.</p><button className={!selectedCategory ? 'active' : ''} onClick={() => setSelectedCategory('')}>Todos</button>{categories.map(c => <button key={c.slug} className={selectedCategory === c.slug ? 'active' : ''} onClick={() => setSelectedCategory(c.slug)}>{c.icon} {c.name}</button>)}</aside><div className="catalog-main"><div className="section-head"><div><span className="eyebrow">Produtos</span><h1>{search ? `Busca por “${search}”` : 'Produtos de tecnologia'}</h1></div><span className="result-count">{filtered.length} itens</span></div><div className="product-grid">{filtered.map(product => <ProductCard key={product.id} product={product} onAdd={onAdd} onView={onView} />)}</div></div></section>
}

function ProductDetailPage({ product, onAdd, setPage }: { product: Product; onAdd: (product: Product) => void; setPage: (page: Page) => void }) {
  return <section className="panel-page container"><button className="secondary" onClick={() => setPage('products')}>Voltar ao catalogo</button><div className="detail-layout"><div className="detail-media"><span>{product.imageEmoji}</span></div><div className="detail-panel"><span className="eyebrow">{product.sellerName}</span><h1>{product.name}</h1><p>{product.description}</p><div className="rating"><Star size={16} fill="currentColor" /> {product.rating} <span>{product.reviewCount} avaliacoes</span></div><div className="price-row detail-price"><strong>{cents(product.priceCents)}</strong>{product.oldPriceCents ? <del>{cents(product.oldPriceCents)}</del> : null}</div><div className="kpis"><div><small>Estoque</small><strong>{product.stock}</strong></div><div><small>Categoria</small><strong>{product.categorySlug}</strong></div><div><small>Garantia</small><strong>12m</strong></div><div><small>Entrega</small><strong>Turbo</strong></div></div><div className="hero-actions"><button className="primary" onClick={() => onAdd(product)}>Adicionar ao carrinho</button><button className="secondary" onClick={() => setPage('checkout')}>Comprar agora</button></div></div></div></section>
}

function CartDrawer({ open, close, items, increase, decrease, remove, checkout, checkingOut, status }: { open: boolean; close: () => void; items: LocalCartItem[]; increase: (id: string) => void; decrease: (id: string) => void; remove: (id: string) => void; checkout: () => void; checkingOut: boolean; status: string }) {
  const total = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)
  return <div className={`cart-layer ${open ? 'show' : ''}`}><button className="cart-backdrop" onClick={close} aria-label="Fechar carrinho" /><aside className="cart-drawer"><div className="drawer-head"><div><strong>Carrinho</strong><small>{items.length} produto(s)</small></div><button onClick={close}><X /></button></div><CartList items={items} increase={increase} decrease={decrease} remove={remove} /><div className="drawer-footer"><p>{status}</p><div className="total"><span>Total</span><strong>{cents(total)}</strong></div><button className="primary full" disabled={!items.length || checkingOut} onClick={checkout}>{checkingOut ? 'Finalizando...' : 'Finalizar compra'}</button></div></aside></div>
}

function CartList({ items, increase, decrease, remove }: { items: LocalCartItem[]; increase: (id: string) => void; decrease: (id: string) => void; remove: (id: string) => void }) {
  return <div className="cart-items">{items.length ? items.map(item => <div className="cart-item" key={item.id}><span>{item.imageEmoji}</span><div><strong>{item.name}</strong><small>{cents(item.priceCents)}</small><div className="qty"><button onClick={() => decrease(item.id)}><Minus size={14} /></button><b>{item.quantity}</b><button onClick={() => increase(item.id)}><Plus size={14} /></button><button className="remove" onClick={() => remove(item.id)}>remover</button></div></div></div>) : <div className="empty"><ShoppingCart /><strong>Seu carrinho esta vazio</strong><small>Adicione produtos do catalogo.</small></div>}</div>
}

function CartPage({ items, increase, decrease, remove, setPage }: { items: LocalCartItem[]; increase: (id: string) => void; decrease: (id: string) => void; remove: (id: string) => void; setPage: (page: Page) => void }) {
  const total = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)
  return <section className="panel-page container"><span className="eyebrow"><ShoppingCart size={14} /> Loja</span><h1>Carrinho completo</h1><p>Pagina dedicada do carrinho, alem do drawer lateral.</p><div className="checkout-grid"><CartList items={items} increase={increase} decrease={decrease} remove={remove} /><aside className="checkout-summary"><h2>Resumo</h2><div className="total"><span>Total</span><strong>{cents(total)}</strong></div><button className="primary full" disabled={!items.length} onClick={() => setPage('checkout')}>Ir para checkout</button><button className="secondary full" onClick={() => setPage('products')}>Continuar comprando</button></aside></div></section>
}

function CheckoutPage({ items, checkout, checkingOut, demoUser }: { items: LocalCartItem[]; checkout: () => void; checkingOut: boolean; demoUser?: DemoUser }) {
  const total = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)
  return <section className="panel-page container"><span className="eyebrow"><CreditCard size={14} /> Checkout</span><h1>Finalizar compra</h1><p>Checkout em etapas para o fluxo real do marketplace.</p><div className="checkout-grid"><div className="checkout-steps"><article><strong>1. Identificacao</strong><small>{demoUser ? `Logado como ${demoUser.email}` : 'Use o login demo para salvar pedido local.'}</small></article><article><strong>2. Entrega</strong><small>Entrega turbo simulada para todo o Brasil.</small></article><article><strong>3. Pagamento</strong><small>Pix, cartao e boleto prontos para integracao futura.</small></article></div><aside className="checkout-summary"><h2>Resumo</h2>{items.map(item => <div className="mini-row" key={item.id}><strong>{item.quantity}x {item.name}</strong><small>{cents(item.priceCents * item.quantity)}</small></div>)}<div className="total"><span>Total</span><strong>{cents(total)}</strong></div><button className="primary full" disabled={!items.length || checkingOut} onClick={checkout}>{checkingOut ? 'Finalizando...' : 'Confirmar pedido'}</button></aside></div></section>
}

function OrdersPage({ orders, status }: { orders: Order[]; status: string }) {
  return <section className="panel-page container"><span className="eyebrow"><PackageCheck size={14} /> Cliente</span><h1>Meus pedidos</h1><p>{status}</p><div className="panel-list">{orders.length ? orders.map(order => <article key={order.orderId} className="panel-card"><PackageCheck /><div><strong>Pedido {order.orderId.slice(0, 12)}</strong><small>{new Date(order.createdAt).toLocaleString('pt-BR')} • {order.status}</small></div><b>{cents(order.totalCents)}</b></article>) : <div className="empty-card">Nenhum pedido encontrado.</div>}</div></section>
}

function SellerPage({ dashboard, products, orders, status, setPage }: { dashboard?: SellerDashboardData; products: Product[]; orders: Order[]; status: string; setPage: (page: Page) => void }) {
  const sold = orders.flatMap(o => o.items)
  return <section className="panel-page container"><span className="eyebrow"><Store size={14} /> Vendedor</span><h1>Dashboard do vendedor</h1><p>{status}</p><div className="kpis"><div><small>Produtos</small><strong>{dashboard?.productsActive ?? products.length}</strong></div><div><small>Estoque</small><strong>{dashboard?.stockTotal ?? products.reduce((t, p) => t + p.stock, 0)}</strong></div><div><small>Vendidos</small><strong>{dashboard?.itemsSold ?? sold.reduce((t, i) => t + i.quantity, 0)}</strong></div><div><small>Receita</small><strong>{cents(dashboard?.revenueCents ?? sold.reduce((t, i) => t + i.lineTotal, 0))}</strong></div></div><div className="page-actions"><button className="secondary" onClick={() => setPage('sellerProducts')}>Produtos do vendedor</button><button className="secondary" onClick={() => setPage('sellerOrders')}>Pedidos recebidos</button></div></section>
}

function SellerProductsPage({ products }: { products: Product[] }) {
  return <section className="panel-page container"><span className="eyebrow"><Boxes size={14} /> Vendedor</span><h1>Produtos do vendedor</h1><div className="panel-list">{products.map(p => <article className="panel-card" key={p.id}><span className="emoji">{p.imageEmoji}</span><div><strong>{p.name}</strong><small>Estoque {p.stock} • {cents(p.priceCents)} • {p.sellerName}</small></div><b>{p.rating} ★</b></article>)}</div></section>
}

function SellerOrdersPage({ orders }: { orders: Order[] }) {
  const items = orders.flatMap(order => order.items.map(item => ({ ...item, orderId: order.orderId, createdAt: order.createdAt })))
  return <section className="panel-page container"><span className="eyebrow"><ClipboardList size={14} /> Vendedor</span><h1>Pedidos recebidos</h1><div className="panel-list">{items.length ? items.map(item => <article className="panel-card" key={`${item.orderId}-${item.productId}`}><span className="emoji">{item.imageEmoji}</span><div><strong>{item.name}</strong><small>Pedido {item.orderId.slice(0, 10)} • {item.quantity} unidade(s)</small></div><b>{cents(item.lineTotal)}</b></article>) : <div className="empty-card">Nenhum pedido recebido ainda.</div>}</div></section>
}

function AdminPage({ dashboard, users, sellers, setPage, status }: { dashboard?: AdminDashboardData; users: AdminUser[]; sellers: AdminSeller[]; setPage: (page: Page) => void; status: string }) {
  return <section className="panel-page container"><span className="eyebrow"><LayoutDashboard size={14} /> Admin</span><h1>Painel administrativo</h1><p>{status}</p><div className="kpis"><div><small>Usuarios</small><strong>{dashboard?.usersCount ?? users.length}</strong></div><div><small>Vendedores</small><strong>{dashboard?.sellersCount ?? sellers.length}</strong></div><div><small>Produtos</small><strong>{dashboard?.productsCount ?? 0}</strong></div><div><small>GMV</small><strong>{cents(dashboard?.revenueCents ?? 0)}</strong></div></div><div className="page-actions"><button className="secondary" onClick={() => setPage('adminUsers')}>Usuarios</button><button className="secondary" onClick={() => setPage('adminSellers')}>Sellers</button><button className="secondary" onClick={() => setPage('adminProducts')}>Produtos</button><button className="secondary" onClick={() => setPage('adminOrders')}>Pedidos</button></div></section>
}

function AdminUsersPage({ users }: { users: AdminUser[] }) { return <section className="panel-page container"><span className="eyebrow"><Users size={14} /> Admin</span><h1>Usuarios</h1><div className="panel-list">{users.length ? users.map(u => <article className="panel-card" key={u.id}><UserRound /><div><strong>{u.name || u.email}</strong><small>{u.email} • {u.role}</small></div><b>{u.role}</b></article>) : <div className="empty-card">Sem usuarios carregados ou sem permissao admin.</div>}</div></section> }
function AdminSellersPage({ sellers }: { sellers: AdminSeller[] }) { return <section className="panel-page container"><span className="eyebrow"><Store size={14} /> Admin</span><h1>Sellers</h1><div className="panel-list">{sellers.length ? sellers.map(s => <article className="panel-card" key={s.id}><Store /><div><strong>{s.name}</strong><small>{s.slug} • owner {s.ownerSubject || 'nao vinculado'}</small></div><b>{s.status}</b></article>) : <div className="empty-card">Sem sellers carregados.</div>}</div></section> }
function AdminProductsPage({ products }: { products: Product[] }) { return <section className="panel-page container"><span className="eyebrow"><Boxes size={14} /> Admin</span><h1>Produtos Admin</h1><div className="panel-list">{products.length ? products.map(p => <article className="panel-card" key={p.id}><span className="emoji">{p.imageEmoji}</span><div><strong>{p.name}</strong><small>{p.sellerName} • estoque {p.stock}</small></div><b>{cents(p.priceCents)}</b></article>) : <div className="empty-card">Sem produtos admin carregados.</div>}</div></section> }
function AdminOrdersPage({ orders }: { orders: Order[] }) { return <section className="panel-page container"><span className="eyebrow"><ClipboardList size={14} /> Admin</span><h1>Pedidos Admin</h1><div className="panel-list">{orders.length ? orders.map(o => <article className="panel-card" key={o.orderId}><PackageCheck /><div><strong>Pedido {o.orderId.slice(0, 12)}</strong><small>{o.status} • {o.items.length} itens</small></div><b>{cents(o.totalCents)}</b></article>) : <div className="empty-card">Sem pedidos admin carregados.</div>}</div></section> }

function SupportPage() { return <section className="panel-page container"><span className="eyebrow"><Headphones size={14} /> Suporte</span><h1>Central de atendimento</h1><p>Pagina criada para completar a jornada do cliente.</p><div className="two-cols"><div><h3>Ajuda rapida</h3><div className="mini-row"><strong>Rastrear pedido</strong><small>Em breve</small></div><div className="mini-row"><strong>Trocas e devolucoes</strong><small>7 dias</small></div><div className="mini-row"><strong>Garantia</strong><small>12 meses</small></div></div><div><h3>Canais</h3><div className="mini-row"><strong>WhatsApp</strong><small>online</small></div><div className="mini-row"><strong>Email</strong><small>suporte@nexus.demo</small></div><div className="mini-row"><strong>Chat</strong><small>24/7</small></div></div></div></section> }

function AccountPage({ authStatus, demoUser, demoLogin, demoLogout }: { authStatus: string; demoUser?: DemoUser; demoLogin: (email: string, password: string) => boolean; demoLogout: () => void }) {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0()
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [message, setMessage] = useState('Use o login demo abaixo para entrar agora.')
  const logged = isAuthenticated || !!demoUser
  const displayName = demoUser?.name || user?.name || 'Usuario Nexus'
  const displayEmail = demoUser?.email || user?.email || ''
  function submit(event: FormEvent) { event.preventDefault(); setMessage(demoLogin(email, password) ? 'Login demo realizado com sucesso.' : 'Email ou senha incorretos.') }
  function signOut() { if (demoUser) demoLogout(); else logout({ logoutParams: { returnTo: window.location.origin } }) }
  return <section className="panel-page container"><span className="eyebrow"><UserRound size={14} /> Conta</span><h1>{logged ? 'Minha conta' : 'Entrar'}</h1><p>{logged ? authStatus : message}</p>{logged ? <div className="account-card">{user?.picture && !demoUser ? <img src={user.picture} alt={displayName} /> : <UserRound size={46} />}<div><strong>{displayName}</strong><small>{displayEmail}</small><small>{demoUser ? 'Sessao demo local' : 'Sessao Auth0'}</small></div><button className="secondary" onClick={signOut}>Sair</button></div> : <div className="login-area"><form className="demo-form" onSubmit={submit}><h2>Login demo</h2><label>Email<input value={email} onChange={e => setEmail(e.target.value)} /></label><label>Senha<input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label><button className="primary full">Entrar no demo</button><div className="demo-credentials"><strong>Credenciais:</strong><span>{DEMO_EMAIL}</span><span>{DEMO_PASSWORD}</span></div></form><div className="auth0-box"><h2>Login real</h2><p>Auth0 continua disponivel para producao.</p><button className="secondary full" onClick={() => loginWithRedirect()}>Entrar com Auth0</button><button className="secondary full" onClick={() => loginWithRedirect({ authorizationParams: { connection: 'google-oauth2' } })}>Google</button><button className="secondary full" onClick={() => loginWithRedirect({ authorizationParams: { connection: 'apple' } })}>Apple</button><button className="secondary full" onClick={() => loginWithRedirect({ authorizationParams: { connection: 'windowslive' } })}>Microsoft</button></div></div>}</section>
}

export function App() {
  const [page, setPage] = useState<Page>('home')
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [categories, setCategories] = useState<Category[]>(fallbackCategories)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product>(fallbackProducts[0])
  const [cartOpen, setCartOpen] = useState(false)
  const [localCart, setLocalCart] = useState<LocalCartItem[]>([])
  const [cartStatus, setCartStatus] = useState('Carrinho pronto. Adicione produtos para comprar.')
  const [authStatus, setAuthStatus] = useState('Entre para sincronizar perfil, pedidos e carrinho na API.')
  const [ordersStatus, setOrdersStatus] = useState('Entre para carregar seus pedidos.')
  const [sellerStatus, setSellerStatus] = useState('Area do vendedor separada da home.')
  const [adminStatus, setAdminStatus] = useState('Area administrativa separada da home.')
  const [orders, setOrders] = useState<Order[]>([])
  const [sellerDashboard, setSellerDashboard] = useState<SellerDashboardData | undefined>()
  const [sellerProducts, setSellerProducts] = useState<Product[]>(fallbackProducts.filter(p => p.sellerName === 'Nexus Oficial'))
  const [sellerOrders, setSellerOrders] = useState<Order[]>([])
  const [adminDashboard, setAdminDashboard] = useState<AdminDashboardData | undefined>()
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [adminSellers, setAdminSellers] = useState<AdminSeller[]>([])
  const [adminProducts, setAdminProducts] = useState<Product[]>(fallbackProducts)
  const [adminOrders, setAdminOrders] = useState<Order[]>([])
  const [checkingOut, setCheckingOut] = useState(false)
  const [demoUser, setDemoUser] = useState<DemoUser | undefined>(() => localStorage.getItem('nexus-demo-login') === 'true' ? { name: 'Cliente Demo', email: DEMO_EMAIL, role: 'customer' } : undefined)
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0()

  useEffect(() => { getCategories().then(c => c.length && setCategories(c)).catch(() => null); getProducts().then(p => { if (p.length) { setProducts(p); setAdminProducts(p); setSelectedProduct(p[0]) } }).catch(() => null) }, [])
  useEffect(() => { if (!isAuthenticated || !user) return; (async () => { try { const token = await getAccessTokenSilently(); await syncProfile(token, { email: user.email, name: user.name, pictureUrl: user.picture }); const me = await getMe(token); setAuthStatus(`Perfil sincronizado como ${me.profile?.role || 'customer'}.`); const [apiCart, userOrders] = await Promise.all([getCart(token), getOrders(token)]); setLocalCart(apiCart.items.map(item => ({ id: item.productId, name: item.name, slug: item.slug, description: '', imageEmoji: item.imageEmoji, priceCents: item.priceCents, oldPriceCents: null, stock: 1, rating: item.rating, reviewCount: item.reviewCount, sellerName: item.sellerName, categorySlug: '', quantity: item.quantity }))); setOrders(userOrders); setOrdersStatus(userOrders.length ? 'Pedidos carregados da API.' : 'Nenhum pedido encontrado.'); try { const [sd, sp, so] = await Promise.all([getSellerDashboard(token), getSellerProducts(token), getSellerOrders(token)]); setSellerDashboard(sd); setSellerProducts(sp); setSellerOrders(so); setSellerStatus('Dados reais do vendedor carregados.') } catch { setSellerStatus('Perfil sem permissao de vendedor. Exibindo demonstracao.') } try { const [ad, au, sellers, ap, ao] = await Promise.all([getAdminDashboard(token), getAdminUsers(token), getAdminSellers(token), getAdminProducts(token), getAdminOrders(token)]); setAdminDashboard(ad); setAdminUsers(au); setAdminSellers(sellers); setAdminProducts(ap); setAdminOrders(ao); setAdminStatus('Dados reais do admin carregados.') } catch { setAdminStatus('Perfil sem permissao admin.') } } catch { setAuthStatus('API protegida indisponivel ou Auth0 sem audience correta.') } })() }, [getAccessTokenSilently, isAuthenticated, user])
  useEffect(() => { if (demoUser) { setAuthStatus('Logado como Cliente Demo. Carrinho e pedidos funcionam em modo demonstracao.'); setOrdersStatus('Pedidos demo locais. Finalize uma compra para aparecer aqui.') } }, [demoUser])

  const cartCount = localCart.reduce((sum, item) => sum + item.quantity, 0)
  const featured = useMemo(() => products.slice(0, 6), [products])
  function viewProduct(product: Product) { setSelectedProduct(product); setPage('productDetail') }
  function demoLogin(email: string, password: string) { if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) return false; const next = { name: 'Cliente Demo', email: DEMO_EMAIL, role: 'customer' as const }; setDemoUser(next); localStorage.setItem('nexus-demo-login', 'true'); setAuthStatus('Logado como Cliente Demo. Carrinho, menu e pedidos liberados para teste.'); setPage('home'); return true }
  function demoLogout() { setDemoUser(undefined); localStorage.removeItem('nexus-demo-login'); setAuthStatus('Sessao demo encerrada.') }
  function addToCart(product: Product) { setLocalCart(current => current.some(item => item.id === product.id) ? current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }]); setCartStatus(`${product.name} adicionado ao carrinho.`); setCartOpen(true); if (isAuthenticated) getAccessTokenSilently().then(token => addCartItem(token, product.id, 1).catch(() => null)).catch(() => null) }
  function increase(id: string) { setLocalCart(items => items.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)) }
  function decrease(id: string) { setLocalCart(items => items.flatMap(item => item.id === id ? (item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : []) : [item])) }
  function remove(id: string) { setLocalCart(items => items.filter(item => item.id !== id)) }
  async function checkout() { setCheckingOut(true); try { const total = localCart.reduce((sum, item) => sum + item.priceCents * item.quantity, 0); if (isAuthenticated) { const token = await getAccessTokenSilently(); await createOrder(token); setOrders(await getOrders(token)); setOrdersStatus('Pedido criado com sucesso.'); } else if (demoUser) { const demoOrder: Order = { orderId: `demo-${Date.now()}`, status: 'paid', totalCents: total, createdAt: new Date().toISOString(), items: localCart.map(item => ({ productId: item.id, name: item.name, slug: item.slug, imageEmoji: item.imageEmoji, priceCents: item.priceCents, quantity: item.quantity, lineTotal: item.priceCents * item.quantity, sellerName: item.sellerName, rating: item.rating, reviewCount: item.reviewCount })) }; setOrders(current => [demoOrder, ...current]); setOrdersStatus('Pedido demo criado com sucesso.'); } else { setOrdersStatus('Entre com o demo para salvar um pedido local.'); } setLocalCart([]); setCartStatus('Compra finalizada.'); setPage('orders'); setCartOpen(false) } catch { setCartStatus('Nao foi possivel finalizar na API. Carrinho mantido localmente.') } finally { setCheckingOut(false) } }

  return <><Header page={page} setPage={setPage} cartCount={cartCount} openCart={() => setCartOpen(true)} onSearch={setSearch} demoUser={demoUser} demoLogout={demoLogout} /><main>{page === 'home' && <HomePage categories={categories} products={featured} setPage={setPage} onAdd={addToCart} onView={viewProduct} />}{page === 'products' && <ProductsPage products={products} categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} onAdd={addToCart} onView={viewProduct} search={search} />}{page === 'productDetail' && <ProductDetailPage product={selectedProduct} onAdd={addToCart} setPage={setPage} />}{page === 'cart' && <CartPage items={localCart} increase={increase} decrease={decrease} remove={remove} setPage={setPage} />}{page === 'checkout' && <CheckoutPage items={localCart} checkout={checkout} checkingOut={checkingOut} demoUser={demoUser} />}{page === 'orders' && <OrdersPage orders={orders} status={ordersStatus} />}{page === 'account' && <AccountPage authStatus={authStatus} demoUser={demoUser} demoLogin={demoLogin} demoLogout={demoLogout} />}{page === 'support' && <SupportPage />}{page === 'seller' && <SellerPage dashboard={sellerDashboard} products={sellerProducts} orders={sellerOrders} status={sellerStatus} setPage={setPage} />}{page === 'sellerProducts' && <SellerProductsPage products={sellerProducts} />}{page === 'sellerOrders' && <SellerOrdersPage orders={sellerOrders} />}{page === 'admin' && <AdminPage dashboard={adminDashboard} users={adminUsers} sellers={adminSellers} status={adminStatus} setPage={setPage} />}{page === 'adminUsers' && <AdminUsersPage users={adminUsers} />}{page === 'adminSellers' && <AdminSellersPage sellers={adminSellers} />}{page === 'adminProducts' && <AdminProductsPage products={adminProducts} />}{page === 'adminOrders' && <AdminOrdersPage orders={adminOrders} />}</main><CartDrawer open={cartOpen} close={() => setCartOpen(false)} items={localCart} increase={increase} decrease={decrease} remove={remove} checkout={checkout} checkingOut={checkingOut} status={cartStatus} /></>
}
