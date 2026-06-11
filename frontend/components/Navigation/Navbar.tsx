import Link from 'next/link'
import { OCCASIONS } from '@/lib/occasions'

export default function Navbar() {
  const topOccasions = OCCASIONS.slice(0, 5)

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold text-brand-indigo">InviteAI</span>
            <span className="hidden sm:block text-xs text-gray-400 font-sans">India&apos;s Invitation Platform</span>
          </Link>

          <div className="hidden md:flex items-center gap-5">
            {topOccasions.map(o => (
              <Link
                key={o.slug}
                href={`/occasions/${o.slug}`}
                className="text-sm text-gray-600 hover:text-brand-indigo transition-colors"
              >
                {o.emoji} {o.label}
              </Link>
            ))}
            <Link href="/occasions" className="text-sm text-brand-indigo font-medium hover:underline">
              All →
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-brand-indigo hidden sm:block">
              Pricing
            </Link>
            <Link
              href="/my-designs"
              className="text-sm bg-brand-indigo text-white px-4 py-2 rounded-btn hover:bg-brand-violet transition-colors"
            >
              My Designs
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
