import { useMemo, useState } from 'react'
import type { Order } from '../api'
import type { Product } from '../types'

export type LocalCartItem = Product & { quantity: number }

function createOrderFromCart(items: LocalCartItem[]): Order {
  const totalCents = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)

  return {
    orderId: `demo-${Date.now()}`,
    status: 'paid',
    totalCents,
    createdAt: new Date().toISOString(),
    items: items.map(item => ({
      productId: item.id,
      name: item.name,
      slug: item.slug,
      imageEmoji: item.imageEmoji,
      priceCents: item.priceCents,
      quantity: item.quantity,
      lineTotal: item.priceCents * item.quantity,
      sellerName: item.sellerName,
      rating: item.rating,
      reviewCount: item.reviewCount,
    })),
  }
}

export function useCart() {
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState<LocalCartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])
  const cartTotalCents = useMemo(() => cart.reduce((sum, item) => sum + item.priceCents * item.quantity, 0), [cart])

  function addToCart(product: Product) {
    setCart(items => items.some(item => item.id === product.id)
      ? items.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...items, { ...product, quantity: 1 }])
    setCartOpen(true)
  }

  function increaseQuantity(id: string) {
    setCart(items => items.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
  }

  function decreaseQuantity(id: string) {
    setCart(items => items.flatMap(item => item.id === id ? (item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : []) : [item]))
  }

  function removeFromCart(id: string) {
    setCart(items => items.filter(item => item.id !== id))
  }

  function confirmOrder() {
    if (!cart.length) return null
    const order = createOrderFromCart(cart)
    setOrders(current => [order, ...current])
    setCart([])
    setCartOpen(false)
    return order
  }

  return {
    cart,
    cartOpen,
    orders,
    cartCount,
    cartTotalCents,
    setCartOpen,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    confirmOrder,
  }
}
