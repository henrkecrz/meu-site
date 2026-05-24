import { Product, Category } from './types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

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
  const response = await fetch(`${API_URL}/api/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  if (!response.ok) throw new Error('Sessao invalida')
  return response.json()
}

export async function syncProfile(accessToken: string, profile: { email?: string; name?: string; pictureUrl?: string }) {
  const response = await fetch(`${API_URL}/api/profile/sync`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  })
  if (!response.ok) throw new Error('Erro ao sincronizar perfil')
  return response.json()
}
