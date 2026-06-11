'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">
          Something went wrong
        </h1>
        <p className="text-gray-500 mb-8">
          An unexpected error occurred. Our team has been notified.
          {error.digest && (
            <span className="block mt-2 text-xs font-mono text-gray-400">
              Error ID: {error.digest}
            </span>
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-brand-indigo text-white px-6 py-3 rounded-btn font-semibold hover:bg-brand-violet transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white text-brand-indigo border-2 border-brand-indigo px-6 py-3 rounded-btn font-semibold hover:bg-indigo-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
