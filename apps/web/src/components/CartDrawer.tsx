import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import type { Cart } from '@/hooks/useCart'

interface Props {
  open: boolean
  onClose: () => void
  cart: Cart
  total: number
  onRemove: (itemId: string) => void
  onClear: () => void
  onOrderPlaced: () => void
}

export default function CartDrawer({
  open,
  onClose,
  cart,
  total,
  onRemove,
  onClear,
  onOrderPlaced,
}: Props) {
  const isEmpty = cart.items.length === 0
  const [placing, setPlacing] = useState(false)
  const navigate = useNavigate()

  async function handleCheckout() {
    setPlacing(true)
    try {
      const res = await fetch('/orders', {
        method: 'POST',
        credentials: 'include',
      })
      if (res.ok) {
        onOrderPlaced()
        onClose()
        void navigate('/orders')
      }
    } finally {
      setPlacing(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <SheetContent
        side="right"
        className="w-full sm:w-[400px] flex flex-col gap-0 p-0 bg-white"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-neutral-100">
          <SheetTitle className="text-base font-semibold text-neutral-900">
            Cart{!isEmpty && <span className="text-neutral-400 font-normal"> ({cart.items.length})</span>}
          </SheetTitle>
        </SheetHeader>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 py-16">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-neutral-300">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="text-sm text-neutral-400">Your cart is empty</p>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {cart.items.map((item) => (
                <li key={item.itemId} className="flex items-center justify-between py-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{item.name}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      ${item.cost.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-sm font-medium text-neutral-900">
                      ${(item.cost * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => onRemove(item.itemId)}
                      className="text-neutral-300 hover:text-neutral-500 transition-colors"
                      aria-label={`Remove ${item.name}`}
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M3 3l9 9M12 3l-9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="px-6 py-5 border-t border-neutral-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">Total</span>
              <span className="text-base font-semibold text-neutral-900">${total.toFixed(2)}</span>
            </div>
            <Button
              className="w-full"
              disabled={placing}
              onClick={() => void handleCheckout()}
            >
              {placing ? 'Placing order…' : 'Place order'}
            </Button>
            <button
              onClick={onClear}
              className="w-full text-xs text-neutral-400 hover:text-neutral-600 transition-colors py-1"
            >
              Clear cart
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
