# Plano de refatoracao segura do backend Go

O backend evoluiu rapidamente em um unico `main.go`, com endpoints de catalogo, Auth0, carrinho, pedidos, seller e admin. Para manter o projeto saudavel, a proxima etapa e separar o codigo em arquivos menores sem quebrar a compilacao.

## Estado atual

O backend funciona como uma API monolitica em Go, concentrada principalmente em:

- `backend/cmd/api/main.go`

Ja existem migrations, Dockerfile e estrutura de banco.

## Objetivo

Separar responsabilidades em arquivos menores dentro do mesmo pacote `main`, mantendo simplicidade e sem mudar arquitetura de deploy.

## Estrutura sugerida

```txt
backend/cmd/api/
  main.go              # bootstrap, dependencias, rotas e ListenAndServe
  types.go             # structs de request/response/modelos leves
  auth.go              # middleware JWT/Auth0 e helpers de perfil
  catalog_handlers.go  # categorias e produtos publicos
  cart_handlers.go     # carrinho persistente
  order_handlers.go    # pedidos do cliente e checkout
  seller_handlers.go   # dashboard e operacao do vendedor
  admin_handlers.go    # dashboard e consultas administrativas
  admin_actions.go     # acoes PATCH administrativas
  response.go          # writeJSON, writeError, getenv e helpers
```

## Ordem segura de execucao

### 1. Criar branch de refatoracao

```bash
git checkout -b refactor/backend-split
```

### 2. Extrair tipos

- Criar `types.go`.
- Copiar structs do `main.go` para `types.go`.
- Remover as mesmas structs do `main.go` no mesmo commit.
- Rodar:

```bash
go test ./...
```

### 3. Extrair utilitarios

- Criar `response.go`.
- Mover:
  - `getenv`
  - `writeJSON`
  - `writeError`
  - `scanProducts`
- Remover essas funcoes do `main.go`.
- Rodar `go test ./...`.

### 4. Extrair Auth0

- Criar `auth.go`.
- Mover:
  - `authMiddleware`
  - `getProfileBySubject`
  - `syncProfile`
  - `me`
- Remover do `main.go`.
- Rodar `go test ./...`.

### 5. Extrair catalogo

- Criar `catalog_handlers.go`.
- Mover:
  - `listCategories`
  - `listProducts`
  - `getProduct`

### 6. Extrair carrinho e pedidos

- Criar `cart_handlers.go`.
- Mover:
  - `getCart`
  - `addCartItem`
  - `getOrCreateOpenCart`
  - `buildCartResponse`

- Criar `order_handlers.go`.
- Mover:
  - `listOrders`
  - `getOrderItems`
  - `createOrder`

### 7. Extrair seller

- Criar `seller_handlers.go`.
- Mover:
  - `sellerDashboard`
  - `sellerProducts`
  - `sellerOrders`
  - `getSellerOrderItems`
  - `resolveSeller`

### 8. Extrair admin

- Criar `admin_handlers.go`.
- Mover:
  - `requireAdmin`
  - `adminDashboard`
  - `adminUsers`
  - `adminSellers`
  - `adminProducts`
  - `adminOrders`

- Criar `admin_actions.go`.
- Mover:
  - `adminSetUserRole`
  - `adminUpdateSellerStatus`
  - `adminUpdateProductStatus`
  - `adminUpdateOrderStatus`

## Regra importante

Nunca criar uma copia de uma funcao ou tipo sem remover a versao original no mesmo commit. Em Go, isso causa erro de simbolo duplicado no mesmo pacote.

## Validacao minima

Depois de cada etapa:

```bash
go test ./...
```

Com Docker:

```bash
docker compose up --build
```

Testes manuais:

```bash
curl http://localhost:8080/health
curl http://localhost:8080/api/products
```

## Proximo passo recomendado

Comecar pela extracao de `types.go` em uma branch propria e validar compilacao antes de continuar para os handlers.
