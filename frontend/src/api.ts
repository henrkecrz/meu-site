import { Product, Category } from './types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export type CartItem = {
  productId: string
  name: string
  slug: string
  imageEmoji: string
  priceCents: number
  quantity: number
  lineTotal: number
  sellerName: string
  rating: number
  reviewCount: number
}

export type Cart = {
  cartId: string
  items: CartItem[]
  itemCount: number
  totalCents: number
}

export type Order = {
  orderId: string
  status: string
  totalCents: number
  items: CartItem[]
  createdAt: string
}

export type SellerDashboard = {
  sellerId: string
  sellerName: string
  productsActive: number
  stockTotal: number
  itemsSold: number
  revenueCents: number
  ordersCount: number
}

function authHeaders(accessToken: string) {
  return { Authorization: `Bearer ${accessToken}` }
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/api/categories`)
  if (!response.ok) throw new Error('Erro ao buscar categorias')
  return response.json()
}

export async function getProducts(search = '', category = ''): Promise<Product[]> {
  const params = new URLSearchParams()
  if (search) params.set('q', search)
  if (category) params.set('category', category)

  const response = await fetch(`${API_URL}/api/products?${params.toString()}`)
  if (!response.ok) throw new Error('Erro ao buscar produtos')
  return response.json()
}

export async function getMe(accessToken: string) {
  const response = await fetch(`${API_URL}/api/me`, { headers: authHeaders(accessToken) })
  if (!response.ok) throw new Error('Sessao invalida')
  return response.json()
}

export async function syncProfile(accessToken: string, profile: { email?: string; name?: string; pictureUrl?: string }) {
  const response = await fetch(`${API_URL}/api/profile/sync`, {
    method: 'POST',
    headers: {
      ...authHeaders(accessToken),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  })
  if (!response.ok) throw new Error('Erro ao sincronizar perfil')
  return response.json()
}

export async function getCart(accessToken: string): Promise<Cart> {
  const response = await fetch(`${API_URL}/api/cart`, { headers: authHeaders(accessToken) })
  if (!response.ok) throw new Error('Erro ao buscar carrinho')
  return response.json()
}

export async function addCartItem(accessToken: string, productId: string, quantity = 1): Promise<Cart> {
  const response = await fetch(`${API_URL}/api/cart/items`, {
    method: 'POST',
    headers: {
      ...authHeaders(accessToken),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId, quantity }),
  })
  if (!response.ok) throw new Error('Erro ao adicionar item ao carrinho')
  return response.json()
}

export async function getOrders(accessToken: string): Promise<Order[]> {
  const response = await fetch(`${API_URL}/api/orders`, { headers: authHeaders(accessToken) })
  if (!response.ok) throw new Error('Erro ao buscar pedidos')
  return response.json()
}

export async function createOrder(accessToken: string): Promise<Order> {
  const response = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: {
      ...authHeaders(accessToken),
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) throw new Error('Erro ao criar pedido')
  return response.json()
}

export async function getSellerDashboard(accessToken: string): Promise<SellerDashboard> {
  const response = await fetch(`${API_URL}/api/seller/dashboard`, { headers: authHeaders(accessToken) })
  if (!response.ok) throw new Error('Erro ao buscar dashboard do vendedor')
  return response.json()
}

export async function getSellerProducts(accessToken: string): Promise<Product[]> {
  const response = await fetch(`${API_URL}/api/seller/products`, { headers: authHeaders(accessToken) })
  if (!response.ok) throw new Error('Erro ao buscar produtos do vendedor')
  return response.json()
}

export async function getSellerOrders(accessToken: string): Promise<Order[]> {
  const response = await fetch(`${API_URL}/api/seller/orders`, { headers: authHeaders(accessToken) })
  if (!response.ok) throw new Error('Erro ao buscar pedidos do vendedor')
  return response.json()
}
