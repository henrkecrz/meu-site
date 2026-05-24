const products = [
  {
    id: 1,
    name: "Notebook Quantum Pro 16",
    category: "hardware",
    icon: "💻",
    price: 12990,
    desc: "Intel Core Ultra, RTX, tela 3K, garantia premium e setup remoto incluso.",
    tag: "Mais vendido"
  },
  {
    id: 2,
    name: "Workstation Creator X",
    category: "hardware",
    icon: "🖥️",
    price: 18990,
    desc: "Maquina para IA, render, engenharia e times de desenvolvimento intensivo.",
    tag: "Alta performance"
  },
  {
    id: 3,
    name: "Suite Cyber Shield Pro",
    category: "software",
    icon: "🛡️",
    price: 1490,
    desc: "Licenca anual com EDR, backup, cofre de senhas e monitoramento 24/7.",
    tag: "Assinatura"
  },
  {
    id: 4,
    name: "Kit Smart Office 360",
    category: "hardware",
    icon: "📡",
    price: 4290,
    desc: "Roteadores mesh, camera 4K, automacao e instalacao assistida.",
    tag: "B2B"
  },
  {
    id: 5,
    name: "Cloud Backup 10 TB",
    category: "software",
    icon: "☁️",
    price: 890,
    desc: "Backup corporativo com criptografia, auditoria e restauracao expressa.",
    tag: "Cloud"
  },
  {
    id: 6,
    name: "Consultoria DevOps Sprint",
    category: "servicos",
    icon: "⚙️",
    price: 6900,
    desc: "Arquitetura, CI/CD, observabilidade e hardening em ate 10 dias uteis.",
    tag: "Servico"
  }
];

const modules = [
  ["🛒", "Cliente", "Vitrine, carrinho, favoritos, pedidos, garantias, pontos e atendimento."],
  ["🏬", "Vendedor", "Cadastro de produtos, pedidos, estoque, repasses, reputacao e anuncios."],
  ["🧠", "Admin geral", "KPIs, risco, disputas, sellers, categorias, campanhas e governanca."],
  ["🏢", "Clientes de clientes", "Subcontas B2B, compras por equipe, limites, contratos e aprovacoes."],
  ["🎧", "Suporte", "Tickets, devolucoes, garantia, rastreamento e assistente inteligente."],
  ["📊", "BI comercial", "Analises de receita, conversao, LTV, cohort, margem e funil."],
];

const sellerKpis = [
  ["Receita hoje", "R$ 48,7 mil", "+18%", "up"],
  ["Pedidos novos", "126", "+9%", "up"],
  ["SLA envio", "96,4%", "+2,1%", "up"],
  ["Cancelamentos", "1,8%", "-0,7%", "up"],
];

const adminKpis = [
  ["GMV", "R$ 2,84 mi", "+31%", "up"],
  ["Take rate", "14,6%", "+1,4%", "up"],
  ["Disputas abertas", "37", "-12%", "up"],
  ["Risco transacional", "0,42%", "+0,08%", "down"],
];

const orders = [
  ["#NX-9041", "Notebook Quantum Pro 16", "Separacao", "warn"],
  ["#NX-9038", "Cloud Backup 10 TB", "Entregue", "ok"],
  ["#NX-9022", "Kit Smart Office 360", "Coleta hoje", "warn"],
  ["#NX-8997", "Suite Cyber Shield Pro", "Ativado", "ok"],
];

const stocks = [
  ["SSD NVMe 4 TB", "8 unidades", "Repor", "warn"],
  ["GPU RTX Studio", "2 unidades", "Critico", "danger"],
  ["Roteador Mesh Pro", "31 unidades", "OK", "ok"],
  ["Licenca Cyber Shield", "Ilimitado", "Digital", "ok"],
];

const sellers = [
  ["TechPrime Distribuidora", "Reputacao 98%", "Aprovado", "ok"],
  ["Nuvem Segura SaaS", "SLA 99%", "Aprovado", "ok"],
  ["MegaHardware BR", "Atrasos recentes", "Monitorar", "warn"],
  ["Outlet Componentes", "Chargeback alto", "Revisao", "danger"],
];

const risks = [
  ["Pico de chargeback", "Categoria placas de video", "Alto", "danger"],
  ["Cupom agressivo", "Margem abaixo de 8%", "Medio", "warn"],
  ["Fraude bloqueada", "12 tentativas em checkout", "Resolvido", "ok"],
  ["SLA de seller", "3 pedidos fora do prazo", "Medio", "warn"],
];

const b2bAccounts = [
  ["Agencia PixelForge", "12 usuarios • limite R$ 80 mil", "Ativa", "ok"],
  ["CliniTech Saude", "5 usuarios • contrato anual", "Ativa", "ok"],
  ["Escola Futuro Digital", "32 usuarios • aguardando NF", "Pendente", "warn"],
  ["Revenda Norte Cloud", "Programa parceiro", "Premium", "ok"],
];

const tickets = [
  ["Garantia expressa", "Notebook Quantum Pro 16", "Prioritario", "danger"],
  ["Rastreio divergente", "Kit Smart Office 360", "Aberto", "warn"],
  ["Ativacao de licenca", "Cyber Shield Pro", "Resolvido", "ok"],
  ["Upgrade de plano", "Cloud Backup", "Em analise", "warn"],
];

let cart = [products[0], products[2]];
let activeFilter = "todos";

const currency = value => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return [...document.querySelectorAll(selector)];
}

function renderModules() {
  qs("#moduleGrid").innerHTML = modules.map(([icon, title, desc]) => `
    <article class="module-card">
      <div class="icon">${icon}</div>
      <h3>${title}</h3>
      <p>${desc}</p>
    </article>
  `).join("");
}

function productCard(product) {
  return `
    <article class="product-card" data-name="${product.name.toLowerCase()}" data-category="${product.category}">
      <div class="product-image">${product.icon}</div>
      <div class="product-meta">
        <h3>${product.name}</h3>
        <span class="badge">${product.tag}</span>
      </div>
      <p>${product.desc}</p>
      <div class="product-meta">
        <span class="price">${currency(product.price)}</span>
        <button class="secondary-button" data-add-cart="${product.id}">Adicionar</button>
      </div>
    </article>
  `;
}

function renderProducts() {
  qs("#homeProducts").innerHTML = products.slice(0, 3).map(productCard).join("");
  const filtered = products.filter(product => activeFilter === "todos" || product.category === activeFilter);
  qs("#clientProducts").innerHTML = filtered.map(productCard).join("");
  attachCartButtons();
}

function attachCartButtons() {
  qsa("[data-add-cart]").forEach(button => {
    button.onclick = () => {
      const product = products.find(item => item.id === Number(button.dataset.addCart));
      cart.push(product);
      renderCart();
      button.textContent = "Adicionado";
      setTimeout(() => (button.textContent = "Adicionar"), 900);
    };
  });
}

function renderCart() {
  const items = cart.reduce((acc, product) => {
    acc[product.id] = acc[product.id] || { ...product, qty: 0 };
    acc[product.id].qty += 1;
    return acc;
  }, {});

  const subtotal = cart.reduce((sum, product) => sum + product.price, 0);
  const discount = subtotal * 0.1;
  const total = subtotal - discount;

  qs("#cartItems").innerHTML = Object.values(items).map(item => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <small>${item.qty}x • ${currency(item.price)}</small>
      </div>
      <button class="ghost-button" data-remove-cart="${item.id}">×</button>
    </div>
  `).join("") || "<small>Seu carrinho esta vazio.</small>";

  qs("#cartSubtotal").textContent = currency(subtotal);
  qs("#cartDiscount").textContent = `-${currency(discount)}`;
  qs("#cartTotal").textContent = currency(total);

  qsa("[data-remove-cart]").forEach(button => {
    button.onclick = () => {
      const index = cart.findIndex(product => product.id === Number(button.dataset.removeCart));
      if (index >= 0) cart.splice(index, 1);
      renderCart();
    };
  });
}

function renderKpis(selector, data) {
  qs(selector).innerHTML = data.map(([label, value, delta, tone]) => `
    <article class="kpi-card">
      <span>${label}</span>
      <strong>${value}</strong>
      <small class="${tone}">${delta}</small>
    </article>
  `).join("");
}

function renderList(selector, data) {
  qs(selector).innerHTML = data.map(([title, subtitle, status, tone]) => `
    <div class="table-item">
      <div>
        <strong>${title}</strong>
        <small>${subtitle}</small>
      </div>
      <span class="status ${tone}">${status}</span>
    </div>
  `).join("");
}

function goToPage(page) {
  qsa(".page").forEach(section => section.classList.toggle("active-page", section.id === page));
  qsa(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.page === page));
  window.location.hash = page;
  qs(".sidebar").classList.remove("open");
}

function setupNavigation() {
  qsa("[data-page]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      goToPage(link.dataset.page);
    });
  });
  qsa("[data-page-target]").forEach(button => {
    button.addEventListener("click", () => goToPage(button.dataset.pageTarget));
  });
  const hash = window.location.hash.replace("#", "");
  if (hash && qs(`#${hash}`)) goToPage(hash);
}

function setupFilters() {
  qsa(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      qsa(".tab").forEach(item => item.classList.remove("active"));
      tab.classList.add("active");
      activeFilter = tab.dataset.filter;
      renderProducts();
    });
  });

  qs("#searchInput").addEventListener("input", event => {
    const term = event.target.value.trim().toLowerCase();
    qsa(".product-card").forEach(card => {
      card.style.display = card.dataset.name.includes(term) || !term ? "grid" : "none";
    });
  });
}

function setupUI() {
  qs("#themeButton").addEventListener("click", () => {
    document.body.classList.toggle("neon");
  });
  qs("#menuButton").addEventListener("click", () => {
    qs(".sidebar").classList.toggle("open");
  });
}

renderModules();
renderProducts();
renderCart();
renderKpis("#sellerKpis", sellerKpis);
renderKpis("#adminKpis", adminKpis);
renderList("#sellerOrders", orders);
renderList("#stockList", stocks);
renderList("#sellerGovernance", sellers);
renderList("#riskAlerts", risks);
renderList("#b2bAccounts", b2bAccounts);
renderList("#tickets", tickets);
setupNavigation();
setupFilters();
setupUI();
