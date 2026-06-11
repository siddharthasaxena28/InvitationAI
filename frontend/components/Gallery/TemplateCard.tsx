'use client'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { formatINR } from '@/lib/utils'
import type { Template } from '@/lib/types'

interface TemplateCardProps {
  template: Template
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const bgColor = template.colour_palette?.[0] || '#4F46E5'
  const textColor = template.colour_palette?.[3] || '#FFFFFF'
  const priceBadgeVariant = template.price_inr === 0 ? 'free' : template.price_inr >= 99 ? 'premium' : 'paid'

  return (
    <Link href={`/editor/${template.id}`} className="group block">
      <div className="relative rounded-card overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
        <div
          className="aspect-[4/5] relative flex flex-col items-center justify-center p-6"
          style={{ backgroundColor: bgColor }}
        >
          {template.preview_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={template.preview_url}
              alt={template.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="text-center" style={{ color: textColor }}>
              <p className="font-display text-xl font-bold leading-tight mb-2">You Are Invited!</p>
              <p className="text-sm opacity-80">{template.title}</p>
              <div className="mt-4 text-xs opacity-60 space-y-1">
                <p>📅 [Date]</p>
                <p>📍 [Venue]</p>
              </div>
            </div>
          )}
          <button
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            onClick={(e) => e.preventDefault()}
            aria-label="Add to favourites"
          >
            <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        <div className="p-3 bg-white">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-gray-900 line-clamp-1">{template.title}</p>
            <Badge variant={priceBadgeVariant} className="shrink-0">
              {formatINR(template.price_inr)}
            </Badge>
          </div>
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {template.style_tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-xs text-gray-400">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
