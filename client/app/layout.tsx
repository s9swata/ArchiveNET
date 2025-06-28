import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'ArchiveNet - AI Context Management',
  description: 'Intelligent context storage and retrieval for AI assistants',
  keywords: ['AI', 'context management', 'vector search', 'MCP', 'Claude', 'Cursor'],
  authors: [{ name: 'ArchiveNet Team' }],
  creator: 'ArchiveNet',
  publisher: 'ArchiveNet',
  openGraph: {
    title: 'ArchiveNet - AI Context Management',
    description: 'Intelligent context storage and retrieval for AI assistants',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArchiveNet - AI Context Management',
    description: 'Intelligent context storage and retrieval for AI assistants',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-black">
          {children}
        </div>
      </body>
    </html>
  )
}