import Link from 'next/link'
import { OCCASIONS } from '@/lib/occasions'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Occasions — InviteAI',
  description: 'Browse invitation templates for all 28 Indian occasions',
}

export default function OccasionsPage() {
  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h1 className="font-display text-4xl font-bold text-gray-900 tracking-tight mb-2">All Occasions</h1>
          <p className="text-gray-500">28 categories · 200+ AI-generated invitation templates</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {OCCASIONS.map((occ) => (
            <Link
              key={occ.slug}
              href={`/occasions/${occ.slug}`}
              className="group flex flex-col items-center gap-3 p-5 bg-white rounded-xl border border-gray-100 hover:border-brand-indigo/40 hover:shadow-md hover:bg-indigo-50/20 transition-all duration-200"
            >
              <span className="text-4xl leading-none">{occ.emoji}</span>
              <span className="text-xs font-medium text-gray-600 text-center group-hover:text-brand-indigo leading-tight">
                {occ.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        <div className="bg-gray-950 rounded-2xl p-10 text-center text-white">
          <h2 className="font-display text-2xl font-bold mb-2">Don&apos;t see your occasion?</h2>
          <p className="text-gray-400 mb-6 text-sm">Our AI can craft a custom invitation for any event.</p>
          <Link
            href="/occasions/birthday-adult"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            Create custom invitation →
          </Link>
        </div>
      </div>
    </div>
  )
}
