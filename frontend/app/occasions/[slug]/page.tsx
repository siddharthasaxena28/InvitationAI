import { notFound } from 'next/navigation'
import { OCCASIONS } from '@/lib/occasions'
import FilterSidebar from '@/components/Gallery/FilterSidebar'
import TemplateGrid from '@/components/Gallery/TemplateGrid'
import type { Metadata } from 'next'

interface PageProps {
  params: { slug: string }
  searchParams: { style?: string; orientation?: string; sort?: string }
}

export async function generateStaticParams() {
  return OCCASIONS.map((occ) => ({ slug: occ.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const occ = OCCASIONS.find((o) => o.slug === params.slug)
  if (!occ) return {}
  return {
    title: `${occ.label} Invitation Templates — InviteAI`,
    description: occ.description,
  }
}

export default async function OccasionPage({ params, searchParams }: PageProps) {
  const occ = OCCASIONS.find((o) => o.slug === params.slug)
  if (!occ) notFound()

  return (
    <div>
      {/* Header */}
      <div
        className="py-12 px-4 text-center"
        style={{ background: `linear-gradient(135deg, ${occ.heroColor}15, ${occ.heroColor}05)` }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">{occ.emoji}</div>
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-3">
            {occ.label} Invitations
          </h1>
          <p className="text-gray-500 text-lg">{occ.description}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span>✨ AI-generated designs</span>
            <span>⚡ Free to customise</span>
            <span>📱 Share on WhatsApp</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          <FilterSidebar />
          <div className="flex-1 min-w-0">
            <TemplateGrid
              filters={{
                occasion: params.slug,
                style: searchParams.style ? [searchParams.style] : undefined,
                orientation: searchParams.orientation,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
