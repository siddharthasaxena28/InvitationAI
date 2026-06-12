'use client'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface MagicCopyPanelProps {
  occasion: string
  canvasRef: React.MutableRefObject<unknown>
  onClose?: () => void
}

export default function MagicCopyPanel({ occasion, canvasRef, onClose }: MagicCopyPanelProps) {
  const [hostName, setHostName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [venue, setVenue] = useState('')
  const [context, setContext] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState('')
  const [parsed, setParsed] = useState<Record<string, string> | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => { abortRef.current?.abort() }
  }, [])

  const generate = async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setGenerating(true)
    setGenerated('')
    setParsed(null)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/ai/generate-copy`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            occasion,
            host_name: hostName,
            event_date: eventDate,
            venue,
            additional_context: context || null,
          }),
          signal: controller.signal,
        }
      )

      const body = res.body
      if (!body) {
        setGenerated('Error: No response from server. Please try again.')
        return
      }
      const reader = body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split('\n\n')
        buffer = parts.pop() || ''
        for (const part of parts) {
          if (part.startsWith('data: ')) {
            const data = part.slice(6).trim()
            if (data === '[DONE]') continue
            try {
              const chunk = JSON.parse(data) as { text?: string }
              fullText += chunk.text || ''
            } catch { /* partial chunk */ }
          }
        }
        setGenerated(fullText)
      }

      try { setParsed(JSON.parse(fullText)) } catch { /* not JSON yet */ }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      setGenerated('Error generating copy. Please check your API connection.')
    } finally {
      setGenerating(false)
    }
  }

  const applyToCanvas = () => {
    if (!parsed || !canvasRef.current) return
    const canvas = canvasRef.current as {
      getObjects: () => Array<{ type: string; set: (k: string, v: string) => void }>
      renderAll: () => void
    }
    const objects = canvas.getObjects()
    const textObjects = objects.filter(o => ['textbox', 'text', 'i-text'].includes(o.type))

    if (textObjects[0] && parsed.headline) textObjects[0].set('text', parsed.headline)
    if (textObjects[1] && parsed.subheading) textObjects[1].set('text', parsed.subheading)
    if (textObjects[2]) textObjects[2].set('text', parsed.body || `📅 ${eventDate}\n📍 ${venue}`)
    if (textObjects[3] && parsed.rsvp_line) textObjects[3].set('text', parsed.rsvp_line)

    canvas.renderAll()
    onClose?.()
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">✨</span>
        <p className="text-sm text-gray-500">Enter your event details and AI will write beautiful invitation text.</p>
      </div>

      <Input
        placeholder="Your name / Host name"
        value={hostName}
        onChange={e => setHostName(e.target.value)}
      />
      <Input
        placeholder="Event date (e.g. 15 Aug 2026)"
        value={eventDate}
        onChange={e => setEventDate(e.target.value)}
      />
      <Input
        placeholder="Venue / Location"
        value={venue}
        onChange={e => setVenue(e.target.value)}
      />
      <Input
        placeholder="Additional details (optional)"
        value={context}
        onChange={e => setContext(e.target.value)}
      />

      <Button onClick={generate} loading={generating} className="w-full" size="sm">
        {generating ? 'Generating...' : '✨ Generate Invitation Text'}
      </Button>

      {generated && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto border border-gray-200">
          {generated}
        </div>
      )}

      {parsed && (
        <Button onClick={applyToCanvas} variant="secondary" size="sm" className="w-full">
          Apply to Canvas
        </Button>
      )}
    </div>
  )
}
