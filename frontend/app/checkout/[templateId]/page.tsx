'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useTemplate } from '@/lib/queries'
import PricingTiers from '@/components/Checkout/PricingTiers'
import RazorpayButton from '@/components/Checkout/RazorpayButton'
import WhatsAppShare from '@/components/Share/WhatsAppShare'
import EmailShare from '@/components/Share/EmailShare'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

export default function CheckoutPage() {
  const params = useParams()
  const templateId = params.templateId as string
  const { data: template, isLoading } = useTemplate(templateId)

  const [selectedPrice, setSelectedPrice] = useState(49)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-100 rounded-2xl aspect-square animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
          </div>
        </div>
      </div>
    )
  }

  if (!template) return null

  const previewUrl = template.preview_url || `https://placehold.co/400x400/${template.colour_palette?.[0]?.replace('#', '') || '4F46E5'}/FFFFFF?text=${encodeURIComponent(template.title)}`

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Preview */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg bg-gray-50 mb-4">
            <Image
              src={previewUrl}
              alt={template.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex gap-2">
            <WhatsAppShare
              eventTitle={template.title}
              downloadUrl={`${process.env.NEXT_PUBLIC_API_URL || ''}/api/templates/${template.id}/preview`}
            />
            <EmailShare
              templateTitle={template.title}
              downloadUrl={`${process.env.NEXT_PUBLIC_API_URL || ''}/api/templates/${template.id}/preview`}
            />
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-1">{template.title}</h1>
          <p className="text-gray-500 mb-6 capitalize">{template.occasion_slug.replace(/-/g, ' ')}</p>

          <PricingTiers selected={selectedPrice} onSelect={setSelectedPrice} />

          <div className="mt-6">
            <Input
              label="Email (optional — for delivery)"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && (
            <p className="mt-3 text-red-500 text-sm">{error}</p>
          )}

          <div className="mt-6">
            {selectedPrice === 0 ? (
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/render/preview?template_id=${template.id}`}
                download
                className="block w-full"
              >
                <button className="w-full bg-brand-indigo text-white py-4 rounded-btn text-lg font-semibold hover:bg-brand-violet transition-colors">
                  Download Free (Watermarked)
                </button>
              </a>
            ) : (
              <RazorpayButton
                templateId={template.id}
                templateTitle={template.title}
                amountInr={selectedPrice}
                email={email || undefined}
                onError={setError}
              />
            )}
          </div>

          <p className="mt-4 text-xs text-gray-400 text-center">
            Payments secured by Razorpay · Instant download after payment
          </p>
        </div>
      </div>
    </div>
  )
}
