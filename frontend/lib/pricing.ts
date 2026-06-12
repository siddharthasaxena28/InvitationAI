export interface PricingTier {
  price: number
  label: string
  features: string[]
  popular: boolean
}

export const PRICING_TIERS: PricingTier[] = [
  { price: 0, label: 'Free', features: ['Watermarked 1080px PNG', 'WhatsApp sharing'], popular: false },
  { price: 29, label: 'Basic', features: ['HD 2160px PNG', 'No watermark', 'Instant download'], popular: false },
  { price: 49, label: 'Standard', features: ['HD PNG + A4 PDF', 'No watermark', 'Email delivery'], popular: true },
  { price: 99, label: 'Premium', features: ['HD PNG + PDF + 3 sizes', 'Priority support'], popular: false },
  { price: 149, label: 'Elite', features: ['Everything in Premium', 'Animated GIF', 'WhatsApp send'], popular: false },
]
