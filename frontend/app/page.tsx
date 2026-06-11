import Link from 'next/link'
import { OCCASIONS } from '@/lib/occasions'
import { MOCK_TEMPLATES } from '@/lib/mock-data'
import TemplateCard from '@/components/Gallery/TemplateCard'
import type { Template } from '@/lib/types'

async function getTrendingTemplates(): Promise<Template[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) throw new Error('no api')
    const res = await fetch(`${apiUrl}/api/templates?page=1&per_page=8`, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error('api error')
    const data = await res.json() as { items: Template[] }
    return data.items?.length ? data.items : MOCK_TEMPLATES.slice(0, 8)
  } catch {
    return MOCK_TEMPLATES.slice(0, 8)
  }
}

export default async function HomePage() {
  const trendingTemplates = await getTrendingTemplates()

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#FAFAFA] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-brand-indigo text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              AI-Powered · Made for India
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-950 leading-[1.05] tracking-tight">
              Beautiful invitations<br />
              <span className="text-brand-indigo">for every occasion</span>
            </h1>
            <p className="mt-6 text-xl text-gray-500 leading-relaxed max-w-xl">
              AI-generated invitation cards for weddings, birthdays, festivals, and 25+ more Indian occasions. Customise in minutes, share instantly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/occasions"
                className="inline-flex items-center gap-2 bg-brand-indigo text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-brand-violet transition-colors shadow-sm"
              >
                Browse templates
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-lg text-sm font-semibold hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                View pricing
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> Free watermarked preview</span>
              <span className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> HD from ₹29</span>
              <span className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> Share on WhatsApp</span>
            </div>
          </div>
        </div>
        {/* Decorative background */}
        <div className="hidden lg:block absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-indigo-50/60 to-transparent pointer-events-none" />
      </section>

      {/* Social proof bar */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-center">
            {[
              { num: '50,000+', label: 'Invitations created' },
              { num: '28+', label: 'Occasion types' },
              { num: '200+', label: 'AI templates' },
              { num: '4.9/5', label: 'Customer rating' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold text-gray-900 font-display">{num}</div>
                <div className="text-xs text-gray-400 mt-0.5 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Occasions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl font-bold text-gray-900 tracking-tight">Browse by occasion</h2>
            <p className="text-gray-500 mt-2">28 categories · hundreds of templates</p>
          </div>
          <Link href="/occasions" className="hidden sm:block text-sm font-medium text-brand-indigo hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {OCCASIONS.slice(0, 18).map((occ) => (
            <Link
              key={occ.slug}
              href={`/occasions/${occ.slug}`}
              className="group flex flex-col items-center gap-2.5 p-4 bg-white rounded-xl border border-gray-100 hover:border-brand-indigo/30 hover:bg-indigo-50/30 hover:shadow-sm transition-all duration-200"
            >
              <span className="text-3xl leading-none">{occ.emoji}</span>
              <span className="text-xs font-medium text-gray-600 text-center group-hover:text-brand-indigo leading-tight">
                {occ.label}
              </span>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6 sm:hidden">
          <Link href="/occasions" className="text-sm font-medium text-brand-indigo hover:underline">View all 28 occasions →</Link>
        </div>
      </section>

      {/* Trending Templates */}
      <section className="bg-gray-50 border-y border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-gray-900 tracking-tight">Trending templates</h2>
              <p className="text-gray-500 mt-2">Our most-loved designs this week</p>
            </div>
            <Link href="/occasions" className="hidden sm:block text-sm font-medium text-brand-indigo hover:underline">
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
            {trendingTemplates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl font-bold text-gray-900 tracking-tight">How it works</h2>
          <p className="text-gray-500 mt-2">From blank to beautiful in three steps</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {[
            {
              n: '1',
              title: 'Choose a template',
              desc: 'Browse 200+ AI-generated designs across 28 occasion categories. Filter by style, colour, and orientation.',
            },
            {
              n: '2',
              title: 'Customise it',
              desc: 'Edit names, dates, and venues. Change colours and fonts. Let AI write personalised invitation text for you.',
            },
            {
              n: '3',
              title: 'Download and share',
              desc: 'Get a free watermarked PNG instantly. Pay ₹29–149 for HD quality, then share directly on WhatsApp.',
            },
          ].map(({ n, title, desc }) => (
            <div key={n} className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-indigo text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {n}
                </div>
                <div className="h-px flex-1 bg-gray-200 hidden md:block" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="font-display text-4xl font-bold mb-4 tracking-tight">
            Ready to create your invitation?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Join 50,000+ families across India who trust InviteAI for their celebrations.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/occasions"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Start for free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 border border-gray-700 text-gray-300 px-6 py-3 rounded-lg text-sm font-semibold hover:border-gray-500 hover:text-white transition-colors"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
