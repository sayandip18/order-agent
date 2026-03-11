import { useState, useEffect, useCallback } from 'react'

export interface CartItem {
  itemId: string
  name: string
  cost: number
  quantity: number
}

export interface Cart {
  items: CartItem[]
}

export function useCart() {
  const [cart, setCart] = useState<Cart>({ items: [] })
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    const res = await fetch('/cart', { credentials: 'include' })
    if (res.ok) setCart((await res.json()) as Cart)
  }, [])

  useEffect(() => { void fetchCart() }, [fetchCart])

  const addItem = useCallback(async (itemId: string, quantity = 1) => {
    setLoading(true)
    try {
      const res = await fetch('/cart', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity }),
      })
      if (res.ok) setCart((await res.json()) as Cart)
    } finally {
      setLoading(false)
    }
  }, [])

  const removeItem = useCallback(async (itemId: string) => {
    const res = await fetch(`/cart/${itemId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (res.ok) setCart((await res.json()) as Cart)
  }, [])

  const clearCart = useCallback(async () => {
    const res = await fetch('/cart', { method: 'DELETE', credentials: 'include' })
    if (res.ok) setCart({ items: [] })
  }, [])

  const total = cart.items.reduce((sum, i) => sum + i.cost * i.quantity, 0)
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0)

  return { cart, loading, addItem, removeItem, clearCart, total, itemCount }
}
