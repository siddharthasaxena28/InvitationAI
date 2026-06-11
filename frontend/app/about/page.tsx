import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About InviteAI — AI-Powered Digital Invitations for India',
  description: 'Learn about InviteAI — how we\'re making beautiful digital invitations accessible and affordable for every Indian family.',
}

const team = [
  { name: 'Priya Sharma', role: 'Co-Founder & CEO', bio: 'Former product lead at Flipkart, passionate about design democratisation.' },
  { name: 'Rohan Mehta', role: 'Co-Founder & CTO', bio: 'AI researcher & full-stack engineer. Built AI systems at Google before InviteAI.' },
  { name: 'Ananya Iyer', role: 'Head of Design', bio: 'IIT-B design graduate, 8 years in digital products.' },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-5xl font-bold text-gray-900 mb-4">
            Making beautiful invitations<br />
            <span className="text-gradient">accessible to every Indian</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            We started InviteAI because we saw families struggle to find affordable,
            beautiful digital invitations for their celebrations. We believe everyone
            deserves a stunning invitation — regardless of their budget.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              Digital invitations in India have been either too expensive (professional designers)
              or too basic (WhatsApp forwards). We&apos;re building the middle path: AI-generated,
              professional-quality designs that cost less than a chai.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Our Claude-powered AI understands Indian culture, regional nuances, and the
              emotions behind every celebration — from a child&apos;s first birthday to a
              traditional 60th wedding anniversary.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: '50K+', label: 'Invitations created' },
              { num: '28+', label: 'Occasion types' },
              { num: '200+', label: 'AI templates' },
              { num: '₹29', label: 'Starting price' },
            ].map(({ num, label }) => (
              <div key={label} className="bg-indigo-50 rounded-2xl p-5 text-center">
                <div className="text-2xl font-bold text-brand-indigo">{num}</div>
                <div className="text-sm text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How AI helps */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-gray-900 text-center mb-10">
            How AI powers InviteAI
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🎨',
                title: 'Template Generation',
                desc: 'DALL-E 3 creates culturally resonant visual designs that respect Indian aesthetics — from Rajasthani patterns to modern minimalism.',
              },
              {
                icon: '✍️',
                title: 'Magic Copy',
                desc: 'Claude generates personalised invitation text in English and Hindi, matching the tone and formality of your specific occasion.',
              },
              {
                icon: '🌟',
                title: 'Quality Assurance',
                desc: 'Every AI-generated template passes a quality check — correct layouts, readable text, appropriate colour contrast.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-bold text-gray-900 text-center mb-10">Meet the Team</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {team.map(({ name, role, bio }) => (
            <div key={name} className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-indigo to-brand-violet rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                {name[0]}
              </div>
              <h3 className="font-semibold text-gray-900">{name}</h3>
              <p className="text-brand-indigo text-sm mb-2">{role}</p>
              <p className="text-gray-500 text-sm">{bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gradient-to-r from-brand-indigo to-brand-violet py-16 px-4 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-bold mb-4">Let&apos;s celebrate together</h2>
          <p className="text-indigo-200 mb-6">
            Questions, feedback, or partnership enquiries? We&apos;d love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hello@inviteai.in"
              className="inline-flex items-center gap-2 bg-white text-brand-indigo px-6 py-3 rounded-btn font-semibold hover:bg-indigo-50 transition-colors"
            >
              hello@inviteai.in
            </a>
            <Link
              href="/occasions"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-btn font-semibold hover:bg-white/10 transition-colors"
            >
              Browse Templates →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
