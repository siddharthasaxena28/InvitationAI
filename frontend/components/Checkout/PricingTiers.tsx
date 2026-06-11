'use client'
import { Badge } from '@/components/ui/badge'

export const PRICING_TIERS = [
  { price: 0, label: 'Free', features: ['Watermarked 1080px PNG', 'WhatsApp sharing'], popular: false },
  { price: 29, label: 'Basic', features: ['HD 2160px PNG', 'No watermark', 'Instant download'], popular: false },
  { price: 49, label: 'Standard', features: ['HD PNG + A4 PDF', 'No watermark', 'Email delivery'], popular: true },
  { price: 99, label: 'Premium', features: ['HD PNG + PDF + 3 sizes', 'Priority support'], popular: false },
  { price: 149, label: 'Elite', features: ['Everything in Premium', 'Animated GIF', 'WhatsApp send'], popular: false },
]

interface PricingTiersProps {
  selected: number
  onSelect: (price: number) => void
}

export default function PricingTiers({ selected, onSelect }: PricingTiersProps) {
  return (
    <div className="space-y-3">
      {PRICING_TIERS.map(tier => (
        <button
          key={tier.price}
          onClick={() => onSelect(tier.price)}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
            selected === tier.price
              ? 'border-brand-indigo bg-indigo-50'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selected === tier.price ? 'border-brand-indigo' : 'border-gray-300'
              }`}>
                {selected === tier.price && (
                  <div className="w-2 h-2 rounded-full bg-brand-indigo" />
                )}
              </div>
              <div>
                <span className="font-semibold text-gray-900">{tier.label}</span>
                {tier.popular && (
                  <Badge className="ml-2 text-xs">Most Popular</Badge>
                )}
              </div>
            </div>
            <span className="font-bold text-brand-indigo text-lg">
              {tier.price === 0 ? 'Free' : `₹${tier.price}`}
            </span>
          </div>
          <ul className="mt-2 ml-7 space-y-0.5">
            {tier.features.map(f => (
              <li key={f} className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="h-3 w-3 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </button>
      ))}
    </div>
  )
}
