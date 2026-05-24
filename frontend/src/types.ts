export type Product = {
  id: string
  name: string
  slug: string
  description: string
  imageEmoji: string
  priceCents: number
  oldPriceCents?: number | null
  stock: number
  rating: number
  reviewCount: number
  sellerName: string
  categorySlug: string
}

export type Category = {
  id: string
  name: string
  slug: string
  icon: string
}

export function cents(value: number) {
  return (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
