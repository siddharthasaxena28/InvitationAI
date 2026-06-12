'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createPaymentOrder, verifyPayment } from '@/lib/api-client'
import type { RazorpayResponse } from '@/lib/types'

interface RazorpayButtonProps {
  templateId: string
  templateTitle: string
  amountInr: number
  email?: string
  onError?: (err: string) => void
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

export default function RazorpayButton({
  templateId,
  templateTitle,
  amountInr,
  email,
  onError,
}: RazorpayButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [scriptError, setScriptError] = useState(false)

  useEffect(() => {
    // Razorpay script might already be loaded
    if (window.Razorpay) { setScriptLoaded(true); return }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setScriptLoaded(true)
    script.onerror = () => {
      setScriptError(true)
      onError?.('Payment gateway unavailable. Please refresh and try again.')
    }
    document.body.appendChild(script)
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script)
    }
  }, [onError])

  const handlePayment = async () => {
    if (!scriptLoaded) {
      onError?.(scriptError ? 'Payment gateway failed to load. Please refresh.' : 'Payment gateway loading, please wait a moment.')
      return
    }
    setLoading(true)
    try {
      const order = await createPaymentOrder({
        template_id: templateId,
        amount_inr: amountInr,
        email,
      })

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || '',
        order_id: order.razorpay_order_id,
        amount: amountInr * 100,
        currency: 'INR',
        name: 'InviteAI',
        description: templateTitle,
        theme: { color: '#4F46E5' },
        prefill: email ? { email } : {},
        handler: async (response: RazorpayResponse) => {
          try {
            const result = await verifyPayment({
              ...response,
              order_id: order.order_id,
            })
            router.push(`/download/${result.order_id}?token=${result.download_token}`)
          } catch {
            onError?.('Payment verification failed. Please contact support@inviteai.in')
            setLoading(false)
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      })
      rzp.open()
    } catch (err) {
      setLoading(false)
      const msg = err instanceof Error ? err.message : 'Could not initiate payment. Please try again.'
      onError?.(msg)
    }
  }

  return (
    <Button size="lg" className="w-full text-base" onClick={handlePayment} loading={loading} disabled={scriptError}>
      {loading ? 'Processing...' : `Pay ₹${amountInr} with Razorpay`}
    </Button>
  )
}
