import { FormEvent, ReactNode, useMemo, useState } from 'react'
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { Menu, Search, ShoppingCart, UserRound, LogOut, Star, Truck, ShieldCheck, Zap, X, Minus, Plus, PackageCheck, Store, LayoutDashboard, Headphones, CreditCard, Users, Boxes, ClipboardList, Sun, Moon } from 'lucide-react'
import { cents, Product } from './types'
import type { Order } from './api'
import { DEMO_EMAIL, DEMO_PASSWORD, demoCredentials } from './config/demo'
import { categories, productsSeed } from './data/catalog'
import { LocalCartItem, useCart } from './hooks/useCart'
import { useTheme } from './hooks/useTheme'

type DemoUser = typeof demoCredentials

function Layout({ cartCount, openCart, demoUser, logoutDemo, theme, toggleTheme }: { cartCount: number; openCart: () => void; demoUser?: DemoUser; logoutDemo: () => void; theme: string; toggleTheme: () => void }) {
  const [open, setOpen] = useState(false)
  const [term, setTerm] = useState('')
  const navigate = useNavigate()
  const nav = [
    ['/', 'Home'], ['/produtos', 'Catalogo'], ['/carrinho', 'Carrinho'], ['/checkout', 'Checkout'], ['/pedidos', 'Pedidos'], ['/vendedor', 'Vendedor'], ['/admin', 'Admin'], ['/suporte', 'Suporte'], ['/conta', demoUser ? 'Conta' : 'Entrar'],
  ] as const
  function submit(event: FormEvent) { event.preventDefault(); navigate(`/produtos?q=${encodeURIComponent(term)}`); setOpen(false) }
  return <>
    <header className="site-header">
      <div className="topbar"><span>Nexus Commerce • marketplace modular</span><span>Login demo: {DEMO_EMAIL} / {DEMO_PASSWORD}</span></div>
      <div className="header-main container">
        <button className="menu-button" onClick={() => setOpen(true)}><Menu /></button>
        <Link className="brand" to="/"><strong>Nexus</strong><span>Commerce</span></Link>
        <form className="searchbar" onSubmit={submit}><input value={term} onChange={e => setTerm(e.target.value)} placeholder="Buscar notebook, SSD, celular..." /><button><Search size={18} /></button></form>
        <nav className="desktop-nav">{nav.slice(0, 7).map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}</nav>
        <button className="account-pill" onClick={toggleTheme}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}{theme === 'dark' ? 'Claro' : 'Escuro'}</button>
        <Link className="account-pill" to="/conta"><UserRound size={18} />{demoUser ? demoUser.name.split(' ')[0] : 'Entrar'}</Link>
        <button className="cart-button" onClick={openCart}><ShoppingCart size={20} /><b>{cartCount}</b></button>
      </div>
    </header>
    {open ? <aside className="mobile-panel"><div className="mobile-panel-head"><strong>Menu</strong><button onClick={() => setOpen(false)}><X /></button></div>{nav.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)}>{label}</NavLink>)}<button onClick={toggleTheme}>{theme === 'dark' ? 'Tema claro' : 'Tema escuro'}</button>{demoUser ? <button onClick={() => { logoutDemo(); setOpen(false) }}><LogOut size={18} /> Sair</button> : null}</aside> : null}
  </>
}

function ProductCard({ product, add }: { product: Product; add: (p: Product) => void }) {
  return <article className="product-card"><Link className="product-media" to={`/produto/${product.slug}`}><span>{product.imageEmoji}</span>{product.oldPriceCents ? <em>Oferta</em> : null}</Link><div className="product-info"><small>{product.sellerName}</small><h3>{product.name}</h3><p>{product.description}</p><div className="rating"><Star size={14} fill="currentColor" /> {product.rating} <span>({product.reviewCount})</span></div><div className="price-row"><strong>{cents(product.priceCents)}</strong>{product.oldPriceCents ? <del>{cents(product.oldPriceCents)}</del> : null}</div><div className="card-actions"><Link className="secondary full" to={`/produto/${product.slug}`}>Detalhes</Link><button className="primary full" onClick={() => add(product)}>Adicionar</button></div></div></article>
}

function Home({ add }: { add: (p: Product) => void }) {
  return <><section className="hero container"><div className="hero-copy"><span className="eyebrow">Dark marketplace</span><h1>Uma base pronta para evoluir para nota 9.</h1><p>Agora o site tem URLs reais, paginas separadas, tema claro/escuro, login demo, carrinho, checkout, cliente, vendedor e admin.</p><div className="hero-actions"><Link className="primary" to="/produtos">Explorar catalogo</Link><Link className="secondary" to="/checkout">Ver checkout</Link></div></div><div className="hero-card"><span>⚡</span><strong>Commerce OS</strong><small>Loja, seller e admin</small></div></section><section className="benefits container"><div><Truck /><strong>Entrega rapida</strong><small>Fluxo preparado</small></div><div><ShieldCheck /><strong>Compra segura</strong><small>Auth0 + demo</small></div><div><Zap /><strong>Modular</strong><small>React Router ativo</small></div></section><section className="section container"><div className="section-head"><h2>Categorias</h2><Link to="/produtos">Ver tudo</Link></div><div className="category-grid">{categories.map(c => <Link to={`/produtos?cat=${c.slug}`} key={c.slug}><span>{c.icon}</span><strong>{c.name}</strong></Link>)}</div></section><section className="section container"><div className="section-head"><h2>Destaques</h2><Link to="/produtos">Catalogo</Link></div><div className="product-strip">{productsSeed.slice(0, 4).map(p => <ProductCard key={p.id} product={p} add={add} />)}</div></section></>
}

function Catalog({ add }: { add: (p: Product) => void }) {
  const params = new URLSearchParams(location.search)
  const q = (params.get('q') || '').toLowerCase()
  const cat = params.get('cat') || ''
  const filtered = productsSeed.filter(p => (!cat || p.categorySlug === cat) && (!q || p.name.toLowerCase().includes(q)))
  return <section className="catalog container"><aside className="filters"><h2>Catalogo</h2><p>Filtros por categoria e busca.</p><Link className={!cat ? 'active' : ''} to="/produtos">Todos</Link>{categories.map(c => <Link key={c.slug} className={cat === c.slug ? 'active' : ''} to={`/produtos?cat=${c.slug}`}>{c.icon} {c.name}</Link>)}</aside><div className="catalog-main"><div className="section-head"><div><span className="eyebrow">Produtos</span><h1>{q ? `Busca: ${q}` : 'Produtos de tecnologia'}</h1></div><span className="result-count">{filtered.length} itens</span></div><div className="product-grid">{filtered.map(p => <ProductCard key={p.id} product={p} add={add} />)}</div></div></section>
}

function ProductDetail({ add }: { add: (p: Product) => void }) {
  const { slug } = useParams()
  const product = productsSeed.find(p => p.slug === slug) || productsSeed[0]
  return <section className="panel-page container"><Link className="secondary" to="/produtos">Voltar</Link><div className="detail-layout"><div className="detail-media"><span>{product.imageEmoji}</span></div><div className="detail-panel"><span className="eyebrow">{product.sellerName}</span><h1>{product.name}</h1><p>{product.description}</p><div className="rating"><Star size={16} fill="currentColor" /> {product.rating} <span>{product.reviewCount} avaliacoes</span></div><div className="price-row detail-price"><strong>{cents(product.priceCents)}</strong>{product.oldPriceCents ? <del>{cents(product.oldPriceCents)}</del> : null}</div><div className="kpis"><div><small>Estoque</small><strong>{product.stock}</strong></div><div><small>Categoria</small><strong>{product.categorySlug}</strong></div><div><small>Garantia</small><strong>12m</strong></div><div><small>Entrega</small><strong>Turbo</strong></div></div><div className="hero-actions"><button className="primary" onClick={() => add(product)}>Adicionar</button><Link className="secondary" to="/checkout">Comprar agora</Link></div></div></div></section>
}

function CartList({ items, inc, dec, remove }: { items: LocalCartItem[]; inc: (id: string) => void; dec: (id: string) => void; remove: (id: string) => void }) {
  return <div className="cart-items">{items.length ? items.map(item => <div className="cart-item" key={item.id}><span>{item.imageEmoji}</span><div><strong>{item.name}</strong><small>{cents(item.priceCents)}</small><div className="qty"><button onClick={() => dec(item.id)}><Minus size={14} /></button><b>{item.quantity}</b><button onClick={() => inc(item.id)}><Plus size={14} /></button><button className="remove" onClick={() => remove(item.id)}>remover</button></div></div></div>) : <div className="empty"><ShoppingCart /><strong>Carrinho vazio</strong><small>Adicione produtos do catalogo.</small></div>}</div>
}

function CartPage({ items, inc, dec, remove }: { items: LocalCartItem[]; inc: (id: string) => void; dec: (id: string) => void; remove: (id: string) => void }) {
  const total = items.reduce((s, i) => s + i.priceCents * i.quantity, 0)
  return <section className="panel-page container"><span className="eyebrow"><ShoppingCart size={14} /> Loja</span><h1>Carrinho</h1><div className="checkout-grid"><CartList items={items} inc={inc} dec={dec} remove={remove} /><aside className="checkout-summary"><h2>Resumo</h2><div className="total"><span>Total</span><strong>{cents(total)}</strong></div><Link className="primary full" to="/checkout">Ir para checkout</Link></aside></div></section>
}

function Checkout({ items, confirm, demoUser }: { items: LocalCartItem[]; confirm: () => void; demoUser?: DemoUser }) {
  const total = items.reduce((s, i) => s + i.priceCents * i.quantity, 0)
  return <section className="panel-page container"><span className="eyebrow"><CreditCard size={14} /> Checkout</span><h1>Finalizar compra</h1><div className="checkout-grid"><div className="checkout-steps"><article><strong>1. Identificacao</strong><small>{demoUser ? demoUser.email : 'Use o login demo em Conta.'}</small></article><article><strong>2. Entrega</strong><small>Entrega turbo simulada.</small></article><article><strong>3. Pagamento</strong><small>Pix/cartao prontos para integracao.</small></article></div><aside className="checkout-summary"><h2>Resumo</h2>{items.map(i => <div className="mini-row" key={i.id}><strong>{i.quantity}x {i.name}</strong><small>{cents(i.priceCents * i.quantity)}</small></div>)}<div className="total"><span>Total</span><strong>{cents(total)}</strong></div><button className="primary full" disabled={!items.length} onClick={confirm}>Confirmar pedido</button></aside></div></section>
}

function Account({ demoUser, login, logout }: { demoUser?: DemoUser; login: (e: string, p: string) => boolean; logout: () => void }) {
  const [email, setEmail] = useState(DEMO_EMAIL); const [password, setPassword] = useState(DEMO_PASSWORD); const [msg, setMsg] = useState('Use o login demo para testar agora.')
  function submit(e: FormEvent) { e.preventDefault(); setMsg(login(email, password) ? 'Login realizado.' : 'Credenciais invalidas.') }
  return <section className="panel-page container"><span className="eyebrow"><UserRound size={14} /> Conta</span><h1>{demoUser ? 'Minha conta' : 'Entrar'}</h1><p>{msg}</p>{demoUser ? <div className="account-card"><UserRound size={46} /><div><strong>{demoUser.name}</strong><small>{demoUser.email}</small><small>{demoUser.role}</small></div><button className="secondary" onClick={logout}>Sair</button></div> : <div className="login-area"><form className="demo-form" onSubmit={submit}><h2>Login demo</h2><label>Email<input value={email} onChange={e => setEmail(e.target.value)} /></label><label>Senha<input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label><button className="primary full">Entrar</button><div className="demo-credentials"><strong>Credenciais</strong><span>{DEMO_EMAIL}</span><span>{DEMO_PASSWORD}</span></div></form><div className="auth0-box"><h2>Login real</h2><p>Auth0 segue preparado para producao quando as variaveis forem configuradas.</p></div></div>}</section>
}

function Orders({ orders }: { orders: Order[] }) { return <section className="panel-page container"><span className="eyebrow"><PackageCheck size={14} /> Cliente</span><h1>Meus pedidos</h1><div className="panel-list">{orders.length ? orders.map(o => <article className="panel-card" key={o.orderId}><PackageCheck /><div><strong>Pedido {o.orderId.slice(0, 12)}</strong><small>{o.status} • {new Date(o.createdAt).toLocaleString('pt-BR')}</small></div><b>{cents(o.totalCents)}</b></article>) : <div className="empty-card">Nenhum pedido ainda.</div>}</div></section> }
function Support() { return <section className="panel-page container"><span className="eyebrow"><Headphones size={14} /> Suporte</span><h1>Central de atendimento</h1><div className="two-cols"><div><h3>Ajuda rapida</h3><div className="mini-row"><strong>Rastrear pedido</strong><small>em breve</small></div><div className="mini-row"><strong>Trocas</strong><small>7 dias</small></div></div><div><h3>Canais</h3><div className="mini-row"><strong>WhatsApp</strong><small>online</small></div><div className="mini-row"><strong>Email</strong><small>suporte@nexus.demo</small></div></div></div></section> }
function Seller() { return <Panel title="Dashboard do vendedor" icon={<Store size={14} />} kpis={[["Produtos", "24"], ["Estoque", "1.284"], ["Vendidos", "392"], ["Receita", "R$ 128k"]]} links={[["/vendedor/produtos","Produtos"],["/vendedor/pedidos","Pedidos recebidos"]]} /> }
function SellerProducts() { return <ListPage title="Produtos do vendedor" icon={<Boxes size={14} />} items={productsSeed.map(p => [p.imageEmoji, p.name, `Estoque ${p.stock} • ${cents(p.priceCents)}`, p.sellerName])} /> }
function SellerOrders() { return <ListPage title="Pedidos recebidos" icon={<ClipboardList size={14} />} items={productsSeed.slice(0,3).map((p,i) => [p.imageEmoji, `Pedido SELL-${1000+i}`, p.name, cents(p.priceCents)])} /> }
function Admin() { return <Panel title="Painel administrativo" icon={<LayoutDashboard size={14} />} kpis={[["Usuarios","128"],["Sellers","12"],["Produtos","640"],["GMV","R$ 2.4M"]]} links={[["/admin/usuarios","Usuarios"],["/admin/sellers","Sellers"],["/admin/produtos","Produtos"],["/admin/pedidos","Pedidos"]]} /> }
function AdminUsers() { return <ListPage title="Usuarios" icon={<Users size={14} />} items={[["👤","Cliente Demo",DEMO_EMAIL,"customer"],["👤","Admin Nexus","admin@nexus.demo","admin"]]} /> }
function AdminSellers() { return <ListPage title="Sellers" icon={<Store size={14} />} items={[["🏪","Nexus Oficial","ativo","owner demo"],["🏪","Microsoft Store","ativo","partner"]]} /> }
function AdminProducts() { return <ListPage title="Produtos Admin" icon={<Boxes size={14} />} items={productsSeed.map(p => [p.imageEmoji, p.name, p.sellerName, cents(p.priceCents)])} /> }
function AdminOrders() { return <ListPage title="Pedidos Admin" icon={<ClipboardList size={14} />} items={productsSeed.slice(0,4).map((p,i) => ["📦",`Pedido ADM-${9000+i}`,p.name,cents(p.priceCents)])} /> }
function Panel({ title, icon, kpis, links }: { title: string; icon: ReactNode; kpis: string[][]; links: string[][] }) { return <section className="panel-page container"><span className="eyebrow">{icon} Operacao</span><h1>{title}</h1><div className="kpis">{kpis.map(([a,b]) => <div key={a}><small>{a}</small><strong>{b}</strong></div>)}</div><div className="page-actions">{links.map(([to,label]) => <Link className="secondary" key={to} to={to}>{label}</Link>)}</div></section> }
function ListPage({ title, icon, items }: { title: string; icon: ReactNode; items: string[][] }) { return <section className="panel-page container"><span className="eyebrow">{icon} Lista</span><h1>{title}</h1><div className="panel-list">{items.map(([emoji,a,b,c]) => <article className="panel-card" key={a}><span className="emoji">{emoji}</span><div><strong>{a}</strong><small>{b}</small></div><b>{c}</b></article>)}</div></section> }

function CartDrawer({ open, close, items, inc, dec, remove, confirm }: { open: boolean; close: () => void; items: LocalCartItem[]; inc: (id: string) => void; dec: (id: string) => void; remove: (id: string) => void; confirm: () => void }) {
  const total = items.reduce((s, i) => s + i.priceCents * i.quantity, 0)
  return <div className={`cart-layer ${open ? 'show' : ''}`}><button className="cart-backdrop" onClick={close} /><aside className="cart-drawer"><div className="drawer-head"><div><strong>Carrinho</strong><small>{items.length} produto(s)</small></div><button onClick={close}><X /></button></div><CartList items={items} inc={inc} dec={dec} remove={remove} /><div className="drawer-footer"><div className="total"><span>Total</span><strong>{cents(total)}</strong></div><button className="primary full" disabled={!items.length} onClick={confirm}>Finalizar</button></div></aside></div>
}

export function App() {
  const [demoUser, setDemoUser] = useState<DemoUser | undefined>(() => localStorage.getItem('nexus-demo-login') === 'true' ? demoCredentials : undefined)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const cart = useCart()
  const confirm = () => { const order = cart.confirmOrder(); if (order) navigate('/pedidos') }
  const login = (email: string, password: string) => { if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) return false; setDemoUser(demoCredentials); localStorage.setItem('nexus-demo-login','true'); return true }
  const logout = () => { setDemoUser(undefined); localStorage.removeItem('nexus-demo-login') }
  const routes = useMemo(() => <Routes><Route path="/" element={<Home add={cart.addToCart} />} /><Route path="/produtos" element={<Catalog add={cart.addToCart} />} /><Route path="/produto/:slug" element={<ProductDetail add={cart.addToCart} />} /><Route path="/carrinho" element={<CartPage items={cart.cart} inc={cart.increaseQuantity} dec={cart.decreaseQuantity} remove={cart.removeFromCart} />} /><Route path="/checkout" element={<Checkout items={cart.cart} confirm={confirm} demoUser={demoUser} />} /><Route path="/pedidos" element={<Orders orders={cart.orders} />} /><Route path="/conta" element={<Account demoUser={demoUser} login={login} logout={logout} />} /><Route path="/suporte" element={<Support />} /><Route path="/vendedor" element={<Seller />} /><Route path="/vendedor/produtos" element={<SellerProducts />} /><Route path="/vendedor/pedidos" element={<SellerOrders />} /><Route path="/admin" element={<Admin />} /><Route path="/admin/usuarios" element={<AdminUsers />} /><Route path="/admin/sellers" element={<AdminSellers />} /><Route path="/admin/produtos" element={<AdminProducts />} /><Route path="/admin/pedidos" element={<AdminOrders />} /><Route path="*" element={<section className="panel-page container"><h1>Pagina nao encontrada</h1><Link className="primary" to="/">Voltar para Home</Link></section>} /></Routes>, [cart, demoUser])
  return <><Layout cartCount={cart.cartCount} openCart={() => cart.setCartOpen(true)} demoUser={demoUser} logoutDemo={logout} theme={theme} toggleTheme={toggleTheme} /><main>{routes}</main><CartDrawer open={cart.cartOpen} close={() => cart.setCartOpen(false)} items={cart.cart} inc={cart.increaseQuantity} dec={cart.decreaseQuantity} remove={cart.removeFromCart} confirm={confirm} /></>
}
