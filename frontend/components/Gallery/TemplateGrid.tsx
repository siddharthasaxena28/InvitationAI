'use client'
import { useTemplates } from '@/lib/queries'
import TemplateCard from './TemplateCard'
import { Skeleton } from '@/components/ui/skeleton'
import type { TemplateFilters } from '@/lib/types'

interface TemplateGridProps {
  filters: TemplateFilters
}

export default function TemplateGrid({ filters }: TemplateGridProps) {
  const { data, isLoading, error } = useTemplates(filters)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-card overflow-hidden">
            <Skeleton className="aspect-[4/5] w-full" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error || !data?.items?.length) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-4xl mb-4">🎨</p>
        <p className="text-lg font-medium">No templates found</p>
        <p className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-400 mb-4">{data.total} templates found</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.items.map(template => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  )
}
