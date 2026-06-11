'use client'

const PALETTE_PRESETS = [
  { name: 'Indigo', colors: ['#4F46E5', '#7C3AED', '#EEF2FF', '#FFFFFF'] },
  { name: 'Rose', colors: ['#E11D48', '#BE185D', '#FCE7F3', '#FFFFFF'] },
  { name: 'Amber', colors: ['#F59E0B', '#D97706', '#FEF3C7', '#1F2937'] },
  { name: 'Emerald', colors: ['#059669', '#047857', '#ECFDF5', '#FFFFFF'] },
  { name: 'Violet', colors: ['#7C3AED', '#6D28D9', '#EDE9FE', '#FFFFFF'] },
  { name: 'Ocean', colors: ['#0EA5E9', '#0284C7', '#E0F2FE', '#FFFFFF'] },
]

type CanvasRef = React.MutableRefObject<unknown>

interface ColorPanelProps {
  canvasRef: CanvasRef
}

export default function ColorPanel({ canvasRef }: ColorPanelProps) {
  const applyToSelected = (color: string) => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current as {
      getActiveObject: () => ({ set: (k: string, v: string) => void } & Record<string, unknown>) | null
      renderAll: () => void
    }
    const obj = canvas.getActiveObject()
    if (obj) {
      obj.set('fill', color)
      canvas.renderAll()
    }
  }

  const applyPalette = (colors: string[]) => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current as {
      getObjects: () => Array<{ set: (k: string, v: string) => void } & Record<string, unknown>>
      renderAll: () => void
    }
    const objects = canvas.getObjects()
    if (objects[0]) objects[0].set('fill', colors[0])
    objects.slice(1).forEach((obj, i) => {
      if (['textbox', 'text', 'i-text'].includes(String(obj.type))) {
        obj.set('fill', i % 2 === 0 ? colors[3] || '#FFFFFF' : colors[2] || '#FFFFFF')
      }
    })
    canvas.renderAll()
  }

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Colors</p>

      <div>
        <label className="text-xs text-gray-500 mb-2 block">Apply to Selected Layer</label>
        <input
          type="color"
          className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer"
          onChange={(e) => applyToSelected(e.target.value)}
        />
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-2 block">Theme Presets</label>
        <div className="space-y-2">
          {PALETTE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPalette(preset.colors)}
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex gap-0.5">
                {preset.colors.map((c, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: c, border: '1px solid rgba(0,0,0,0.1)' }}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
