# Nexus Commerce - Plano de evolucao

Objetivo: transformar o projeto em um marketplace modular, responsivo, dark-first, com tema claro opcional, frontend refatorado, backend Go/PostgreSQL organizado e areas reais de cliente, vendedor e administrador.

## Fase 1 - Produto e UX

- Dark mode como padrao.
- Light mode opcional com toggle.
- Navegacao por paginas reais.
- Home limpa.
- Catalogo completo.
- Detalhe do produto.
- Carrinho lateral e pagina de carrinho.
- Checkout em etapas.
- Conta, pedidos e suporte do cliente.
- Area do vendedor separada.
- Area admin separada.
- Mobile-first.

## Fase 2 - Frontend modular

Estrutura alvo:

- src/app
- src/pages/public
- src/pages/customer
- src/pages/seller
- src/pages/admin
- src/components/layout
- src/components/product
- src/components/cart
- src/components/checkout
- src/hooks
- src/services
- src/styles

Tarefas:

- Instalar React Router.
- Trocar estado page por rotas reais.
- Separar cada pagina em arquivo proprio.
- Criar Header, Footer, MobileMenu e PageShell.
- Criar design system basico.
- Criar hooks useCart, useTheme e useAuthSession.

## Fase 3 - Backend modular

Estrutura alvo:

- cmd/api/main.go
- internal/config
- internal/http
- internal/auth
- internal/catalog
- internal/cart
- internal/checkout
- internal/orders
- internal/seller
- internal/admin
- internal/users
- internal/db

Tarefas:

- Quebrar main.go em pacotes.
- Criar repositories.
- Criar services.
- Criar handlers finos.
- Padronizar erros.
- Adicionar logs estruturados.
- Criar testes.

## Fase 4 - Banco e dominio

Entidades principais:

- users
- sellers
- seller_members
- categories
- products
- product_images
- product_variants
- inventory_movements
- carts
- orders
- payments
- shipments
- reviews
- wishlists
- audit_logs
- notifications

## Fase 5 - Marketplace real

- CRUD de produto.
- Estoque.
- Pedido real.
- Checkout completo.
- Pix/cartao via gateway.
- Webhooks.
- Notificacoes.
- Cupons.
- Avaliacoes.

## Fase 6 - Seller

- Dashboard.
- Produtos.
- Estoque.
- Pedidos recebidos.
- Repasses.
- Avaliacoes.
- Configuracao da loja.

## Fase 7 - Admin

- Usuarios.
- Roles.
- Sellers.
- Produtos.
- Pedidos.
- Categorias.
- Cupons.
- Moderacao.
- Auditoria.

## Fase 8 - Producao

- Backend publicado.
- Postgres gerenciado.
- Vercel com variaveis corretas.
- CI/CD.
- Testes E2E.
- Observabilidade.
- SEO.
- Performance.

## Proxima acao imediata

1. Instalar React Router.
2. Criar estrutura src/pages.
3. Mover paginas atuais para arquivos separados.
4. Criar tema claro/escuro.
5. Criar rotas reais para todas as paginas.
