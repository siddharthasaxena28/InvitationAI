import Link from 'next/link'
import { PRICING_TIERS } from '@/components/Checkout/PricingTiers'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — InviteAI',
  description: 'Simple, transparent pricing starting at just ₹29 for HD digital invitations.',
}

const faqs = [
  {
    q: 'Can I try before I buy?',
    a: 'Yes! Every template can be downloaded for free with a watermark. Pay only when you want the HD, watermark-free version.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept all major credit/debit cards, UPI, net banking, and wallets via Razorpay.',
  },
  {
    q: 'Do I get a refund if I\'m not happy?',
    a: 'We offer a full refund within 24 hours of purchase if you\'re not satisfied with the quality.',
  },
  {
    q: 'Can I share the invitation on WhatsApp?',
    a: 'Yes! All plans, including the free tier, support WhatsApp sharing via a direct link.',
  },
  {
    q: 'How long does HD rendering take?',
    a: 'Usually 10–30 seconds. You\'ll see a progress indicator and be notified when ready.',
  },
]

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <h1 className="font-display text-5xl font-bold text-gray-900 mb-4">
          Simple, Honest Pricing
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Start for free. Pay only for what you need. No subscriptions, no surprises.
        </p>
      </div>

      {/* Tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-20">
        {PRICING_TIERS.map((tier) => (
          <div
            key={tier.price}
            className={`relative rounded-2xl border-2 p-6 flex flex-col ${
              tier.popular
                ? 'border-brand-indigo bg-indigo-50 shadow-lg'
                : 'border-gray-200 bg-white'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-brand-indigo text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </span>
              </div>
            )}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-500 mb-1">{tier.label}</p>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold text-gray-900">
                  {tier.price === 0 ? 'Free' : `₹${tier.price}`}
                </span>
                {tier.price > 0 && <span className="text-gray-400 text-sm mb-1">/design</span>}
              </div>
            </div>
            <ul className="space-y-2 flex-1">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/occasions"
              className={`mt-6 block text-center py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                tier.popular
                  ? 'bg-brand-indigo text-white hover:bg-brand-violet'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tier.price === 0 ? 'Start Free' : 'Get Started'}
            </Link>
          </div>
        ))}
      </div>

      {/* Feature comparison */}
      <div className="mb-20">
        <h2 className="font-display text-2xl font-bold text-gray-900 text-center mb-8">
          What&apos;s included in each plan
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 font-semibold text-gray-700 pr-4">Feature</th>
                {PRICING_TIERS.map((t) => (
                  <th key={t.price} className="py-3 font-semibold text-gray-700 text-center px-2">
                    {t.price === 0 ? 'Free' : `₹${t.price}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Download', values: ['Watermarked', 'HD PNG', 'HD PNG + PDF', 'HD PNG + PDF', 'All formats'] },
                { label: 'Resolution', values: ['1080px', '2160px', '2160px', '2160px', '2160px'] },
                { label: 'Watermark', values: ['Yes', 'No', 'No', 'No', 'No'] },
                { label: 'WhatsApp sharing', values: ['✓', '✓', '✓', '✓', '✓'] },
                { label: 'Email delivery', values: ['—', '—', '✓', '✓', '✓'] },
                { label: 'Priority support', values: ['—', '—', '—', '✓', '✓'] },
                { label: 'Animated GIF', values: ['—', '—', '—', '—', '✓'] },
              ].map((row) => (
                <tr key={row.label} className="border-b border-gray-100">
                  <td className="py-3 text-gray-700 pr-4">{row.label}</td>
                  {row.values.map((v, i) => (
                    <td key={i} className="py-3 text-center text-gray-500 px-2">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map(({ q, a }) => (
            <div key={q} className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-20 text-center">
        <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
          Ready to create your invitation?
        </h2>
        <p className="text-gray-500 mb-6">Join 50,000+ Indians who trust InviteAI</p>
        <Link
          href="/occasions"
          className="inline-flex items-center gap-2 bg-brand-indigo text-white px-10 py-4 rounded-btn text-lg font-semibold hover:bg-brand-violet transition-colors shadow-lg"
        >
          Browse Templates — It&apos;s Free →
        </Link>
      </div>
    </div>
  )
}
