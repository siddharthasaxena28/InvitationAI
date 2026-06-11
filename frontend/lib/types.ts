export interface Template {
  id: string
  occasion_slug: string
  title: string
  style_tags: string[]
  colour_palette: string[]
  orientation: 'portrait' | 'landscape' | 'square'
  price_inr: number
  preview_url: string | null
  hd_template_url: string | null
  fabric_json: Record<string, unknown> | null
  ai_prompt: string | null
  is_active: boolean
  created_at: string
}

export interface TemplateListResponse {
  items: Template[]
  total: number
  page: number
  per_page: number
}

export interface Order {
  id: string
  template_id: string
  user_id: string | null
  razorpay_order_id: string | null
  amount_inr: number
  status: 'pending' | 'paid' | 'failed'
  download_token: string | null
  email: string | null
  created_at: string
}

export interface User {
  id: string
  email: string
  name: string
  phone: string | null
  preferred_language: string
  created_at: string
}

export interface OccasionCategory {
  slug: string
  label: string
  emoji: string
  description: string
  heroColor: string
}

export interface PaymentOrder {
  razorpay_order_id: string
  amount_inr: number
  order_id: string
}

export interface StyleSuggestion {
  name: string
  palette: string[]
}

export interface MagicCopyResult {
  headline: string
  subheading: string
  body: string
  rsvp_line: string
  tagline: string
}

export interface TemplateFilters {
  occasion?: string
  style?: string[]
  price_max?: number
  orientation?: string
  page?: number
  per_page?: number
}

export interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}
