import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Materna AI - Your Trusted Voice in Motherhood',
  description: 'Professional maternal health assistant offering voice-first AI support, pregnancy tracking, and personalized care for expectant mothers.',
  keywords: 'pregnancy, maternal health, AI assistant, pregnancy tracker, prenatal care',
  authors: [{ name: 'Materna AI Team' }],
  openGraph: {
    title: 'Materna AI - Your Trusted Voice in Motherhood',
    description: 'Professional maternal health assistant offering voice-first AI support, pregnancy tracking, and personalized care for expectant mothers.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script 
          src="https://unpkg.com/@daily-co/daily-js@0.55.0/dist/daily-js.js"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  )
}