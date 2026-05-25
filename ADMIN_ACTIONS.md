# Acoes administrativas

Este documento registra a etapa de acoes administrativas do Nexus Commerce.

## Banco

Foi criada a migration:

- `backend/migrations/006_admin_action_status.sql`

Ela adiciona o campo `status` na tabela `products`, permitindo controlar produtos ativos, pausados, sem estoque e arquivados.

## Backend

Foi criado o arquivo:

- `backend/cmd/api/admin_actions.go`

Handlers adicionados:

- `adminSetUserRole`
- `adminUpdateSellerStatus`
- `adminUpdateProductStatus`
- `adminUpdateOrderStatus`

Acoes previstas:

- Alterar role de usuario:
  - `customer`
  - `seller`
  - `admin`
- Atualizar status de vendedor:
  - `active`
  - `pending`
  - `suspended`
- Atualizar status de produto:
  - `active`
  - `paused`
  - `out_of_stock`
  - `archived`
- Atualizar status de pedido:
  - `pending`
  - `paid`
  - `shipped`
  - `delivered`
  - `cancelled`

## Rotas que devem estar plugadas no main.go

As rotas esperadas sao:

```go
private.Patch("/api/admin/users/{id}/role", app.adminSetUserRole)
private.Patch("/api/admin/sellers/{id}/status", app.adminUpdateSellerStatus)
private.Patch("/api/admin/products/{id}/status", app.adminUpdateProductStatus)
private.Patch("/api/admin/orders/{id}/status", app.adminUpdateOrderStatus)
```

Observacao: os handlers ja existem. Caso as rotas ainda nao estejam no `main.go`, basta adiciona-las dentro do grupo protegido que ja usa `app.authMiddleware`.

## Frontend

O arquivo `frontend/src/api.ts` recebeu clientes para as acoes:

- `adminSetUserRole`
- `adminUpdateSellerStatus`
- `adminUpdateProductStatus`
- `adminUpdateOrderStatus`

Todas usam `PATCH` com Bearer token e dependem de perfil `admin` no backend.
