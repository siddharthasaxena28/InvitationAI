'use client'
import { useEffect, useRef, useCallback } from 'react'
import { useEditorStore } from '@/lib/store'

interface FabricCanvasProps {
  initialJson: Record<string, unknown> | null
  onReady?: (canvas: unknown) => void
  width?: number
  height?: number
}

export default function FabricCanvas({ initialJson, onReady, width = 800, height = 1200 }: FabricCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<unknown>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const { updateFabricJson, pushHistory, setSelectedObjectId } = useEditorStore()

  const getScale = useCallback(() => {
    if (!containerRef.current) return 1
    const containerWidth = containerRef.current.clientWidth
    return Math.min(1, containerWidth / width)
  }, [width])

  useEffect(() => {
    if (!canvasRef.current) return

    // Fabric.js must be imported dynamically — it accesses window at module init time
    import('fabric').then(({ fabric }: { fabric: Record<string, unknown> }) => {
      const FabricCanvas = fabric.Canvas as new (el: HTMLCanvasElement, opts: Record<string, unknown>) => {
        loadFromJSON: (json: unknown, cb: () => void) => void
        toJSON: (fields?: string[]) => Record<string, unknown>
        renderAll: () => void
        dispose: () => void
        getActiveObject: () => Record<string, unknown> | null
        getObjects: () => Array<Record<string, unknown>>
        on: (event: string, handler: (e: unknown) => void) => void
        getZoom: () => number
        setZoom: (zoom: number) => void
      }

      const canvas = new FabricCanvas(canvasRef.current!, {
        width,
        height,
        preserveObjectStacking: true,
        selection: true,
      })
      fabricRef.current = canvas

      if (initialJson && Object.keys(initialJson).length > 0) {
        canvas.loadFromJSON(initialJson, () => {
          canvas.renderAll()
          onReady?.(canvas)
        })
      } else {
        onReady?.(canvas)
      }

      canvas.on('object:modified', () => {
        const json = canvas.toJSON(['id', 'editable', 'name'])
        updateFabricJson(json)
        pushHistory(json)
      })

      canvas.on('selection:created', (e: unknown) => {
        const ev = e as { selected?: Array<{ id?: string }> }
        setSelectedObjectId(ev.selected?.[0]?.id ?? null)
      })

      canvas.on('selection:cleared', () => setSelectedObjectId(null))

      // Auto-save every 30 seconds
      autoSaveTimer.current = setInterval(() => {
        const json = canvas.toJSON(['id', 'editable', 'name'])
        updateFabricJson(json)
      }, 30000)
    })

    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current)
      if (fabricRef.current) {
        const canvas = fabricRef.current as { dispose: () => void }
        canvas.dispose()
        fabricRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run once on mount only

  const scale = getScale()

  return (
    <div
      ref={containerRef}
      className="w-full flex items-start justify-center overflow-auto bg-gray-100 rounded-xl p-4"
      style={{ minHeight: height * scale + 32 }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width,
          height,
          flexShrink: 0,
        }}
      >
        <canvas ref={canvasRef} className="shadow-2xl rounded-sm" />
      </div>
    </div>
  )
}
