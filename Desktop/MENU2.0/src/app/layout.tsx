import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MENU 2.0',
  description: 'Luxury Digital Menu Experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 