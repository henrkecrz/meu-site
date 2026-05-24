const catalog = [
  { id: 1, title: "Notebook ASUS ROG Strix G16 Intel Core i7 13ª Gen 16GB RTX 4060 512GB SSD 16'' FHD 144Hz", price: 6999, oldPrice: 8499, discount: "-18%", category: "notebooks", icon: "💻", rating: "4,8", reviews: "256", seller: "Nexus Oficial", tag: "FRETE GRATIS", sold: "132 vendidos" },
  { id: 2, title: "Notebook Acer Nitro 5 Intel Core i5 12ª Gen 8GB RTX 3050 512GB SSD 15,6'' FHD IPS", price: 4399, oldPrice: 4999, discount: "-12%", category: "notebooks", icon: "💻", rating: "4,7", reviews: "198", seller: "Acer Oficial", tag: "FRETE GRATIS", sold: "98 vendidos" },
  { id: 3, title: "Notebook Lenovo LOQ Intel Core i5 12ª Gen 16GB RTX 4050 512GB SSD 15,6'' FHD", price: 4249, oldPrice: 4999, discount: "-15%", category: "notebooks", icon: "💻", rating: "4,6", reviews: "171", seller: "Lenovo Oficial", tag: "FRETE GRATIS", sold: "176 vendidos" },
  { id: 4, title: "Notebook Dell G15 Intel Core i7 13ª Gen 16GB RTX 4060 1TB SSD 15,6'' FHD 165Hz", price: 7199, oldPrice: 7999, discount: "-10%", category: "notebooks", icon: "💻", rating: "4,6", reviews: "142", seller: "Dell Oficial", tag: "FRETE GRATIS", sold: "214 vendidos" },
  { id: 5, title: "Notebook Samsung Book3 Intel Core i5 13ª Gen 8GB 256GB SSD 15,6'' FHD", price: 3199, oldPrice: 3999, discount: "-20%", category: "notebooks", icon: "💻", rating: "4,5", reviews: "96", seller: "Samsung Oficial", tag: "FRETE GRATIS", sold: "87 vendidos" },
  { id: 6, title: "Notebook ASUS Vivobook 15 Intel Core i3 11ª Gen 8GB 256GB SSD 15,6'' FHD", price: 2549, oldPrice: null, discount: "MAIS VENDIDO", category: "notebooks", icon: "💻", rating: "4,7", reviews: "312", seller: "ASUS Oficial", tag: "FRETE GRATIS", sold: "412 vendidos" },
  { id: 7, title: "Headset Gamer HyperX Cloud Stinger Core com microfone e som imersivo", price: 199.9, oldPrice: 299.9, discount: "-32%", category: "perifericos", icon: "🎧", rating: "4,8", reviews: "1.248", seller: "HyperX Store", tag: "ENTREGA AMANHA", sold: "132 vendidos" },
  { id: 8, title: "Memoria Corsair Vengeance RGB 16GB 2x8GB 3200MHz DDR4", price: 379.9, oldPrice: 459.9, discount: "-18%", category: "componentes", icon: "🌈", rating: "4,9", reviews: "2.341", seller: "Corsair Oficial", tag: "FRETE GRATIS", sold: "98 vendidos" },
  { id: 9, title: "SSD Kingston NV2 1TB NVMe M.2 2280 leitura de alta velocidade", price: 289.9, oldPrice: 389.9, discount: "-25%", category: "componentes", icon: "💾", rating: "4,7", reviews: "842", seller: "TerabyteShop", tag: "FRETE GRATIS", sold: "176 vendidos" },
  { id: 10, title: "Mouse Gamer Logitech G502 HERO 25K DPI RGB programavel", price: 339.9, oldPrice: 399.9, discount: "-15%", category: "perifericos", icon: "🖱️", rating: "4,6", reviews: "621", seller: "Logitech Store", tag: "ENTREGA AMANHA", sold: "214 vendidos" },
  { id: 11, title: "Teclado Mecanico Redragon Kumara RGB Switch Blue ABNT2", price: 199.9, oldPrice: 249.9, discount: "-20%", category: "perifericos", icon: "⌨️", rating: "4,8", reviews: "1.102", seller: "Redragon Oficial", tag: "FRETE GRATIS", sold: "87 vendidos" },
  { id: 12, title: "Smartphone Samsung Galaxy S24 256GB 5G 8GB RAM camera IA", price: 4599, oldPrice: null, discount: "-8%", category: "smartphones", icon: "📱", rating: "4,9", reviews: "2.341", seller: "Loja Galaxy", tag: "ENTREGA AMANHA", sold: "301 vendidos" },
  { id: 13, title: "Placa de Video RTX 4060 Ti 8GB GDDR6 128-bit Gigabyte", price: 2639.9, oldPrice: 2999.9, discount: "-12%", category: "componentes", icon: "🎮", rating: "4,7", reviews: "842", seller: "Gigabyte Store", tag: "FRETE GRATIS", sold: "156 vendidos" },
  { id: 14, title: "Monitor Gamer LG UltraGear 24 IPS Full HD 144Hz 1ms HDR10", price: 899.9, oldPrice: null, discount: "TOP", category: "monitores", icon: "🖥️", rating: "4,6", reviews: "621", seller: "Nexus Oficial", tag: "FRETE GRATIS", sold: "222 vendidos" },
  { id: 15, title: "Console Microsoft Xbox Series S 512GB SSD Branco nova geracao", price: 2199, oldPrice: null, discount: "OFERTA", category: "games", icon: "🎮", rating: "4,8", reviews: "1.102", seller: "Microsoft Store", tag: "FRETE GRATIS", sold: "190 vendidos" }
];

const categories = [
  ["💻", "Notebooks", "386 ofertas"],
  ["📱", "Smartphones", "214 ofertas"],
  ["🧩", "Componentes", "528 ofertas"],
  ["⌨️", "Perifericos", "442 ofertas"],
  ["◎", "Software", "96 ofertas"],
  ["🎮", "Games", "188 ofertas"]
];

const money = value => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const shortInstallment = value => `10x de ${money(value / 10)} sem juros`;
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function card(product, compact = false) {
  return `
    <article class="product-card">
      <div class="product-badges">
        <span class="badge">${product.discount}</span>
        <button class="wish" aria-label="Favoritar">♡</button>
      </div>
      <a href="produto.html?id=${product.id}" class="product-img" aria-label="Ver ${product.title}">${product.icon}</a>
      <a href="produto.html?id=${product.id}"><h3>${product.title}</h3></a>
      <div class="rating">★ ${product.rating} <small>(${product.reviews})</small> <span class="seller">• ${product.seller}</span> <span class="verified">●</span></div>
      <div class="price"><strong>${money(product.price)}</strong>${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ""}</div>
      <div class="installments">${shortInstallment(product.price)}</div>
      <div class="product-tags"><span class="tag">Frete gratis</span><span class="tag">Entrega rapida</span></div>
      ${compact ? `<small class="seller">${product.sold}</small>` : `<button class="outline-button add-cart" data-add="${product.id}">Adicionar ao carrinho</button>`}
    </article>
  `;
}

function renderHome() {
  const flash = $("#flashDeals");
  const featured = $("#featuredProducts");
  const recommended = $("#recommendedProducts");
  if (flash) flash.innerHTML = catalog.slice(6, 11).map(item => card(item, true)).join("");
  if (featured) featured.innerHTML = catalog.slice(0, 5).map(item => card(item, true)).join("");
  if (recommended) recommended.innerHTML = catalog.slice(10, 15).map(item => card(item)).join("");
}

function renderListing() {
  const grid = $("#listingGrid");
  if (!grid) return;
  grid.innerHTML = catalog.slice(0, 8).map(item => card(item)).join("");
  const total = $("#resultCount");
  if (total) total.textContent = "Mostrando 1-24 de 386 resultados";
}

function renderDetail() {
  const detail = $("#productDetail");
  if (!detail) return;
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id") || 1);
  const product = catalog.find(item => item.id === id) || catalog[0];
  document.title = `${product.title} | Nexus Commerce`;
  detail.innerHTML = `
    <section class="details-card">
      <div class="gallery-main">${product.icon}</div>
      <div class="thumbs"><button>${product.icon}</button><button>🔍</button><button>📦</button><button>⚡</button></div>
    </section>
    <section class="details-card product-info">
      <div class="breadcrumb">Inicio › ${product.category} › ${product.seller}</div>
      <span class="ship-badge">${product.tag}</span>
      <h1>${product.title}</h1>
      <div class="rating">★ ${product.rating} <small>(${product.reviews} avaliacoes)</small> <span class="seller">• vendido por ${product.seller}</span> <span class="verified">●</span></div>
      <p>Produto original com nota fiscal, garantia do fabricante e compra protegida pelo Nexus Commerce.</p>
      <div class="benefit-list">
        <span>✓ Garantia de 12 meses</span>
        <span>✓ Devolucao gratis em ate 7 dias</span>
        <span>✓ Atendimento especializado em tecnologia</span>
      </div>
    </section>
    <aside class="details-card buy-box">
      <span class="badge">${product.discount}</span>
      <div class="price"><strong>${money(product.price)}</strong>${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ""}</div>
      <div class="installments">${shortInstallment(product.price)}</div>
      <div class="delivery-box">🚚 Chega amanha para capitais selecionadas. Frete gratis.</div>
      <div class="qty-row"><label>Quantidade</label><select><option>1 unidade</option><option>2 unidades</option><option>3 unidades</option></select></div>
      <button class="primary-button full add-cart" data-add="${product.id}">Comprar agora</button>
      <button class="outline-button full add-cart" data-add="${product.id}">Adicionar ao carrinho</button>
      <small class="secure-note">Pagamento seguro com cartao, Pix, boleto ou carteira digital.</small>
    </aside>
  `;
}

function setupSearch() {
  const input = document.querySelector('.market-search input');
  if (!input) return;
  input.addEventListener('input', event => {
    const term = event.target.value.toLowerCase().trim();
    const grid = $('#listingGrid');
    if (!grid) return;
    const filtered = catalog.filter(item => item.title.toLowerCase().includes(term) || item.category.includes(term));
    grid.innerHTML = filtered.map(item => card(item)).join('');
  });
}

function setupCartButtons() {
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-add]');
    if (!button) return;
    event.preventDefault();
    const count = $('#cartCount');
    if (count) count.textContent = String(Number(count.textContent || 0) + 1);
    button.textContent = 'Adicionado ✓';
    setTimeout(() => (button.textContent = button.classList.contains('primary-button') ? 'Comprar agora' : 'Adicionar ao carrinho'), 1100);
  });
}

function setupLogin() {
  $$('.social-button, .auth-form button').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      const status = $('#loginStatus');
      if (status) status.textContent = 'Autenticacao demonstrativa: conecte Firebase, Supabase ou Auth0 para ativar login real.';
    });
  });
}

renderHome();
renderListing();
renderDetail();
setupSearch();
setupCartButtons();
setupLogin();
