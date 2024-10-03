import React, { useEffect, useMemo, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { compareVersions } from '@/lib/github-utils'
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useCompletion } from 'ai/react'
import { ScrollArea } from './ui/scroll-area'

interface Release {
    tag_name: string;
    // Add other properties of a release object
}

interface SummaryDialogProps {
    isOpen: boolean
    onClose: () => void
    fromVersion: string
    toVersion: string
    releases: Release[]
}

export function SummaryDialog({ isOpen, onClose, fromVersion, toVersion, releases }: SummaryDialogProps) {
    const { complete, completion, isLoading } = useCompletion();
    const [lastVersions, setLastVersions] = useState({ from: '', to: '' });

    const filteredReleases = useMemo(() => {
        return releases.filter((release) => {
            const version = release.tag_name
            return compareVersions(version, fromVersion) >= 0 && compareVersions(version, toVersion) <= 0
        }).sort((a, b) => compareVersions(b.tag_name, a.tag_name))
    }, [releases, fromVersion, toVersion])

    useEffect(() => {
        const shouldTriggerCompletion = 
            isOpen && 
            !isLoading && 
            (lastVersions.from !== fromVersion || lastVersions.to !== toVersion);

        if (shouldTriggerCompletion) {
            complete('', { body: { releases: filteredReleases } });
            setLastVersions({ from: fromVersion, to: toVersion });
        }
    }, [isOpen, fromVersion, toVersion, complete, filteredReleases, isLoading, completion, lastVersions]);

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-hidden">
                <DialogHeader>
                    <DialogTitle>Changelog Summary</DialogTitle>
                    <DialogDescription>
                        Changes between version {fromVersion} and {toVersion}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className='h-[400px]'>
                    <ReactMarkdown
                        className="prose prose-sm max-w-none"
                        remarkPlugins={[remarkGfm]}
                        components={{
                            p: ({ children }) => <p className="text-sm text-muted-foreground">{children}</p>,
                            h1: ({ children }) => <h1 className="text-xl font-bold">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-lg font-bold">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-md font-bold">{children}</h3>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-5">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside">{children}</ol>,
                            li: ({ children }) => <li className="ml-4">{children}</li>,
                            a: ({ children, href }) => <a href={href} className="text-blue-500 hover:text-blue-600">{children}</a>,
                            code: ({ children }) => <code className="bg-gray-100 p-1 text-sm rounded-md">{children}</code>,
                            blockquote: ({ children }) => <blockquote className="border-l-2 text-sm border-gray-300 pl-4 py-1 my-1">{children}</blockquote>,
                            br: () => <br />,
                            hr: () => <hr className="my-5" />,
                        }}
                    >
                        {completion}
                    </ReactMarkdown>
                </ScrollArea>
                <DialogFooter>
                    <Button variant='ghost' onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}