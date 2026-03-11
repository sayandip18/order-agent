import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import CartDrawer from '@/components/CartDrawer'
import { useCart } from '@/hooks/useCart'

interface Item {
  id: string
  name: string
  stock: number
  cost: number
}

export default function ShopPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [addingId, setAddingId] = useState<string | null>(null)

  const { cart, addItem, removeItem, clearCart, total, itemCount } = useCart()

  useEffect(() => {
    fetch('/items')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch items')
        return res.json() as Promise<Item[]>
      })
      .then(setItems)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setLoadingItems(false))
  }, [])

  async function handleAddToCart(item: Item) {
    setAddingId(item.id)
    await addItem(item.id, 1)
    setAddingId(null)
  }

  if (loadingItems) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
        <p className="text-sm text-neutral-400">Loading shop…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      <header className="bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-900">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 5.5A2.5 2.5 0 0 1 5.5 3h9A2.5 2.5 0 0 1 17 5.5v9a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 14.5v-9Z"
                stroke="white"
                strokeWidth="1.5"
              />
              <path d="M7 10h6M10 7v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-neutral-900">Order Agent</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-5">
          {/* Cart icon */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative text-neutral-500 hover:text-neutral-900 transition-colors"
            aria-label="Open cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] font-semibold leading-none">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>

          <a
            href="/auth/logout"
            className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            Sign out
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Shop</h1>
        <p className="text-sm text-neutral-500 mb-8">{items.length} items available</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>
                  {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-neutral-900">
                  ${Number(item.cost).toFixed(2)}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={item.stock === 0 || addingId === item.id}
                  onClick={() => void handleAddToCart(item)}
                >
                  {addingId === item.id
                    ? 'Adding…'
                    : item.stock === 0
                      ? 'Out of stock'
                      : 'Add to cart'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        total={total}
        onRemove={(id) => void removeItem(id)}
        onClear={() => void clearCart()}
      />
    </div>
  )
}
