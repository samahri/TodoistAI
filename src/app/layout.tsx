import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Todoist AI',
  description: 'AI-powered task management application',
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
