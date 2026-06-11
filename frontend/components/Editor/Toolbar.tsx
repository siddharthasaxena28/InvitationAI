'use client'
import { Button } from '@/components/ui/button'
import { useEditorStore } from '@/lib/store'

interface ToolbarProps {
  canvasRef: React.MutableRefObject<unknown>
  onDownloadFree: () => void
  onDownloadHd: () => void
}

export default function Toolbar({ canvasRef, onDownloadFree, onDownloadHd }: ToolbarProps) {
  const { undo, redo, history, historyIndex } = useEditorStore()

  const handleUndo = () => {
    const json = undo()
    if (json && canvasRef.current) {
      const canvas = canvasRef.current as { loadFromJSON: (j: unknown, cb: () => void) => void; renderAll: () => void }
      canvas.loadFromJSON(json, () => canvas.renderAll())
    }
  }

  const handleRedo = () => {
    const json = redo()
    if (json && canvasRef.current) {
      const canvas = canvasRef.current as { loadFromJSON: (j: unknown, cb: () => void) => void; renderAll: () => void }
      canvas.loadFromJSON(json, () => canvas.renderAll())
    }
  }

  const handleZoom = (delta: number) => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current as { getZoom: () => number; setZoom: (z: number) => void; renderAll: () => void }
    const zoom = Math.max(0.3, Math.min(3, canvas.getZoom() + delta))
    canvas.setZoom(zoom)
    canvas.renderAll()
  }

  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-white border-b border-gray-100 shadow-sm">
      <Button variant="ghost" size="icon" onClick={handleUndo} disabled={historyIndex <= 0} title="Undo (Ctrl+Z)">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      </Button>
      <Button variant="ghost" size="icon" onClick={handleRedo} disabled={historyIndex >= history.length - 1} title="Redo">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
        </svg>
      </Button>
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <Button variant="ghost" size="icon" onClick={() => handleZoom(0.1)} title="Zoom in">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
      </Button>
      <Button variant="ghost" size="icon" onClick={() => handleZoom(-0.1)} title="Zoom out">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
        </svg>
      </Button>
      <div className="flex-1" />
      <Button variant="outline" size="sm" onClick={onDownloadFree} className="text-sm">
        Download Free
      </Button>
      <Button size="sm" onClick={onDownloadHd} className="text-sm">
        Download HD — ₹49
      </Button>
    </div>
  )
}
