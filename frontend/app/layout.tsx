import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Providers from '@/components/Providers'
import Navbar from '@/components/Navigation/Navbar'
import Footer from '@/components/Navigation/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })

export const metadata: Metadata = {
  title: 'InviteAI — AI-Powered Digital Invitation Cards',
  description: 'Create beautiful digital invitations for weddings, birthdays, festivals and more. Free watermarked preview, paid HD download starting at ₹29.',
  keywords: 'digital invitation, WhatsApp invitation, birthday invitation, wedding invitation, Diwali invitation, Hindi invitation',
  openGraph: {
    title: 'InviteAI — Beautiful Digital Invitations',
    description: 'AI-powered invitation cards for every Indian occasion. Share via WhatsApp instantly.',
    type: 'website',
    locale: 'en_IN',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages()

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-white">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
