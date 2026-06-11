import Link from 'next/link'
import { OCCASIONS } from '@/lib/occasions'
import { MOCK_TEMPLATES } from '@/lib/mock-data'
import TemplateCard from '@/components/Gallery/TemplateCard'
import type { Template } from '@/lib/types'

async function getTrendingTemplates(): Promise<Template[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) throw new Error('No API URL configured')
    const res = await fetch(`${apiUrl}/api/templates?page=1&per_page=8`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error('API unavailable')
    const data = await res.json() as { items: Template[] }
    return data.items?.length ? data.items : MOCK_TEMPLATES.slice(0, 8)
  } catch {
    return MOCK_TEMPLATES.slice(0, 8)
  }
}

export default async function HomePage() {
  const trendingTemplates = await getTrendingTemplates()

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-violet-50 pt-16 pb-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-brand-indigo text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            ✨ AI-Powered Invitation Cards
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
            Create Beautiful<br />
            <span className="text-gradient">Digital Invitations</span><br />
            in Minutes
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            AI-generated invitation cards for every Indian occasion. Customise, download free watermarked, or get HD starting at{' '}
            <strong className="text-gray-700">₹29</strong>.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/occasions"
              className="inline-flex items-center justify-center gap-2 bg-brand-indigo text-white px-8 py-4 rounded-btn text-lg font-semibold hover:bg-brand-violet transition-colors shadow-lg hover:shadow-xl"
            >
              Browse Templates →
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-indigo border-2 border-brand-indigo px-8 py-4 rounded-btn text-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              See Pricing
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <span>⭐ 4.9/5 rating</span>
            <span>👥 50,000+ invitations created</span>
            <span>⚡ Free to start</span>
          </div>
        </div>
      </section>

      {/* Occasion Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-gray-900">Browse by Occasion</h2>
          <p className="text-gray-500 mt-2">28+ occasion categories · 200+ AI-generated templates</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {OCCASIONS.slice(0, 20).map((occ) => (
            <Link
              key={occ.slug}
              href={`/occasions/${occ.slug}`}
              className="group flex flex-col items-center gap-2 p-4 bg-white rounded-card border border-gray-100 hover:border-brand-indigo hover:shadow-card-hover transition-all duration-200"
            >
              <div className="text-4xl">{occ.emoji}</div>
              <p className="text-sm font-medium text-gray-700 text-center group-hover:text-brand-indigo">
                {occ.label}
              </p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/occasions" className="text-brand-indigo font-medium hover:underline text-sm">
            View all 28 occasions →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '🔍', title: 'Browse Templates', desc: 'Choose from 200+ AI-generated designs across 28 occasion categories' },
              { step: '02', icon: '✏️', title: 'Customise', desc: 'Edit text, change colours, upload your photo — all in our easy browser editor' },
              { step: '03', icon: '📱', title: 'Download & Share', desc: 'Free watermarked PNG instantly. Pay ₹29–149 for HD, share via WhatsApp' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-brand-indigo/10 rounded-2xl flex items-center justify-center text-3xl mb-4">
                  {icon}
                </div>
                <span className="text-xs font-bold text-brand-indigo uppercase tracking-widest mb-1">
                  Step {step}
                </span>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Templates */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold text-gray-900">Trending Templates</h2>
          <Link href="/occasions" className="text-brand-indigo font-medium hover:underline text-sm">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {trendingTemplates.map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>

      {/* Trust CTA */}
      <section className="bg-gradient-to-r from-brand-indigo to-brand-violet py-16 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-bold mb-4">India&apos;s Favourite Invitation Platform</h2>
          <p className="text-indigo-200 mb-8">Trusted by families, event planners, and businesses across India</p>
          <div className="grid grid-cols-3 gap-8 mb-8">
            {[
              { num: '50,000+', label: 'Invitations Created' },
              { num: '₹29', label: 'Starting Price' },
              { num: '28+', label: 'Occasion Types' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="text-3xl font-bold">{num}</div>
                <div className="text-indigo-200 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
          <Link
            href="/occasions"
            className="inline-flex items-center gap-2 bg-white text-brand-indigo px-8 py-3 rounded-btn font-semibold hover:bg-indigo-50 transition-colors"
          >
            Start Creating →
          </Link>
        </div>
      </section>
    </div>
  )
}
