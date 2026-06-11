'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { Template } from '@/lib/types'

const FabricCanvas = dynamic(() => import('./FabricCanvas'), { ssr: false })
const Toolbar = dynamic(() => import('./Toolbar'), { ssr: false })
const LayerPanel = dynamic(() => import('./LayerPanel'), { ssr: false })
const TypographyPanel = dynamic(() => import('./TypographyPanel'), { ssr: false })
const ColorPanel = dynamic(() => import('./ColorPanel'), { ssr: false })
const MagicCopyPanel = dynamic(() => import('./MagicCopyPanel'), { ssr: false })

interface EditorShellProps {
  template: Template
}

export default function EditorShell({ template }: EditorShellProps) {
  const canvasRef = useRef<unknown>(null)

  const handleDownloadFree = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    window.open(`${apiUrl}/api/render/preview?template_id=${template.id}`, '_blank')
  }

  const handleDownloadHd = () => {
    window.location.href = `/checkout/${template.id}`
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-100">
      <Toolbar
        canvasRef={canvasRef}
        onDownloadFree={handleDownloadFree}
        onDownloadHd={handleDownloadHd}
      />

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

        {/* Right panel */}
        <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">{template.title}</h2>
            <p className="text-xs text-gray-400 capitalize mt-0.5">
              {template.occasion_slug.replace(/-/g, ' ')}
            </p>
          </div>
          <MagicCopyPanel occasionSlug={template.occasion_slug} />
          <div className="p-4 border-t border-gray-100">
            <Link
              href={`/checkout/${template.id}`}
              className="block w-full text-center bg-brand-indigo text-white py-3 rounded-xl text-sm font-semibold hover:bg-brand-violet transition-colors"
            >
              Download HD — from ₹29
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
