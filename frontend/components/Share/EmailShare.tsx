'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'

interface EmailShareProps {
  templateTitle: string
  downloadUrl: string
}

export default function EmailShare({ templateTitle, downloadUrl }: EmailShareProps) {
  const [open, setOpen] = useState(false)
  const [emails, setEmails] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSend = async () => {
    if (!emails.trim()) return
    setStatus('sending')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/share/email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to_emails: emails.split(',').map(e => e.trim()).filter(Boolean),
            subject: `You're invited: ${templateTitle}`,
            event_title: templateTitle,
            download_url: downloadUrl,
          }),
        }
      )
      if (!res.ok) throw new Error()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="w-full">
        Send via Email
      </Button>
      <Modal open={open} onClose={() => { setOpen(false); setStatus('idle') }} title="Send Invitation via Email">
        <div className="space-y-4">
          <Input
            label="Guest email(s)"
            placeholder="guest@example.com, friend@gmail.com"
            value={emails}
            onChange={e => setEmails(e.target.value)}
          />
          {status === 'sent' && (
            <p className="text-emerald-600 text-sm">✅ Email sent successfully!</p>
          )}
          {status === 'error' && (
            <p className="text-red-500 text-sm">Failed to send. Please try again.</p>
          )}
          <Button onClick={handleSend} loading={status === 'sending'} className="w-full">
            Send Email
          </Button>
        </div>
      </Modal>
    </>
  )
}
