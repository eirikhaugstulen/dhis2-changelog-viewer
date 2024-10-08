import { Metadata } from 'next'
import { Dhis2ChangelogViewer } from '@/components/changelog-viewer'
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'DHIS2 Changelog Viewer',
  description: 'View and explore DHIS2 changelogs across different versions',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-6 md:p-12 lg:p-24">
      <Suspense fallback={<div>Loading...</div>}>
        <Dhis2ChangelogViewer />
      </Suspense>
      <Analytics />
    </main>
  )
}
