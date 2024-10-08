/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, GitCommit, Star } from "lucide-react"
import Link from "next/link"
import { ReleaseCard } from './release-card'
import { VersionSelector } from './version-selector'

export function ChangelogDisplay({
  changelogQuery,
  filteredReleases,
  selectedRepo,
  fromVersion,
  toVersion,
  setFromVersion,
  setToVersion,
  handleBack
}: any) {
  if (changelogQuery.isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-2/3" />
      </div>
    )
  }

  if (!changelogQuery.data) return null

  const versions = changelogQuery.data.releases.map((release: any) => release.tag_name)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Repository Selection
        </Button>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Star className="h-4 w-4" />
          <span>{changelogQuery.data.repoInfo.stargazers_count.toLocaleString()} stars</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <GitCommit className="h-6 w-6" />
          <h1 className="text-3xl font-bold">
            <Link href={changelogQuery.data.repoInfo.html_url} className="hover:underline">
              dhis2/{selectedRepo}
            </Link>
          </h1>
        </div>
      </div>

      <VersionSelector
        fromVersion={fromVersion}
        toVersion={toVersion}
        onFromVersionChange={setFromVersion}
        onToVersionChange={setToVersion}
        versions={versions}
        releases={changelogQuery.data.releases} // Add this line
      />

      <div className="grid gap-8">
        {filteredReleases.map((release: any) => (
          <ReleaseCard key={release.id} release={release} />
        ))}
      </div>

      {filteredReleases.length === 0 && (
        <Card>
          <CardContent className="py-6">
            <p className="text-center text-muted-foreground">No releases found for the specified version range.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}