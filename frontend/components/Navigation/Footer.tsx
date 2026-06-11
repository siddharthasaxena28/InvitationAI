import Link from 'next/link'
import { OCCASIONS } from '@/lib/occasions'

export default function Footer() {
  const cols1 = OCCASIONS.slice(0, 7)
  const cols2 = OCCASIONS.slice(7, 14)

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-display font-bold text-white">InviteAI</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
              India&apos;s premier AI-powered digital invitation platform. Beautiful, affordable, and instant.
            </p>
            <p className="text-xs text-gray-600 mt-6">Made with care in India 🇮🇳</p>
          </div>

          {/* Occasions col 1 */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">Occasions</h4>
            <ul className="space-y-2.5">
              {cols1.map(o => (
                <li key={o.slug}>
                  <Link href={`/occasions/${o.slug}`} className="text-sm hover:text-white transition-colors">
                    {o.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Occasions col 2 */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4 opacity-0">·</h4>
            <ul className="space-y-2.5">
              {cols2.map(o => (
                <li key={o.slug}>
                  <Link href={`/occasions/${o.slug}`} className="text-sm hover:text-white transition-colors">
                    {o.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/my-designs" className="hover:text-white transition-colors">My Designs</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li>
                <a href="mailto:hello@inviteai.in" className="hover:text-white transition-colors">
                  hello@inviteai.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© 2026 InviteAI Technologies Pvt. Ltd. All rights reserved.</p>
          <p>Payments secured by Razorpay</p>
        </div>
      </div>
    </footer>
  )
}
