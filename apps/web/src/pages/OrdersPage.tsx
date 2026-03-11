import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type OrderStatus = 'processing' | 'on_the_way' | 'delivered' | 'canceled'

interface OrderLineItem {
  itemId: string
  name: string
  cost: number
  quantity: number
}

interface Order {
  id: string
  items: OrderLineItem[]
  orderDate: string
  status: OrderStatus
  total: number
}

const STATUS_META: Record<OrderStatus, { label: string; classes: string }> = {
  processing: {
    label: 'Processing',
    classes: 'bg-amber-50 text-amber-700 ring-amber-200',
  },
  on_the_way: {
    label: 'On the way',
    classes: 'bg-blue-50 text-blue-700 ring-blue-200',
  },
  delivered: {
    label: 'Delivered',
    classes: 'bg-green-50 text-green-700 ring-green-200',
  },
  canceled: {
    label: 'Canceled',
    classes: 'bg-neutral-100 text-neutral-500 ring-neutral-200',
  },
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, classes } = STATUS_META[status] ?? STATUS_META.processing
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ring-1 ring-inset ${classes}`}>
      {label}
    </span>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelingId, setCancelingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/orders/mine', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch orders')
        return res.json() as Promise<Order[]>
      })
      .then(setOrders)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Unknown error'),
      )
      .finally(() => setLoading(false))
  }, [])

  async function handleCancel(id: string) {
    setCancelingId(id)
    try {
      const res = await fetch(`/orders/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'canceled' }),
      })
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: 'canceled' } : o)),
        )
      }
    } finally {
      setCancelingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      {/* Header */}
      <header className="bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
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
        <div className="flex items-center gap-5">
          <Link
            to="/shop"
            className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            Shop
          </Link>
          <a
            href="/auth/logout"
            className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            Sign out
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Your orders</h1>
        <p className="text-sm text-neutral-500 mb-8">
          {loading ? '' : `${orders.length} order${orders.length !== 1 ? 's' : ''}`}
        </p>

        {loading && (
          <p className="text-sm text-neutral-400">Loading…</p>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-neutral-300">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p className="text-sm text-neutral-400">No orders yet</p>
            <Link
              to="/shop"
              className="text-xs text-neutral-900 underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              Start shopping
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <ul className="space-y-3">
            {orders.map((order) => {
              const date = new Date(order.orderDate)
              const summary = order.items
                .map((i) => `${i.name} ×${i.quantity}`)
                .join(', ')

              return (
                <li
                  key={order.id}
                  className="bg-white rounded-xl ring-1 ring-neutral-100 px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Left */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-neutral-400">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-neutral-800 truncate">{summary}</p>
                    <p className="text-xs text-neutral-400">
                      {date.toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      at{' '}
                      {date.toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Right */}
                  <div className="shrink-0 text-right space-y-1.5">
                    <p className="text-base font-semibold text-neutral-900">
                      ${order.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} item
                      {order.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
                    </p>
                    {(order.status === 'processing' || order.status === 'on_the_way') && (
                      <button
                        onClick={() => void handleCancel(order.id)}
                        disabled={cancelingId === order.id}
                        className="text-xs text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-50"
                      >
                        {cancelingId === order.id ? 'Canceling…' : 'Cancel order'}
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </main>
    </div>
  )
}
