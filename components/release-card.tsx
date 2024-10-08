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
              components={{
                p: ({ children }) => <p className="text-sm text-muted-foreground">{children}</p>,
                h1: ({ children }) => <h1 className="text-xl font-bold">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-bold my-4">{children}</h3>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-5">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside">{children}</ol>,
                li: ({ children }) => <li className="ml-4">{children}</li>,
                a: ({ children, href }) => <a href={href} className="text-gray-600 hover:text-gray-700 hover:underline">{children}</a>,
                code: ({ children }) => <code className="bg-gray-100 p-1 text-sm rounded-md">{children}</code>,
                blockquote: ({ children }) => <blockquote className="border-l-2 text-sm border-gray-300 pl-4 py-1 my-1">{children}</blockquote>,
                br: () => <br />,
                hr: () => <hr className="my-5" />,
              }}
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