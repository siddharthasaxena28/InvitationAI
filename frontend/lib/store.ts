import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface HistoryEntry {
  json: Record<string, unknown>
  timestamp: number
}

interface EditorState {
  templateId: string | null
  fabricJson: Record<string, unknown> | null
  customisations: Record<string, string>
  history: HistoryEntry[]
  historyIndex: number
  isDirty: boolean
  selectedObjectId: string | null

  setTemplate: (id: string, json: Record<string, unknown>) => void
  updateFabricJson: (json: Record<string, unknown>) => void
  pushHistory: (json: Record<string, unknown>) => void
  undo: () => Record<string, unknown> | null
  redo: () => Record<string, unknown> | null
  applyCustomisation: (key: string, value: string) => void
  setSelectedObjectId: (id: string | null) => void
  reset: () => void
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      templateId: null,
      fabricJson: null,
      customisations: {},
      history: [],
      historyIndex: -1,
      isDirty: false,
      selectedObjectId: null,

      setTemplate: (id, json) => set({
        templateId: id,
        fabricJson: json,
        history: [{ json, timestamp: Date.now() }],
        historyIndex: 0,
        isDirty: false,
        customisations: {},
      }),

      updateFabricJson: (json) => set({ fabricJson: json, isDirty: true }),

      pushHistory: (json) => set(state => {
        const newHistory = state.history.slice(0, state.historyIndex + 1)
        newHistory.push({ json, timestamp: Date.now() })
        const trimmed = newHistory.slice(-20)
        return {
          history: trimmed,
          historyIndex: trimmed.length - 1,
          fabricJson: json,
          isDirty: true,
        }
      }),

      undo: () => {
        const { history, historyIndex } = get()
        if (historyIndex <= 0) return null
        const newIndex = historyIndex - 1
        const entry = history[newIndex]
        set({ historyIndex: newIndex, fabricJson: entry.json })
        return entry.json
      },

      redo: () => {
        const { history, historyIndex } = get()
        if (historyIndex >= history.length - 1) return null
        const newIndex = historyIndex + 1
        const entry = history[newIndex]
        set({ historyIndex: newIndex, fabricJson: entry.json })
        return entry.json
      },

      applyCustomisation: (key, value) => set(state => ({
        customisations: { ...state.customisations, [key]: value },
        isDirty: true,
      })),

      setSelectedObjectId: (id) => set({ selectedObjectId: id }),

      reset: () => set({
        templateId: null, fabricJson: null, customisations: {},
        history: [], historyIndex: -1, isDirty: false, selectedObjectId: null,
      }),
    }),
    {
      name: 'inviteai-editor',
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null
          const str = sessionStorage.getItem(name)
          return str ? JSON.parse(str) : null
        },
        setItem: (name, value) => {
          if (typeof window !== 'undefined') sessionStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          if (typeof window !== 'undefined') sessionStorage.removeItem(name)
        },
      },
    }
  )
)
