'use client'
import Link from 'next/link'
import { formatINR } from '@/lib/utils'
import type { Template } from '@/lib/types'

interface TemplateCardProps {
  template: Template
}

const PRICE_LABELS: Record<string, string> = {
  '0': 'Free',
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const bg = template.colour_palette?.[0] || '#4F46E5'
  const accent = template.colour_palette?.[1] || '#7C3AED'
  const text = template.colour_palette?.[3] || '#FFFFFF'
  const isPaid = template.price_inr > 0

  return (
    <Link href={`/editor/${template.id}`} className="group block">
      <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
        {/* Preview area */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {template.preview_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={template.preview_url}
              alt={template.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center"
              style={{ background: `linear-gradient(160deg, ${bg} 0%, ${accent} 100%)` }}
            >
              {/* Decorative border */}
              <div className="absolute inset-3 border rounded-xl opacity-30" style={{ borderColor: text }} />
              <div className="relative z-10 space-y-1.5" style={{ color: text }}>
                <p className="text-xs uppercase tracking-[0.2em] opacity-70">You are invited</p>
                <p className="font-display text-base font-bold leading-tight">{template.title}</p>
                <div className="w-10 h-px mx-auto my-2 opacity-40" style={{ backgroundColor: text }} />
                <p className="text-xs opacity-60 capitalize">{template.occasion_slug.replace(/-/g, ' ')}</p>
              </div>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-4 py-2 rounded-full shadow-sm">
              Customise →
            </span>
          </div>

          {/* Price badge */}
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              isPaid
                ? 'bg-white/90 backdrop-blur-sm text-gray-700'
                : 'bg-emerald-500 text-white'
            }`}>
              {isPaid ? `₹${template.price_inr}` : 'Free'}
            </span>
          </div>
        </div>

        {/* Card footer */}
        <div className="px-3.5 py-3">
          <p className="text-sm font-medium text-gray-900 truncate">{template.title}</p>
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            {template.style_tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[11px] text-gray-400">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
