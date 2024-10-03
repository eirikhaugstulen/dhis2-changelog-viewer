/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Filter, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { SummaryDialog } from './summary-dialog'

interface VersionSelectorProps {
  fromVersion: string
  toVersion: string
  onFromVersionChange: (value: string) => void
  onToVersionChange: (value: string) => void
  versions: string[]
  releases: any[] // Add this line
}

export function VersionSelector({
  fromVersion,
  toVersion,
  onFromVersionChange,
  onToVersionChange,
  versions,
  releases // Add this line
}: VersionSelectorProps) {
  const [fromOpen, setFromOpen] = useState(false)
  const [toOpen, setToOpen] = useState(false)
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false)

  const sortedVersions = useMemo(() => {
    return [...versions].sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }))
  }, [versions])

  const filteredToVersions = useMemo(() => {
    if (!fromVersion) return sortedVersions
    const fromIndex = sortedVersions.indexOf(fromVersion)
    return fromIndex !== -1 ? sortedVersions.slice(0, fromIndex + 1) : sortedVersions
  }, [sortedVersions, fromVersion])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter Releases
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="fromVersion" className="block text-sm font-medium text-gray-700 mb-1">
              From Version
            </label>
            <Popover open={fromOpen} onOpenChange={setFromOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="fromVersion"
                  variant="outline"
                  role="combobox"
                  aria-expanded={fromOpen}
                  className="w-full justify-between"
                >
                  {fromVersion || "Select version..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search version..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No version found.</CommandEmpty>
                    <CommandGroup>
                      {sortedVersions.map((version) => (
                        <CommandItem
                          key={version}
                          value={version}
                          onSelect={(currentValue) => {
                            onFromVersionChange(currentValue === fromVersion ? "" : currentValue)
                            setFromOpen(false)
                          }}
                        >
                          {version}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              fromVersion === version ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex-1">
            <label htmlFor="toVersion" className="block text-sm font-medium text-gray-700 mb-1">
              To Version
            </label>
            <Popover open={toOpen} onOpenChange={setToOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="toVersion"
                  variant="outline"
                  role="combobox"
                  aria-expanded={toOpen}
                  className="w-full justify-between"
                >
                  {toVersion || "Select version..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search version..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No version found.</CommandEmpty>
                    <CommandGroup>
                      {filteredToVersions.map((version) => (
                        <CommandItem
                          key={version}
                          value={version}
                          onSelect={(currentValue) => {
                            onToVersionChange(currentValue === toVersion ? "" : currentValue)
                            setToOpen(false)
                          }}
                        >
                          {version}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              toVersion === version ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            disabled={!fromVersion || !toVersion}
            onClick={() => setIsSummaryDialogOpen(true)}
          >
            Generate summary
          </Button>
        </div>
      </CardContent>
      <SummaryDialog
        isOpen={isSummaryDialogOpen}
        onClose={() => setIsSummaryDialogOpen(false)}
        fromVersion={fromVersion}
        toVersion={toVersion}
        releases={releases} // Add this line
      />
    </Card>
  )
}