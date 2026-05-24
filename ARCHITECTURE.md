# Nexus Commerce Architecture

Arquitetura criada:

- Frontend: React, Vite e TypeScript.
- Backend: Go com Chi.
- Banco: PostgreSQL.
- Containers: Docker Compose.
- Autenticacao: backend preparado para JWT de provedor externo.

Pastas principais:

- backend: API, Dockerfile e migrations.
- frontend: app React, Dockerfile e componentes.
- backend/migrations: schema de catalogo, produtos, carrinho e pedidos.

Comandos:

- docker compose up --build

Portas:

- Web: 5173
- API: 8080
- Banco: 5432

Pendencias locais:

- Criar arquivo HTML de entrada do Vite em frontend.
- Criar tsconfig raiz do frontend, estendendo tsconfig.app.json.
- Informar as variaveis do provedor de identidade no ambiente local.
