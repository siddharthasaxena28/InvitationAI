'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getToken } from '@/lib/auth'
import { formatINR } from '@/lib/utils'
import type { Order } from '@/lib/types'

export default function MyDesignsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }
    setLoggedIn(true)
    const fetchOrders = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const res = await fetch(`${apiUrl}/api/users/me/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error()
        const data = await res.json() as Order[]
        setOrders(data)
      } catch {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (!loggedIn) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">Sign in to view your designs</h1>
        <p className="text-gray-500 mb-8">Access all your purchased and downloaded invitation templates.</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-brand-indigo text-white px-8 py-3 rounded-btn font-semibold hover:bg-brand-violet transition-colors"
        >
          Sign In
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="h-8 bg-gray-100 rounded animate-pulse w-48 mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">🎨</div>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">No designs yet</h1>
        <p className="text-gray-500 mb-8">
          Browse our template gallery and create your first invitation!
        </p>
        <Link
          href="/occasions"
          className="inline-flex items-center gap-2 bg-brand-indigo text-white px-8 py-3 rounded-btn font-semibold hover:bg-brand-violet transition-colors"
        >
          Browse Templates →
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">My Designs</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {orders.map((order) => (
          <div key={order.id} className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-card-hover transition-all">
            <div className="aspect-square bg-gray-50 relative">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL || ''}/api/templates/${order.template_id}/preview`}
                alt="Invitation preview"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-500 mb-1">
                {new Date(order.created_at || '').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  order.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {order.status === 'paid' ? `${formatINR(order.amount_inr)} paid` : 'Free'}
                </span>
                {order.status === 'paid' && order.download_token && (
                  <Link
                    href={`/download/${order.id}?token=${order.download_token}`}
                    className="text-xs text-brand-indigo hover:underline font-medium"
                  >
                    Download
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
