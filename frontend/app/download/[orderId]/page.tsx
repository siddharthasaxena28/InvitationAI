'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { triggerHdRender, getRenderStatus } from '@/lib/api-client'

const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

type RenderStatus = 'idle' | 'pending' | 'processing' | 'done' | 'error'

interface DownloadLinks {
  png_url?: string
  pdf_url?: string
  animated_url?: string
}

export default function DownloadPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = params.orderId as string
  const token = searchParams.get('token') || ''

  const [status, setStatus] = useState<RenderStatus>('idle')
  const [links, setLinks] = useState<DownloadLinks>({})
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const pollStatus = useCallback(async (taskId: string) => {
    const maxAttempts = 30
    let attempt = 0
    const poll = async () => {
      if (attempt >= maxAttempts) {
        setStatus('error')
        return
      }
      attempt++
      try {
        const res = await getRenderStatus(taskId)
        if (res.status === 'SUCCESS') {
          setLinks(res.result || {})
          setStatus('done')
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 5000)
        } else if (res.status === 'FAILURE') {
          setStatus('error')
        } else {
          setTimeout(poll, 2000)
        }
      } catch {
        setTimeout(poll, 3000)
      }
    }
    poll()
  }, [])

  useEffect(() => {
    if (!token) return
    const startRender = async () => {
      setStatus('pending')
      try {
        const res = await triggerHdRender({ order_id: orderId, download_token: token })
        setStatus('processing')
        pollStatus(res.task_id)
      } catch {
        setStatus('error')
      }
    }
    startRender()
  }, [orderId, token, pollStatus])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center px-4 py-16">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
          colors={['#4F46E5', '#7C3AED', '#F59E0B', '#10B981', '#EC4899']}
        />
      )}

      <div className="max-w-lg w-full text-center">
        {status === 'done' ? (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="font-display text-4xl font-bold text-gray-900 mb-3">
              Your invitation is ready!
            </h1>
            <p className="text-gray-500 mb-8">
              Download your files below. Check your email too if you provided one.
            </p>

            <div className="space-y-3">
              {links.png_url && (
                <a
                  href={links.png_url}
                  download
                  className="flex items-center justify-center gap-3 w-full bg-brand-indigo text-white py-4 rounded-btn font-semibold hover:bg-brand-violet transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download HD PNG
                </a>
              )}
              {links.pdf_url && (
                <a
                  href={links.pdf_url}
                  download
                  className="flex items-center justify-center gap-3 w-full bg-white text-brand-indigo border-2 border-brand-indigo py-4 rounded-btn font-semibold hover:bg-indigo-50 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Download PDF (A4)
                </a>
              )}
              {links.animated_url && (
                <a
                  href={links.animated_url}
                  download
                  className="flex items-center justify-center gap-3 w-full bg-amber-500 text-white py-4 rounded-btn font-semibold hover:bg-amber-600 transition-colors"
                >
                  Download Animated GIF
                </a>
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/occasions"
                className="text-brand-indigo font-medium hover:underline text-sm"
              >
                Create another invitation →
              </Link>
            </div>
          </>
        ) : status === 'error' ? (
          <>
            <div className="text-5xl mb-4">😔</div>
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">
              Something went wrong
            </h1>
            <p className="text-gray-500 mb-6">
              We couldn&apos;t process your download. Please contact{' '}
              <a href="mailto:support@inviteai.in" className="text-brand-indigo">
                support@inviteai.in
              </a>
            </p>
            <Link
              href="/occasions"
              className="inline-flex items-center gap-2 bg-brand-indigo text-white px-6 py-3 rounded-btn font-semibold hover:bg-brand-violet transition-colors"
            >
              Back to Templates
            </Link>
          </>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto mb-6">
              <svg className="animate-spin h-20 w-20 text-brand-indigo" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">
              {status === 'pending' ? 'Preparing your invitation...' : 'Rendering HD quality...'}
            </h1>
            <p className="text-gray-500">
              This usually takes 10–30 seconds. Please don&apos;t close this page.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
