import Link from 'next/link'
import { OCCASIONS } from '@/lib/occasions'

export const metadata = {
  title: 'All Occasions — InviteAI',
  description: 'Browse invitation templates for all 28 Indian occasions',
}

export default function OccasionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-3">
          All Occasions
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Choose your occasion and discover hundreds of AI-generated invitation templates, perfect for every celebration.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {OCCASIONS.map((occ) => (
          <Link
            key={occ.slug}
            href={`/occasions/${occ.slug}`}
            className="group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 hover:border-brand-indigo hover:shadow-lg transition-all duration-200"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${occ.heroColor}20` }}
            >
              {occ.emoji}
            </div>
            <p className="text-sm font-medium text-gray-700 text-center group-hover:text-brand-indigo leading-tight">
              {occ.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-16 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl p-10 text-center">
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">
          Can&apos;t find your occasion?
        </h2>
        <p className="text-gray-500 mb-6">
          Our AI can create a custom invitation for any event. Tell us about your celebration.
        </p>
        <Link
          href="/occasions/birthday-adult"
          className="inline-flex items-center gap-2 bg-brand-indigo text-white px-6 py-3 rounded-btn font-semibold hover:bg-brand-violet transition-colors"
        >
          Create Custom Invitation →
        </Link>
      </div>
    </div>
  )
}
