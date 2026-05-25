import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Menu, Search, ShoppingCart, UserRound, LogOut, Star, Truck, ShieldCheck, Zap, X, Minus, Plus, PackageCheck, Store, LayoutDashboard } from 'lucide-react'
import { cents, Product, Category } from './types'
import { getCategories, getProducts, getMe, syncProfile, getCart, addCartItem, createOrder, getOrders, getSellerDashboard, getSellerProducts, getSellerOrders, getAdminDashboard, getAdminUsers, getAdminSellers, getAdminProducts, getAdminOrders, Cart, Order, SellerDashboard as SellerDashboardData, AdminDashboard as AdminDashboardData, AdminUser, AdminSeller } from './api'

type Page = 'home' | 'products' | 'orders' | 'seller' | 'admin' | 'account'
type LocalCartItem = Product & { quantity: number }
type DemoUser = { name: string; email: string; role: 'customer' | 'seller' | 'admin' }

const DEMO_EMAIL = 'demo@nexuscommerce.com'
const DEMO_PASSWORD = 'demo123'

const fallbackProducts: Product[] = [
  { id: '1', name: 'Notebook Gamer Pro 16', slug: 'notebook-gamer-pro-16', description: 'GPU dedicada, 16GB RAM, SSD NVMe e tela de alta taxa.', imageEmoji: '💻', priceCents: 699900, oldPriceCents: 849900, stock: 18, rating: 4.8, reviewCount: 256, sellerName: 'Nexus Oficial', categorySlug: 'notebooks' },
  { id: '2', name: 'Smartphone Ultra 5G 256GB', slug: 'smartphone-ultra-5g', description: 'Tela OLED, camera avancada e carregamento rapido.', imageEmoji: '📱', priceCents: 429900, oldPriceCents: 499900, stock: 42, rating: 4.7, reviewCount: 412, sellerName: 'Mobile Prime', categorySlug: 'smartphones' },
  { id: '3', name: 'SSD Kingston NV2 1TB NVMe M.2', slug: 'ssd-kingston-nv2-1tb', description: 'Upgrade rapido para notebooks, PCs e workstations.', imageEmoji: '💾', priceCents: 28990, oldPriceCents: 38990, stock: 120, rating: 4.7, reviewCount: 842, sellerName: 'Nexus Oficial', categorySlug: 'componentes' },
  { id: '4', name: 'Mouse Gamer Logitech G502 HERO', slug: 'mouse-logitech-g502-hero', description: 'Sensor 25K, RGB e botoes programaveis.', imageEmoji: '🖱️', priceCents: 33990, oldPriceCents: 39990, stock: 80, rating: 4.6, reviewCount: 621, sellerName: 'Logitech Store', categorySlug: 'perifericos' },
  { id: '5', name: 'Xbox Series S 512GB SSD', slug: 'console-xbox-series-s-512gb', description: 'Console compacto com SSD e Game Pass.', imageEmoji: '🎮', priceCents: 219900, oldPriceCents: null, stock: 33, rating: 4.8, reviewCount: 1102, sellerName: 'Microsoft Store', categorySlug: 'games' },
  { id: '6', name: 'Monitor Gamer 27 QHD 165Hz', slug: 'monitor-gamer-27-qhd', description: 'Painel QHD, baixa latencia e base ajustavel.', imageEmoji: '🖥️', priceCents: 189900, oldPriceCents: 239900, stock: 21, rating: 4.9, reviewCount: 178, sellerName: 'Display Tech', categorySlug: 'perifericos' },
]

const fallbackCategories: Category[] = [
  { id: 'notebooks', name: 'Notebooks', slug: 'notebooks', icon: '💻' },
  { id: 'smartphones', name: 'Smartphones', slug: 'smartphones', icon: '📱' },
  { id: 'componentes', name: 'Componentes', slug: 'componentes', icon: '🧩' },
  { id: 'perifericos', name: 'Perifericos', slug: 'perifericos', icon: '⌨️' },
  { id: 'games', name: 'Games', slug: 'games', icon: '🎮' },
]

function Header({ page, setPage, cartCount, openCart, onSearch, demoUser, demoLogout }: { page: Page; setPage: (page: Page) => void; cartCount: number; openCart: () => void; onSearch: (term: string) => void; demoUser?: DemoUser; demoLogout: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [term, setTerm] = useState('')
  const { isAuthenticated, user, logout } = useAuth0()
  const logged = isAuthenticated || !!demoUser
  const accountName = demoUser?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Conta'
  const nav: { label: string; page: Page }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Produtos', page: 'products' },
    { label: 'Meus pedidos', page: 'orders' },
    { label: 'Vendedor', page: 'seller' },
    { label: 'Admin', page: 'admin' },
  ]

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
      <div className="topbar"><span>Frete gratis em tecnologia selecionada</span><span>Login demo disponivel • Compra protegida</span></div>
      <div className="header-main container">
        <button className="menu-button" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Menu size={22} /></button>
        <button className="brand" onClick={() => go('home')}><strong>Nexus</strong><span>Commerce</span></button>
        <form className="searchbar" onSubmit={submit}>
          <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Buscar notebook, SSD, celular..." />
          <button aria-label="Buscar"><Search size={18} /></button>
        </form>
        <nav className="desktop-nav">{nav.map(item => <button key={item.page} className={page === item.page ? 'active' : ''} onClick={() => go(item.page)}>{item.label}</button>)}</nav>
        <button className="account-pill" onClick={() => go('account')}><UserRound size={18} />{logged ? accountName : 'Entrar'}</button>
        <button className="cart-button" onClick={openCart}><ShoppingCart size={20} /><b>{cartCount}</b></button>
      </div>
      {mobileOpen ? <div className="mobile-panel"><div className="mobile-panel-head"><strong>Menu</strong><button onClick={() => setMobileOpen(false)}><X /></button></div>{nav.map(item => <button key={item.page} className={page === item.page ? 'active' : ''} onClick={() => go(item.page)}>{item.label}</button>)}<button onClick={() => go('account')}><UserRound size={18} /> {logged ? accountName : 'Entrar'}</button>{logged ? <button onClick={signOut}><LogOut size={18} /> Sair</button> : null}</div> : null}
    </header>
  )
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (product: Product) => void }) {
  return (
    <article className="product-card">
      <div className="product-media"><span>{product.imageEmoji}</span>{product.oldPriceCents ? <em>Oferta</em> : null}</div>
      <div className="product-info">
        <small>{product.sellerName}</small>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="rating"><Star size={14} fill="currentColor" /> {product.rating} <span>({product.reviewCount})</span></div>
        <div className="price-row"><strong>{cents(product.priceCents)}</strong>{product.oldPriceCents ? <del>{cents(product.oldPriceCents)}</del> : null}</div>
        <button className="primary full" onClick={() => onAdd(product)}>Adicionar ao carrinho</button>
      </div>
    </article>
  )
}

function HomePage({ categories, products, setPage, onAdd }: { categories: Category[]; products: Product[]; setPage: (page: Page) => void; onAdd: (product: Product) => void }) {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy"><span className="eyebrow">Marketplace de tecnologia</span><h1>Compre tecnologia com cara de loja grande.</h1><p>Menu claro, paginas separadas, carrinho funcional e login demo para testar agora.</p><div className="hero-actions"><button className="primary" onClick={() => setPage('products')}>Ver produtos</button><button className="secondary" onClick={() => setPage('account')}>Entrar com demo</button></div></div>
        <div className="hero-card"><span>💻</span><strong>Setup Pro</strong><small>Ofertas em notebooks, games, SSDs e perifericos</small></div>
      </section>
      <section className="benefits container"><div><Truck /><strong>Entrega rapida</strong><small>Produtos selecionados</small></div><div><ShieldCheck /><strong>Login demo</strong><small>Teste sem Auth0</small></div><div><Zap /><strong>Carrinho funcional</strong><small>Sem depender de login</small></div></section>
      <section className="section container"><div className="section-head"><h2>Categorias</h2><button onClick={() => setPage('products')}>Ver tudo</button></div><div className="category-grid">{categories.map(c => <button key={c.slug} onClick={() => setPage('products')}><span>{c.icon}</span><strong>{c.name}</strong></button>)}</div></section>
      <section className="section container"><div className="section-head"><h2>Mais vendidos</h2><button onClick={() => setPage('products')}>Ir para produtos</button></div><div className="product-strip">{products.slice(0, 4).map(product => <ProductCard key={product.id} product={product} onAdd={onAdd} />)}</div></section>
    </>
  )
}

function ProductsPage({ products, categories, selectedCategory, setSelectedCategory, onAdd, search }: { products: Product[]; categories: Category[]; selectedCategory: string; setSelectedCategory: (slug: string) => void; onAdd: (product: Product) => void; search: string }) {
  const filtered = products.filter(product => (!selectedCategory || product.categorySlug === selectedCategory) && (!search || product.name.toLowerCase().includes(search.toLowerCase())))
  return (
    <section className="catalog container">
      <aside className="filters"><h2>Produtos</h2><p>Escolha uma categoria e adicione ao carrinho sem sair da pagina.</p><button className={!selectedCategory ? 'active' : ''} onClick={() => setSelectedCategory('')}>Todos</button>{categories.map(c => <button key={c.slug} className={selectedCategory === c.slug ? 'active' : ''} onClick={() => setSelectedCategory(c.slug)}>{c.icon} {c.name}</button>)}</aside>
      <div className="catalog-main"><div className="section-head"><div><span className="eyebrow">Catalogo</span><h1>{search ? `Busca por “${search}”` : 'Produtos de tecnologia'}</h1></div><span className="result-count">{filtered.length} itens</span></div><div className="product-grid">{filtered.map(product => <ProductCard key={product.id} product={product} onAdd={onAdd} />)}</div></div>
    </section>
  )
}

function CartDrawer({ open, close, items, increase, decrease, remove, checkout, checkingOut, status }: { open: boolean; close: () => void; items: LocalCartItem[]; increase: (id: string) => void; decrease: (id: string) => void; remove: (id: string) => void; checkout: () => void; checkingOut: boolean; status: string }) {
  const total = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)
  return <div className={`cart-layer ${open ? 'show' : ''}`}><button className="cart-backdrop" onClick={close} aria-label="Fechar carrinho" /><aside className="cart-drawer"><div className="drawer-head"><div><strong>Carrinho</strong><small>{items.length} produto(s)</small></div><button onClick={close}><X /></button></div><div className="cart-items">{items.length ? items.map(item => <div className="cart-item" key={item.id}><span>{item.imageEmoji}</span><div><strong>{item.name}</strong><small>{cents(item.priceCents)}</small><div className="qty"><button onClick={() => decrease(item.id)}><Minus size={14} /></button><b>{item.quantity}</b><button onClick={() => increase(item.id)}><Plus size={14} /></button><button className="remove" onClick={() => remove(item.id)}>remover</button></div></div></div>) : <div className="empty"><ShoppingCart /><strong>Seu carrinho esta vazio</strong><small>Adicione produtos do catalogo.</small></div>}</div><div className="drawer-footer"><p>{status}</p><div className="total"><span>Total</span><strong>{cents(total)}</strong></div><button className="primary full" disabled={!items.length || checkingOut} onClick={checkout}>{checkingOut ? 'Finalizando...' : 'Finalizar compra'}</button></div></aside></div>
}

function OrdersPage({ orders, status }: { orders: Order[]; status: string }) {
  return <section className="panel-page container"><span className="eyebrow">Cliente</span><h1>Meus pedidos</h1><p>{status}</p><div className="panel-list">{orders.length ? orders.map(order => <article key={order.orderId} className="panel-card"><PackageCheck /><div><strong>Pedido {order.orderId.slice(0, 8)}</strong><small>{new Date(order.createdAt).toLocaleString('pt-BR')} • {order.status}</small></div><b>{cents(order.totalCents)}</b></article>) : <div className="empty-card">Nenhum pedido encontrado.</div>}</div></section>
}

function SellerPage({ dashboard, products, orders, status }: { dashboard?: SellerDashboardData; products: Product[]; orders: Order[]; status: string }) {
  const sold = orders.flatMap(o => o.items)
  return <section className="panel-page container"><span className="eyebrow"><Store size={14} /> Vendedor</span><h1>Dashboard do vendedor</h1><p>{status}</p><div className="kpis"><div><small>Produtos</small><strong>{dashboard?.productsActive ?? products.length}</strong></div><div><small>Estoque</small><strong>{dashboard?.stockTotal ?? products.reduce((t, p) => t + p.stock, 0)}</strong></div><div><small>Vendidos</small><strong>{dashboard?.itemsSold ?? sold.reduce((t, i) => t + i.quantity, 0)}</strong></div><div><small>Receita</small><strong>{cents(dashboard?.revenueCents ?? sold.reduce((t, i) => t + i.lineTotal, 0))}</strong></div></div><div className="panel-list">{products.map(p => <article className="panel-card" key={p.id}><span className="emoji">{p.imageEmoji}</span><div><strong>{p.name}</strong><small>Estoque {p.stock} • {cents(p.priceCents)}</small></div></article>)}</div></section>
}

function AdminPage({ dashboard, users, sellers, status }: { dashboard?: AdminDashboardData; users: AdminUser[]; sellers: AdminSeller[]; status: string }) {
  return <section className="panel-page container"><span className="eyebrow"><LayoutDashboard size={14} /> Admin</span><h1>Painel administrativo</h1><p>{status}</p><div className="kpis"><div><small>Usuarios</small><strong>{dashboard?.usersCount ?? users.length}</strong></div><div><small>Vendedores</small><strong>{dashboard?.sellersCount ?? sellers.length}</strong></div><div><small>Produtos</small><strong>{dashboard?.productsCount ?? 0}</strong></div><div><small>GMV</small><strong>{cents(dashboard?.revenueCents ?? 0)}</strong></div></div><div className="two-cols"><div><h3>Usuarios</h3>{users.slice(0, 6).map(u => <div className="mini-row" key={u.id}><strong>{u.name || u.email}</strong><small>{u.role}</small></div>)}</div><div><h3>Vendedores</h3>{sellers.slice(0, 6).map(s => <div className="mini-row" key={s.id}><strong>{s.name}</strong><small>{s.status}</small></div>)}</div></div></section>
}

function AccountPage({ authStatus, demoUser, demoLogin, demoLogout }: { authStatus: string; demoUser?: DemoUser; demoLogin: (email: string, password: string) => boolean; demoLogout: () => void }) {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0()
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [message, setMessage] = useState('Use o login demo abaixo para entrar agora.')
  const logged = isAuthenticated || !!demoUser
  const displayName = demoUser?.name || user?.name || 'Usuario Nexus'
  const displayEmail = demoUser?.email || user?.email || ''

  function submit(event: FormEvent) {
    event.preventDefault()
    const ok = demoLogin(email, password)
    setMessage(ok ? 'Login demo realizado com sucesso.' : 'Email ou senha incorretos.')
  }

  function signOut() {
    if (demoUser) demoLogout()
    else logout({ logoutParams: { returnTo: window.location.origin } })
  }

  return <section className="panel-page container"><span className="eyebrow">Conta</span><h1>{logged ? 'Minha conta' : 'Entrar'}</h1><p>{logged ? authStatus : message}</p>{logged ? <div className="account-card">{user?.picture && !demoUser ? <img src={user.picture} alt={displayName} /> : <UserRound size={46} />}<div><strong>{displayName}</strong><small>{displayEmail}</small><small>{demoUser ? 'Sessao demo local' : 'Sessao Auth0'}</small></div><button className="secondary" onClick={signOut}>Sair</button></div> : <div className="login-area"><form className="demo-form" onSubmit={submit}><h2>Login demo</h2><label>Email<input value={email} onChange={e => setEmail(e.target.value)} /></label><label>Senha<input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label><button className="primary full">Entrar no demo</button><div className="demo-credentials"><strong>Credenciais:</strong><span>{DEMO_EMAIL}</span><span>{DEMO_PASSWORD}</span></div></form><div className="auth0-box"><h2>Login real</h2><p>Use Auth0 quando as variaveis e provedores estiverem configurados.</p><button className="secondary full" onClick={() => loginWithRedirect()}>Entrar com Auth0</button><button className="secondary full" onClick={() => loginWithRedirect({ authorizationParams: { connection: 'google-oauth2' } })}>Google</button><button className="secondary full" onClick={() => loginWithRedirect({ authorizationParams: { connection: 'apple' } })}>Apple</button><button className="secondary full" onClick={() => loginWithRedirect({ authorizationParams: { connection: 'windowslive' } })}>Microsoft</button></div></div>}</section>
}

export function App() {
  const [page, setPage] = useState<Page>('home')
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [categories, setCategories] = useState<Category[]>(fallbackCategories)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
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
  const [checkingOut, setCheckingOut] = useState(false)
  const [demoUser, setDemoUser] = useState<DemoUser | undefined>(() => localStorage.getItem('nexus-demo-login') === 'true' ? { name: 'Cliente Demo', email: DEMO_EMAIL, role: 'customer' } : undefined)
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0()

  useEffect(() => { getCategories().then(c => c.length && setCategories(c)).catch(() => null); getProducts().then(p => p.length && setProducts(p)).catch(() => null) }, [])
  useEffect(() => { if (!isAuthenticated || !user) return; (async () => { try { const token = await getAccessTokenSilently(); await syncProfile(token, { email: user.email, name: user.name, pictureUrl: user.picture }); const me = await getMe(token); setAuthStatus(`Perfil sincronizado como ${me.profile?.role || 'customer'}.`); const [apiCart, userOrders] = await Promise.all([getCart(token), getOrders(token)]); setLocalCart(apiCart.items.map(item => ({ id: item.productId, name: item.name, slug: item.slug, description: '', imageEmoji: item.imageEmoji, priceCents: item.priceCents, oldPriceCents: null, stock: 1, rating: item.rating, reviewCount: item.reviewCount, sellerName: item.sellerName, categorySlug: '', quantity: item.quantity }))); setOrders(userOrders); setOrdersStatus(userOrders.length ? 'Pedidos carregados da API.' : 'Nenhum pedido encontrado.'); try { const [sd, sp, so] = await Promise.all([getSellerDashboard(token), getSellerProducts(token), getSellerOrders(token)]); setSellerDashboard(sd); setSellerProducts(sp); setSellerOrders(so); setSellerStatus('Dados reais do vendedor carregados.') } catch { setSellerStatus('Perfil sem permissao de vendedor. Exibindo demonstracao.') } try { const [ad, au, as] = await Promise.all([getAdminDashboard(token), getAdminUsers(token), getAdminSellers(token)]); await Promise.all([getAdminProducts(token), getAdminOrders(token)]); setAdminDashboard(ad); setAdminUsers(au); setAdminSellers(as); setAdminStatus('Dados reais do admin carregados.') } catch { setAdminStatus('Perfil sem permissao admin.') } } catch { setAuthStatus('API protegida indisponivel ou Auth0 sem audience correta.') } })() }, [getAccessTokenSilently, isAuthenticated, user])
  useEffect(() => { if (demoUser) { setAuthStatus('Logado como Cliente Demo. Carrinho e pedidos funcionam em modo demonstracao.'); setOrdersStatus('Pedidos demo locais. Finalize uma compra para aparecer aqui.') } }, [demoUser])

  const cartCount = localCart.reduce((sum, item) => sum + item.quantity, 0)
  const featured = useMemo(() => products.slice(0, 6), [products])

  function demoLogin(email: string, password: string) {
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) return false
    const next = { name: 'Cliente Demo', email: DEMO_EMAIL, role: 'customer' as const }
    setDemoUser(next)
    localStorage.setItem('nexus-demo-login', 'true')
    setAuthStatus('Logado como Cliente Demo. Carrinho, menu e pedidos liberados para teste.')
    setPage('home')
    return true
  }

  function demoLogout() {
    setDemoUser(undefined)
    localStorage.removeItem('nexus-demo-login')
    setAuthStatus('Sessao demo encerrada.')
  }

  function addToCart(product: Product) {
    setLocalCart(current => current.some(item => item.id === product.id) ? current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }])
    setCartStatus(`${product.name} adicionado ao carrinho.`)
    setCartOpen(true)
    if (isAuthenticated) getAccessTokenSilently().then(token => addCartItem(token, product.id, 1).catch(() => null)).catch(() => null)
  }

  function increase(id: string) { setLocalCart(items => items.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)) }
  function decrease(id: string) { setLocalCart(items => items.flatMap(item => item.id === id ? (item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : []) : [item])) }
  function remove(id: string) { setLocalCart(items => items.filter(item => item.id !== id)) }
  async function checkout() { setCheckingOut(true); try { const total = localCart.reduce((sum, item) => sum + item.priceCents * item.quantity, 0); if (isAuthenticated) { const token = await getAccessTokenSilently(); await createOrder(token); setOrders(await getOrders(token)); setOrdersStatus('Pedido criado com sucesso.'); } else if (demoUser) { const demoOrder: Order = { orderId: `demo-${Date.now()}`, status: 'paid', totalCents: total, createdAt: new Date().toISOString(), items: localCart.map(item => ({ productId: item.id, name: item.name, slug: item.slug, imageEmoji: item.imageEmoji, priceCents: item.priceCents, quantity: item.quantity, lineTotal: item.priceCents * item.quantity, sellerName: item.sellerName, rating: item.rating, reviewCount: item.reviewCount })) }; setOrders(current => [demoOrder, ...current]); setOrdersStatus('Pedido demo criado com sucesso.'); } else { setOrdersStatus('Entre com o demo para salvar um pedido local.'); } setLocalCart([]); setCartStatus('Compra finalizada.'); setPage('orders'); setCartOpen(false) } catch { setCartStatus('Nao foi possivel finalizar na API. Carrinho mantido localmente.') } finally { setCheckingOut(false) } }

  return <><Header page={page} setPage={setPage} cartCount={cartCount} openCart={() => setCartOpen(true)} onSearch={setSearch} demoUser={demoUser} demoLogout={demoLogout} /><main>{page === 'home' && <HomePage categories={categories} products={featured} setPage={setPage} onAdd={addToCart} />}{page === 'products' && <ProductsPage products={products} categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} onAdd={addToCart} search={search} />}{page === 'orders' && <OrdersPage orders={orders} status={ordersStatus} />}{page === 'seller' && <SellerPage dashboard={sellerDashboard} products={sellerProducts} orders={sellerOrders} status={sellerStatus} />}{page === 'admin' && <AdminPage dashboard={adminDashboard} users={adminUsers} sellers={adminSellers} status={adminStatus} />}{page === 'account' && <AccountPage authStatus={authStatus} demoUser={demoUser} demoLogin={demoLogin} demoLogout={demoLogout} />}</main><CartDrawer open={cartOpen} close={() => setCartOpen(false)} items={localCart} increase={increase} decrease={decrease} remove={remove} checkout={checkout} checkingOut={checkingOut} status={cartStatus} /></>
}
