'use client'
import { useState } from 'react'
import Link from 'next/link'
import { OCCASIONS } from '@/lib/occasions'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const featured = OCCASIONS.slice(0, 5)

  return (
    <header className="sticky top-0 z-50">
      <div className="h-0.5 bg-gradient-to-r from-brand-indigo to-brand-violet" />
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="text-xl font-display font-bold text-brand-indigo tracking-tight">InviteAI</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {featured.map(o => (
                <Link
                  key={o.slug}
                  href={`/occasions/${o.slug}`}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-brand-indigo hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {o.label}
                </Link>
              ))}
              <Link href="/occasions" className="px-3 py-2 text-sm font-medium text-brand-indigo hover:bg-indigo-50 rounded-lg transition-colors">
                All occasions
              </Link>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <Link href="/pricing" className="hidden sm:block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <Link href="/my-designs" className="hidden sm:block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                My Designs
              </Link>
              <Link
                href="/occasions"
                className="inline-flex items-center gap-1.5 bg-brand-indigo text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-violet transition-colors"
              >
                Create Free
              </Link>
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden py-3 border-t border-gray-100 space-y-1">
              {OCCASIONS.slice(0, 8).map(o => (
                <Link
                  key={o.slug}
                  href={`/occasions/${o.slug}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{o.emoji}</span>{o.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-100 flex gap-2">
                <Link href="/pricing" className="flex-1 text-center py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>Pricing</Link>
                <Link href="/my-designs" className="flex-1 text-center py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>My Designs</Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
