# Plano de Evolucao do Nexus Commerce

Este documento organiza as proximas etapas para transformar o Nexus Commerce em um marketplace real de tecnologia, com frontend React, backend Go, PostgreSQL e autenticacao Auth0.

## 1. Fechar a base tecnica

Objetivo: garantir que o projeto rode de ponta a ponta em ambiente local e em nuvem.

Tarefas:

- Finalizar estrutura React + Vite.
- Criar `frontend/index.html` localmente.
- Criar `frontend/tsconfig.json` localmente.
- Garantir que `docker compose up --build` suba:
  - PostgreSQL
  - API Go
  - Frontend React
- Validar endpoints:
  - `GET /health`
  - `GET /api/categories`
  - `GET /api/products`
  - `GET /api/products/{slug}`
- Ajustar CORS entre frontend e backend.
- Revisar logs e mensagens de erro.

Prioridade: Alta.

## 2. Integrar Auth0 real

Objetivo: ativar login real com Google, Apple e Microsoft.

Tarefas:

- Criar aplicacao Single Page Application no Auth0.
- Criar API no Auth0 para o backend Go.
- Configurar callback, logout e web origins.
- Ativar conexoes sociais:
  - Google
  - Apple
  - Microsoft
- Instalar e configurar `@auth0/auth0-react` no frontend.
- Enviar token Bearer para API Go.
- Validar JWT no backend via JWKS.
- Criar rota protegida `/api/me`.
- Criar protecao de rotas no React.

Prioridade: Alta.

## 3. Criar perfis de usuario

Objetivo: separar clientes, vendedores e administradores.

Tarefas:

- Criar tabela `user_profiles` vinculada ao identificador do Auth0.
- Campos sugeridos:
  - `id`
  - `auth_provider_sub`
  - `email`
  - `name`
  - `picture_url`
  - `role`
  - `created_at`
  - `updated_at`
- Roles iniciais:
  - `customer`
  - `seller`
  - `admin`
- Criar endpoint para sincronizar perfil apos login.
- Criar menu condicional por tipo de usuario.

Prioridade: Alta.

## 4. Separar rotas do marketplace

Objetivo: criar uma experiencia completa de navegacao.

Rotas sugeridas:

- `/` — home
- `/produtos` — listagem de produtos
- `/produto/:slug` — detalhe do produto
- `/login` — login e cadastro
- `/minha-conta` — perfil do cliente
- `/meus-pedidos` — pedidos do cliente
- `/carrinho` — carrinho persistente
- `/checkout` — fechamento de pedido
- `/seller` — painel do vendedor
- `/seller/produtos` — produtos do vendedor
- `/seller/pedidos` — pedidos recebidos
- `/admin` — painel geral
- `/admin/usuarios` — usuarios
- `/admin/vendedores` — sellers
- `/admin/produtos` — catalogo geral

Prioridade: Alta.

## 5. Carrinho persistente

Objetivo: salvar carrinho no PostgreSQL e associar ao usuario logado.

Tarefas:

- Criar endpoint para buscar carrinho aberto.
- Criar endpoint para adicionar item.
- Criar endpoint para alterar quantidade.
- Criar endpoint para remover item.
- Calcular subtotal no backend.
- Aplicar cupom no backend.
- Exibir carrinho atualizado no React.

Prioridade: Alta.

## 6. Checkout realista

Objetivo: criar fluxo completo de compra.

Etapas do checkout:

1. Identificacao do usuario.
2. Endereco de entrega.
3. Calculo de frete.
4. Cupom de desconto.
5. Metodo de pagamento.
6. Revisao do pedido.
7. Criacao do pedido.
8. Tela de sucesso.

Metodos futuros:

- Pix
- Cartao
- Boleto
- Carteira digital

Gateways possiveis:

- Mercado Pago
- Stripe
- Pagar.me
- Asaas

Prioridade: Media/Alta.

## 7. Produto mais completo

Objetivo: transformar o catalogo em estrutura profissional.

Campos sugeridos para produtos:

- Nome
- Slug
- Descricao curta
- Descricao completa
- Marca
- SKU
- Categoria
- Vendedor
- Imagens
- Preco
- Preco promocional
- Estoque
- Peso
- Dimensoes
- Garantia
- Especificacoes tecnicas
- Variacoes
- Status

Status sugeridos:

- `active`
- `paused`
- `out_of_stock`
- `archived`

Prioridade: Media.

## 8. Pagina de produto profissional

Objetivo: melhorar conversao e confianca.

Componentes:

- Galeria de imagens
- Breadcrumb
- Nome completo
- Avaliacao
- Seller verificado
- Preco e parcelamento
- Calculo de frete
- Botao comprar agora
- Botao adicionar ao carrinho
- Ficha tecnica
- Perguntas e respostas
- Avaliacoes de clientes
- Produtos relacionados
- Politica de garantia e devolucao

Prioridade: Media.

## 9. Painel do vendedor

Objetivo: permitir que sellers operem dentro do marketplace.

Funcionalidades:

- Dashboard de vendas
- Cadastro de produtos
- Edicao de produtos
- Estoque
- Pedidos recebidos
- Repasses financeiros
- Reputacao
- Mensagens de clientes
- Anuncios patrocinados
- Relatorios

Prioridade: Media.

## 10. Admin geral

Objetivo: controlar a operacao do marketplace.

Funcionalidades:

- Aprovar vendedores
- Bloquear vendedores
- Aprovar produtos
- Remover produtos irregulares
- Gerenciar categorias
- Acompanhar GMV
- Acompanhar take rate
- Ver disputas
- Ver pedidos problematicos
- Ver usuarios
- Gerar relatorios

Prioridade: Media.

## 11. Infraestrutura e qualidade

Objetivo: preparar para producao.

Tarefas:

- Adicionar migrations com ferramenta dedicada.
- Adicionar testes unitarios no backend.
- Adicionar testes de API.
- Adicionar logs estruturados.
- Adicionar validacao de payloads.
- Adicionar CI/CD com GitHub Actions.
- Separar ambientes:
  - desenvolvimento
  - homologacao
  - producao
- Adicionar monitoramento.
- Adicionar backup do banco.

Prioridade: Media.

## 12. Publicacao

Para testes rapidos:

- GitHub Codespaces + Ports
- ngrok dentro do Codespaces

Para publicacao real:

- Frontend:
  - Vercel
  - Netlify
  - Hostinger
- Backend Go:
  - Railway
  - Render
  - Fly.io
  - VPS
- PostgreSQL:
  - Neon
  - Supabase
  - Railway Postgres
  - VPS
- Auth:
  - Auth0

Prioridade: Media.

## 13. Ordem recomendada de execucao

1. Fazer o React rodar 100% localmente.
2. Ligar React na API Go.
3. Ligar Go no PostgreSQL.
4. Ativar Auth0 real.
5. Criar perfil de usuario.
6. Implementar carrinho persistente.
7. Implementar checkout.
8. Criar painel do vendedor.
9. Criar painel do admin.
10. Publicar em ambiente de teste.
11. Publicar em producao.

## 14. Meta do projeto

Construir um marketplace de tecnologia moderno, com experiencia premium para compradores, vendedores e administradores, usando uma stack escalavel e pronta para evoluir para producao.
