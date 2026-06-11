'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

const STYLES = ['floral', 'minimal', 'bold', 'geometric', 'watercolor', 'modern']
const ORIENTATIONS = [
  { value: '', label: 'All' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'landscape', label: 'Landscape' },
]
const PRICE_TIERS = [
  { value: '', label: 'All Prices' },
  { value: '0', label: 'Free Only' },
  { value: '49', label: 'Under ₹49' },
  { value: '99', label: 'Under ₹99' },
]

export default function FilterSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) { params.set(key, value) } else { params.delete(key) }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])

  const currentOrientation = searchParams.get('orientation') || ''
  const currentPrice = searchParams.get('price_max') || ''
  const currentStyle = searchParams.get('style') || ''

  return (
    <aside className="w-56 shrink-0">
      <div className="sticky top-24 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Style</h3>
          <div className="flex flex-wrap gap-2">
            {STYLES.map(style => (
              <button
                key={style}
                onClick={() => updateFilter('style', currentStyle === style ? '' : style)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  currentStyle === style
                    ? 'bg-brand-indigo text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Orientation</h3>
          <div className="space-y-2">
            {ORIENTATIONS.map(o => (
              <label key={o.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="orientation"
                  value={o.value}
                  checked={currentOrientation === o.value}
                  onChange={() => updateFilter('orientation', o.value)}
                  className="text-brand-indigo"
                />
                <span className="text-sm text-gray-600">{o.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Price</h3>
          <div className="space-y-2">
            {PRICE_TIERS.map(tier => (
              <label key={tier.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  value={tier.value}
                  checked={currentPrice === tier.value}
                  onChange={() => updateFilter('price_max', tier.value)}
                  className="text-brand-indigo"
                />
                <span className="text-sm text-gray-600">{tier.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={() => router.push(pathname, { scroll: false })}
          className="w-full text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear all filters
        </button>
      </div>
    </aside>
  )
}
