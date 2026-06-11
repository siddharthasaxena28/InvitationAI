import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="font-display text-8xl font-bold text-brand-indigo/20 mb-4">404</div>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">
          Page not found
        </h1>
        <p className="text-gray-500 mb-8">
          Looks like this invitation got lost in transit. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-brand-indigo text-white px-6 py-3 rounded-btn font-semibold hover:bg-brand-violet transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/occasions"
            className="inline-flex items-center gap-2 bg-white text-brand-indigo border-2 border-brand-indigo px-6 py-3 rounded-btn font-semibold hover:bg-indigo-50 transition-colors"
          >
            Browse Templates
          </Link>
        </div>
      </div>
    </div>
  )
}
