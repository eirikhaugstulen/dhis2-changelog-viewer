import { Metadata } from 'next'
import { Dhis2ChangelogViewer } from '@/components/changelog-viewer'

export const metadata: Metadata = {
  title: 'DHIS2 Changelog Viewer',
  description: 'View and explore DHIS2 changelogs across different versions',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Dhis2ChangelogViewer />
    </main>
  )
}
