'use client'

interface Layer {
  id: string
  type: string
  name?: string
  visible: boolean
  locked: boolean
}

interface LayerPanelProps {
  layers: Layer[]
  selectedId: string | null
  onSelect: (id: string) => void
  onToggleVisibility: (id: string) => void
}

function LayerIcon({ type }: { type: string }) {
  if (type === 'textbox' || type === 'text' || type === 'i-text') {
    return <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
  }
  if (type === 'image') {
    return <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth={2} /><circle cx="8.5" cy="8.5" r="1.5" strokeWidth={2} /><polyline points="21 15 16 10 5 21" strokeWidth={2} /></svg>
  }
  return <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth={2} /></svg>
}

export default function LayerPanel({ layers, selectedId, onSelect, onToggleVisibility }: LayerPanelProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-2">Layers</p>
      {layers.length === 0 && (
        <p className="text-xs text-gray-400 px-2 py-4 text-center">No layers</p>
      )}
      {[...layers].reverse().map((layer) => (
        <button
          key={layer.id}
          onClick={() => onSelect(layer.id)}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${
            selectedId === layer.id
              ? 'bg-indigo-50 text-brand-indigo'
              : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <span className="text-gray-400 shrink-0">
            <LayerIcon type={layer.type} />
          </span>
          <span className="flex-1 text-xs truncate">
            {layer.name || `${layer.type}`}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleVisibility(layer.id) }}
            className="p-0.5 hover:text-gray-900 transition-colors shrink-0"
            aria-label="Toggle visibility"
          >
            {layer.visible !== false ? (
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            ) : (
              <svg className="h-3 w-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            )}
          </button>
        </button>
      ))}
    </div>
  )
}
