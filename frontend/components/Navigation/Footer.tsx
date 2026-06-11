import Link from 'next/link'
import { OCCASIONS } from '@/lib/occasions'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-display font-bold text-xl mb-3">InviteAI</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              India&apos;s favourite AI-powered digital invitation platform. Create beautiful invitations for every occasion.
            </p>
            <p className="text-xs text-gray-500 mt-4">Made with ❤️ in India</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Occasions</h4>
            <ul className="space-y-2">
              {OCCASIONS.slice(0, 8).map(o => (
                <li key={o.slug}>
                  <Link href={`/occasions/${o.slug}`} className="text-sm hover:text-white transition-colors">
                    {o.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Pricing</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2"><span className="text-emerald-400">●</span> Free watermarked</li>
              <li className="flex items-center gap-2"><span className="text-amber-400">●</span> HD PNG — ₹29</li>
              <li className="flex items-center gap-2"><span className="text-violet-400">●</span> PNG + PDF — ₹49</li>
              <li className="flex items-center gap-2"><span className="text-brand-indigo">●</span> Premium — ₹99</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© 2026 InviteAI. All rights reserved.</p>
          <p className="text-xs text-gray-500">Payments secured by Razorpay 🔒</p>
        </div>
      </div>
    </footer>
  )
}
