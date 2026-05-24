import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Search, ShoppingCart, Heart, UserRound, Star, Truck, ShieldCheck, Zap, Loader2 } from 'lucide-react'
import { cents, Product, Category } from './types'
import { getCategories, getProducts } from './api'

const fallbackProducts: Product[] = [
  { id: '1', name: 'Notebook Gamer Pro 16', slug: 'notebook-gamer-pro-16', description: 'Notebook gamer com GPU dedicada, tela rapida, 16GB RAM e SSD.', imageEmoji: '💻', priceCents: 699900, oldPriceCents: 849900, stock: 18, rating: 4.8, reviewCount: 256, sellerName: 'Nexus Oficial', categorySlug: 'notebooks' },
  { id: '2', name: 'Notebook Nitro Performance', slug: 'notebook-nitro-performance', description: 'Notebook para jogos e produtividade com SSD NVMe e tela IPS.', imageEmoji: '💻', priceCents: 439900, oldPriceCents: 499900, stock: 24, rating: 4.7, reviewCount: 198, sellerName: 'Acer Oficial', categorySlug: 'notebooks' },
  { id: '3', name: 'SSD Kingston NV2 1TB NVMe M.2', slug: 'ssd-kingston-nv2-1tb', description: 'SSD NVMe para upgrade de performance em notebooks e desktops.', imageEmoji: '💾', priceCents: 28990, oldPriceCents: 38990, stock: 120, rating: 4.7, reviewCount: 842, sellerName: 'Nexus Oficial', categorySlug: 'componentes' },
  { id: '4', name: 'Mouse Gamer Logitech G502 HERO 25K DPI', slug: 'mouse-logitech-g502-hero', description: 'Mouse gamer de alta precisao com RGB e botoes programaveis.', imageEmoji: '🖱️', priceCents: 33990, oldPriceCents: 39990, stock: 80, rating: 4.6, reviewCount: 621, sellerName: 'Logitech Store', categorySlug: 'perifericos' },
  { id: '5', name: 'Console Microsoft Xbox Series S 512GB SSD', slug: 'console-xbox-series-s-512gb', description: 'Console de nova geracao compacto com SSD e Game Pass.', imageEmoji: '🎮', priceCents: 219900, oldPriceCents: null, stock: 33, rating: 4.8, reviewCount: 1102, sellerName: 'Microsoft Store', categorySlug: 'games' },
]

const fallbackCategories: Category[] = [
  { id: 'notebooks', name: 'Notebooks', slug: 'notebooks', icon: '💻' },
  { id: 'smartphones', name: 'Smartphones', slug: 'smartphones', icon: '📱' },
  { id: 'componentes', name: 'Componentes', slug: 'componentes', icon: '🧩' },
  { id: 'perifericos', name: 'Perifericos', slug: 'perifericos', icon: '⌨️' },
  { id: 'games', name: 'Games', slug: 'games', icon: '🎮' },
]

function Header({ categories, onSearch }: { categories: Category[]; onSearch: (value: string) => void }) {
  const [term, setTerm] = useState('')

  function submit(event: FormEvent) {
    event.preventDefault()
    onSearch(term)
    document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="market-header">
      <div className="header-main container">
        <a className="market-logo" href="#home"><strong>NEXUS</strong><span>COMMERCE</span></a>
        <button className="category-trigger">☰ <span>Todas as categorias</span></button>
        <form className="market-search" onSubmit={submit}>
          <input placeholder="Buscar produtos, categorias, marcas..." value={term} onChange={(event) => setTerm(event.target.value)} />
          <button aria-label="Buscar"><Search size={18} /></button>
        </form>
        <a className="account-link" href="#login"><UserRound size={18} /> <span>Entrar</span></a>
        <button className="icon-link"><Heart size={22} /><span>Favoritos</span></button>
        <button className="icon-link cart-link"><ShoppingCart size={22} /><span>Carrinho</span><b>2</b></button>
      </div>
      <nav className="category-nav container">
        {categories.map((item, index) => <a className={index === 0 ? 'active' : ''} href="#produtos" key={item.slug}>{item.icon} {item.name}</a>)}
        <a href="#produtos">⭐ Mais vendidos</a>
        <a href="#produtos">🏷️ Ofertas</a>
      </nav>
    </header>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <div className="product-badges"><span className="badge">Oferta</span><button className="wish">♡</button></div>
      <div className="product-img">{product.imageEmoji}</div>
      <h3>{product.name}</h3>
      <div className="rating"><Star size={14} fill="currentColor" /> {product.rating} <small>({product.reviewCount})</small> <span className="seller">• {product.sellerName}</span></div>
      <div className="price"><strong>{cents(product.priceCents)}</strong>{product.oldPriceCents ? <del>{cents(product.oldPriceCents)}</del> : null}</div>
      <div className="installments">10x de {cents(product.priceCents / 10)} sem juros</div>
      <div className="product-tags"><span className="tag">Frete gratis</span><span className="tag">Entrega rapida</span></div>
    </article>
  )
}

function LoginPanel() {
  return (
    <section className="auth-card" id="login">
      <h2>Entrar ou cadastrar</h2>
      <p>Os botoes abaixo ficam ligados ao Auth0 quando as variaveis de ambiente forem configuradas.</p>
      <div className="social-stack">
        <button className="social-button google"><i>G</i> Continuar com Google</button>
        <button className="social-button apple"><i></i> Continuar com Apple</button>
        <button className="social-button microsoft"><i>▦</i> Continuar com Microsoft</button>
      </div>
      <div className="divider">ou</div>
      <form className="auth-form"><input className="auth-input" placeholder="Email" /><input className="auth-input" placeholder="Senha" type="password" /><button className="primary-button full">Entrar</button></form>
    </section>
  )
}

export function App() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [categories, setCategories] = useState<Category[]>(fallbackCategories)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState('Usando dados locais enquanto a API carrega.')

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const [apiCategories, apiProducts] = await Promise.all([getCategories(), getProducts(search)])
        if (apiCategories.length) setCategories(apiCategories)
        if (apiProducts.length) setProducts(apiProducts)
        setApiStatus('Catalogo conectado a API Go/PostgreSQL.')
      } catch (error) {
        setApiStatus('API indisponivel. Exibindo catalogo local de demonstracao.')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [search])

  const featured = useMemo(() => products.slice(0, 6), [products])

  return (
    <>
      <Header categories={categories} onSearch={setSearch} />
      <main className="container page-space">
        <section className="hero-market" id="home">
          <div className="hero-copy"><span className="eyebrow">Tecnologia sem limites</span><h1>Upgrade seu mundo com as melhores ofertas</h1><p>Marketplace real com React, API Go, PostgreSQL e login Auth0 preparado para Google, Apple e Microsoft.</p><a className="primary-button" href="#produtos">Ver ofertas</a></div>
          <div className="hero-device"><div className="sale-badge">ATE<br /><strong>40%</strong><br />OFF</div><div className="laptop-art"><span>N</span></div></div>
          <aside className="hero-benefits"><div><Truck /><strong>Frete gratis</strong><small>Para todo o Brasil</small></div><div><Zap /><strong>Entrega rapida</strong><small>Receba amanha</small></div><div><ShieldCheck /><strong>Compra segura</strong><small>Pagamento protegido</small></div></aside>
        </section>
        <section className="products-layout" id="produtos">
          <aside className="filters"><section className="filter-box"><h3>Filtros</h3><div className="check-list"><label><span><input type="checkbox" /> Notebooks</span><small>386</small></label><label><span><input type="checkbox" /> Frete gratis</span><small>Gratis</small></label><label><span><input type="checkbox" /> Entrega rapida</span><small>Turbo</small></label></div></section></aside>
          <section><div className="listing-top"><div><h1>Produtos de tecnologia</h1><p>{apiStatus}</p></div><select><option>Mais relevantes</option></select></div><div className="chips"><span className="chip">Em promocao</span><span className="chip">Frete gratis</span>{isLoading ? <span className="chip"><Loader2 size={14} /> Carregando</span> : null}</div><div className="product-grid listing-grid">{featured.map(product => <ProductCard product={product} key={product.id} />)}</div></section>
        </section>
        <section className="auth-page"><div className="auth-shell"><section className="auth-hero"><span className="eyebrow">Auth0</span><h1>Login social pronto para producao.</h1><p>Configure as conexoes Google, Apple e Microsoft no painel do Auth0 e a aplicacao usa os tokens para chamar a API protegida em Go.</p></section><LoginPanel /></div></section>
      </main>
    </>
  )
}
