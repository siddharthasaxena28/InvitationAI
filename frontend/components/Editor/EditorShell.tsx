'use client'

import { useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { Template } from '@/lib/types'

const FabricCanvas = dynamic(() => import('./FabricCanvas'), { ssr: false })
const Toolbar = dynamic(() => import('./Toolbar'), { ssr: false })
const LayerPanel = dynamic(() => import('./LayerPanel'), { ssr: false })
const TypographyPanel = dynamic(() => import('./TypographyPanel'), { ssr: false })
const ColorPanel = dynamic(() => import('./ColorPanel'), { ssr: false })
const MagicCopyPanel = dynamic(() => import('./MagicCopyPanel'), { ssr: false })

interface Layer {
  id: string
  type: string
  name?: string
  visible: boolean
  locked: boolean
}

interface CanvasObj {
  id?: string
  type?: string
  name?: string
  visible?: boolean
  lockMovementX?: boolean
  set: (k: string, v: unknown) => void
}

type FabricInstance = {
  getObjects: () => CanvasObj[]
  getActiveObject: () => CanvasObj | null
  setActiveObject: (o: unknown) => void
  renderAll: () => void
  on: (event: string, handler: () => void) => void
}

interface EditorShellProps {
  template: Template
}

export default function EditorShell({ template }: EditorShellProps) {
  const canvasRef = useRef<unknown>(null)
  const [layers, setLayers] = useState<Layer[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const syncLayers = useCallback((c: FabricInstance) => {
    setLayers(c.getObjects().map((obj, i) => ({
      id: obj.id || String(i),
      type: obj.type || 'object',
      name: obj.name,
      visible: obj.visible !== false,
      locked: obj.lockMovementX === true,
    })))
  }, [])

  const handleCanvasReady = useCallback((canvas: unknown) => {
    canvasRef.current = canvas
    const c = canvas as FabricInstance
    syncLayers(c)
    c.on('object:added', () => syncLayers(c))
    c.on('object:removed', () => syncLayers(c))
    c.on('object:modified', () => syncLayers(c))
    c.on('selection:created', () => {
      const obj = c.getActiveObject()
      setSelectedId(obj?.id || null)
    })
    c.on('selection:cleared', () => setSelectedId(null))
  }, [syncLayers])

  const handleSelectLayer = (id: string) => {
    if (!canvasRef.current) return
    const c = canvasRef.current as FabricInstance
    const obj = c.getObjects().find(o => o.id === id)
    if (obj) { c.setActiveObject(obj); c.renderAll() }
    setSelectedId(id)
  }

  const handleToggleVisibility = (id: string) => {
    if (!canvasRef.current) return
    const c = canvasRef.current as FabricInstance
    const obj = c.getObjects().find(o => o.id === id)
    if (obj) { obj.set('visible', obj.visible === false); c.renderAll(); syncLayers(c) }
  }

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
        canvasRef={canvasRef as React.MutableRefObject<unknown>}
        onDownloadFree={handleDownloadFree}
        onDownloadHd={handleDownloadHd}
      />

      <div className="flex flex-1 min-h-0">
        {/* Left panel */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0 p-3 space-y-4">
          <LayerPanel
            layers={layers}
            selectedId={selectedId}
            onSelect={handleSelectLayer}
            onToggleVisibility={handleToggleVisibility}
          />
          <TypographyPanel canvasRef={canvasRef as React.MutableRefObject<unknown>} />
          <ColorPanel canvasRef={canvasRef as React.MutableRefObject<unknown>} />
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <FabricCanvas
            initialJson={template.fabric_json}
            onReady={handleCanvasReady}
          />
        </div>

        {/* Right panel */}
        <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">{template.title}</h2>
            <p className="text-xs text-gray-400 capitalize mt-0.5">
              {template.occasion_slug.replace(/-/g, ' ')}
            </p>
          </div>
          <MagicCopyPanel occasion={template.occasion_slug} canvasRef={canvasRef as React.MutableRefObject<unknown>} />
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
