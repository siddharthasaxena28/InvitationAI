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

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setScriptLoaded(true)
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  const handlePayment = async () => {
    if (!scriptLoaded) {
      onError?.('Payment gateway loading, please wait a moment.')
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
    } catch {
      setLoading(false)
      onError?.('Could not initiate payment. Please try again.')
    }
  }

  return (
    <Button size="lg" className="w-full text-base" onClick={handlePayment} loading={loading}>
      {loading ? 'Processing...' : `Pay ₹${amountInr} with Razorpay`}
    </Button>
  )
}
