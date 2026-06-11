import nextDynamic from 'next/dynamic'
import { MOCK_TEMPLATES } from '@/lib/mock-data'
import type { Template } from '@/lib/types'

export const dynamic = 'force-dynamic'

// All editor components are client-only (Fabric.js)
const FabricCanvas = nextDynamic(() => import('@/components/Editor/FabricCanvas'), { ssr: false })
const Toolbar = nextDynamic(() => import('@/components/Editor/Toolbar'), { ssr: false })
const LayerPanel = nextDynamic(() => import('@/components/Editor/LayerPanel'), { ssr: false })
const TypographyPanel = nextDynamic(() => import('@/components/Editor/TypographyPanel'), { ssr: false })
const ColorPanel = nextDynamic(() => import('@/components/Editor/ColorPanel'), { ssr: false })
const MagicCopyPanel = nextDynamic(() => import('@/components/Editor/MagicCopyPanel'), { ssr: false })

interface PageProps {
  params: { templateId: string }
}

async function getTemplate(id: string): Promise<Template | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const res = await fetch(`${apiUrl}/api/templates/${id}`, {
      cache: 'no-store',
    })
    if (!res.ok) throw new Error()
    return res.json() as Promise<Template>
  } catch {
    return MOCK_TEMPLATES.find((t) => t.id === id) || MOCK_TEMPLATES[0]
  }
}

export default async function EditorPage({ params }: PageProps) {
  const template = await getTemplate(params.templateId)
  if (!template) return null

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-100">
      {/* Toolbar */}
      <Toolbar template={template} />

      {/* Main editor area */}
      <div className="flex flex-1 min-h-0">
        {/* Left panel */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
          <div className="p-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Layers</p>
          </div>
          <LayerPanel />
          <div className="p-3 border-b border-t border-gray-100 mt-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Typography</p>
          </div>
          <TypographyPanel />
          <div className="p-3 border-b border-t border-gray-100 mt-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Colors</p>
          </div>
          <ColorPanel />
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <FabricCanvas template={template} />
        </div>

        {/* Right panel — Magic Copy */}
        <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
          <MagicCopyPanel occasionSlug={template.occasion_slug} />
        </div>
      </div>
    </div>
  )
}
