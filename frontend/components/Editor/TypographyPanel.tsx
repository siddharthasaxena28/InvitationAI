'use client'
import { Button } from '@/components/ui/button'

const FONTS = [
  'Inter', 'Playfair Display', 'Roboto', 'Open Sans',
  'Montserrat', 'Lato', 'Poppins', 'Merriweather',
  'Noto Sans', 'Noto Sans Devanagari',
]

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96]

type CanvasRef = React.MutableRefObject<{
  getActiveObject: () => Record<string, unknown> | null
  renderAll: () => void
} | unknown>

interface TypographyPanelProps {
  canvasRef: CanvasRef
}

export default function TypographyPanel({ canvasRef }: TypographyPanelProps) {
  const getActiveText = () => {
    if (!canvasRef.current) return null
    const canvas = canvasRef.current as { getActiveObject: () => Record<string, unknown> | null }
    const obj = canvas.getActiveObject()
    if (!obj || !['textbox', 'text', 'i-text'].includes(String(obj.type))) return null
    return obj
  }

  const update = (props: Record<string, unknown>) => {
    const obj = getActiveText()
    if (!obj || !canvasRef.current) return
    const fabric = obj as { set: (p: Record<string, unknown>) => void }
    fabric.set(props)
    const canvas = canvasRef.current as { renderAll: () => void }
    canvas.renderAll()
  }

  const toggleStyle = (prop: string) => {
    const obj = getActiveText()
    if (!obj) return
    const current = obj[prop]
    if (prop === 'fontWeight') update({ fontWeight: current === 'bold' ? 'normal' : 'bold' })
    else if (prop === 'fontStyle') update({ fontStyle: current === 'italic' ? 'normal' : 'italic' })
    else if (prop === 'underline') update({ underline: !current })
  }

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Typography</p>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Font Family</label>
        <select
          className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-indigo bg-white"
          onChange={(e) => update({ fontFamily: e.target.value })}
          defaultValue=""
        >
          <option value="" disabled>Select font...</option>
          {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Font Size</label>
        <select
          className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-indigo bg-white"
          onChange={(e) => update({ fontSize: Number(e.target.value) })}
          defaultValue=""
        >
          <option value="" disabled>Select size...</option>
          {FONT_SIZES.map(s => <option key={s} value={s}>{s}px</option>)}
        </select>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Style</label>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleStyle('fontWeight')} title="Bold">
            <strong className="text-xs">B</strong>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleStyle('fontStyle')} title="Italic">
            <em className="text-xs">I</em>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleStyle('underline')} title="Underline">
            <span className="text-xs underline">U</span>
          </Button>
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Alignment</label>
        <div className="flex gap-1">
          {(['left', 'center', 'right'] as const).map(align => (
            <Button
              key={align}
              variant="ghost"
              size="icon"
              className="h-8 flex-1 text-xs"
              onClick={() => update({ textAlign: align })}
            >
              {align === 'left' ? '⬅' : align === 'center' ? '↔' : '➡'}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Text Color</label>
        <input
          type="color"
          defaultValue="#000000"
          className="w-full h-8 rounded-lg border border-gray-200 cursor-pointer"
          onChange={(e) => update({ fill: e.target.value })}
        />
      </div>
    </div>
  )
}
