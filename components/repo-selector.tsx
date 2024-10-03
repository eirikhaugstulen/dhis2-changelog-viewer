import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function RepoSelector({ reposQuery, selectedRepo, setSelectedRepo, showChangelog }) {
  const [open, setOpen] = useState(false)

  return (
    <Card className="w-full max-w-md mx-auto mb-8">
      <CardHeader>
        <CardTitle>DHIS2 Changelog Viewer</CardTitle>
        <CardDescription>Select a DHIS2 repository to view its changelog.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedRepo
                  ? reposQuery.data?.find((repo) => repo === selectedRepo)
                  : "Select repository..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search repository..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No repository found.</CommandEmpty>
                  <CommandGroup>
                    {reposQuery.isLoading ? (
                      <CommandItem disabled>Loading repositories...</CommandItem>
                    ) : reposQuery.data && reposQuery.data.length > 0 ? (
                      reposQuery.data.map((repo) => (
                        <CommandItem
                          key={repo}
                          value={repo}
                          onSelect={(currentValue) => {
                            setSelectedRepo(currentValue === selectedRepo ? "" : currentValue)
                            setOpen(false)
                          }}
                        >
                          {repo}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedRepo === repo ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))
                    ) : (
                      <CommandItem disabled>No repositories found</CommandItem>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Button 
            className="w-full" 
            disabled={!selectedRepo || reposQuery.isLoading}
            onClick={showChangelog}
          >
            {reposQuery.isLoading ? 'Loading...' : 'View Changelog'}
          </Button>
        </div>
        {reposQuery.error && <p className="text-red-500 mt-2">{reposQuery.error.message}</p>}
      </CardContent>
    </Card>
  )
}