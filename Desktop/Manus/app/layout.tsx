import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Cannabis Menu - Live TV Display',
  description: 'Premium cannabis flower menu for vertical TV display',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-neutral-600 text-white overflow-hidden">
        {children}
      </body>
    </html>
  )
} 