import type { ReactNode } from 'react'

import { Geist, Geist_Mono } from 'next/font/google'

import { Header } from '@/components/shared/Header'

import type { Metadata } from 'next'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Next.js App Router Template',
  description:
    'A minimal Next.js App Router template with shadcn/ui, Tailwind CSS, and Vitest.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>): ReactNode {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  )
}
