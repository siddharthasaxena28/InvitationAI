'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type RsvpResponse = 'yes' | 'no' | 'maybe'
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function RsvpPage() {
  const params = useParams()
  const token = params.token as string

  const [response, setResponse] = useState<RsvpResponse | null>(null)
  const [guestEmail, setGuestEmail] = useState('')
  const [guestName, setGuestName] = useState('')
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    if (!response || !guestEmail.trim()) return
    setStatus('submitting')
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/share/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          guest_email: guestEmail.trim(),
          guest_name: guestName.trim() || undefined,
          response,
          message: message.trim() || undefined,
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const responseOptions: { value: RsvpResponse; label: string; emoji: string; color: string }[] = [
    { value: 'yes', label: 'Yes, I\'ll be there!', emoji: '🎉', color: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
    { value: 'maybe', label: 'Maybe', emoji: '🤔', color: 'border-amber-400 bg-amber-50 text-amber-700' },
    { value: 'no', label: 'Sorry, can\'t make it', emoji: '😔', color: 'border-gray-300 bg-gray-50 text-gray-600' },
  ]

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">
            {response === 'yes' ? '🎉' : response === 'maybe' ? '🤔' : '💌'}
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">
            Response recorded!
          </h1>
          <p className="text-gray-500">
            {response === 'yes'
              ? "Wonderful! We're excited to celebrate with you."
              : response === 'maybe'
              ? "No worries, hope to see you there!"
              : "Thanks for letting us know. We'll miss you!"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">💌</div>
            <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">
              You&apos;re Invited!
            </h1>
            <p className="text-gray-500 text-sm">Please let the host know if you can attend.</p>
          </div>

          <div className="space-y-6">
            {/* Response buttons */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Will you attend?</p>
              <div className="space-y-2">
                {responseOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setResponse(opt.value)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left font-medium ${
                      response === opt.value
                        ? opt.color
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Your Name"
              placeholder="Enter your name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />

            <Input
              label="Your Email *"
              type="email"
              placeholder="you@example.com"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-indigo/20 focus:border-brand-indigo"
              />
            </div>

            {status === 'error' && (
              <p className="text-red-500 text-sm">Failed to submit. Please try again.</p>
            )}

            <Button
              onClick={handleSubmit}
              loading={status === 'submitting'}
              disabled={!response || !guestEmail.trim()}
              className="w-full"
              size="lg"
            >
              Submit RSVP
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
