'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useSearchParams, useRouter } from 'next/navigation'
import { RepoSelector } from './repo-selector'
import { ChangelogDisplay } from './changelog-display'
import { fetchGitHubAPI, parseLinkHeader, compareVersions } from '@/lib/github-utils'

const queryClient = new QueryClient()

function ChangelogViewer() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [selectedRepo, setSelectedRepo] = useState(searchParams.get('repo') || '')
  const fromVersion = searchParams.get('from') || ''
  const toVersion = searchParams.get('to') || ''

  const reposQuery = useQuery({
    queryKey: ['repos'],
    queryFn: async () => {
      const response = await fetchGitHubAPI('https://api.github.com/orgs/dhis2/repos?per_page=100')
      const data = await response.json()
      return Array.isArray(data) ? data.map((repo) => repo.name) : []
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  })

  const changelogQuery = useQuery({
    queryKey: ['changelog', selectedRepo],
    queryFn: async () => {
      const [releasesResponse, repoResponse] = await Promise.all([
        fetchGitHubAPI(`https://api.github.com/repos/dhis2/${selectedRepo}/releases?per_page=100`),
        fetchGitHubAPI(`https://api.github.com/repos/dhis2/${selectedRepo}`)
      ])

      const linkHeader = releasesResponse.headers.get("Link")
      const pagination = parseLinkHeader(linkHeader)

      const [releases, repoInfo] = await Promise.all([
        releasesResponse.json(),
        repoResponse.json()
      ])

      return { 
        releases: Array.isArray(releases) ? releases : [], 
        pagination, 
        repoInfo 
      }
    },
    enabled: !!selectedRepo,
    refetchOnWindowFocus: false,
    gcTime: Infinity,
    staleTime: Infinity,
  })

  const filteredReleases = changelogQuery.data?.releases.filter((release) => {
    if (!fromVersion || !toVersion) return true
    const version = release.tag_name
    return compareVersions(version, fromVersion) >= 0 && compareVersions(version, toVersion) <= 0
  }) || []

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key)
      } else {
        newSearchParams.set(key, value)
      }
    })
    router.push(`?${newSearchParams.toString()}`)
  }

  const showChangelog = () => {
    updateSearchParams({ repo: selectedRepo, from: null, to: null })
  }

  const setFromVersion = (from: string) => updateSearchParams({ from })
  const setToVersion = (to: string) => updateSearchParams({ to })

  const handleBack = () => {
    setSelectedRepo('')
    router.push('/')
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {!searchParams.get('repo') ? (
        <RepoSelector
          reposQuery={reposQuery}
          selectedRepo={selectedRepo}
          setSelectedRepo={setSelectedRepo}
          showChangelog={showChangelog}
        />
      ) : (
        <ChangelogDisplay
          changelogQuery={changelogQuery}
          filteredReleases={filteredReleases}
          selectedRepo={selectedRepo}
          fromVersion={fromVersion}
          toVersion={toVersion}
          setFromVersion={setFromVersion}
          setToVersion={setToVersion}
          handleBack={handleBack}
        />
      )}
    </div>
  )
}

export function Dhis2ChangelogViewer() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChangelogViewer />
    </QueryClientProvider>
  )
}