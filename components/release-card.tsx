import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Release {
  id: string;
  html_url: string;
  name: string;
  tag_name: string;
  prerelease: boolean;
  published_at: string;
  body: string;
}

export function ReleaseCard({ release }: { release: Release }) {
  return (
    <Card key={release.id} className="overflow-hidden">
      <CardHeader className="bg-muted">
        <CardTitle className="flex items-center gap-2">
          <Link href={release.html_url} className="hover:underline">
            {release.name || release.tag_name}
          </Link>
          {release.prerelease && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Pre-release
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => {
              navigator.clipboard.writeText(release.html_url)
            }}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy link</span>
          </Button>
        </CardTitle>
        <CardDescription>
          Released on {new Date(release.published_at).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {release.body ? (
            <ReactMarkdown
              className="prose prose-sm max-w-none"
              remarkPlugins={[remarkGfm]}
            >
              {release.body}
            </ReactMarkdown>
          ) : (
            <p className="text-muted-foreground">
              No release notes provided.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}