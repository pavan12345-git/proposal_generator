"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function TestDataTrigger() {
  const onClick = () => {
    // Dispatch a custom event listened to by the form
    window.dispatchEvent(new Event("brf:fill-test-data"))
  }

  const onClear = () => {
    // Dispatch a custom event listened to by the form to clear everything
    window.dispatchEvent(new Event("brf:clear-form"))
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              onClick={onClick}
              variant="outline"
              className="h-7 w-7 rounded-full p-0 text-xs font-semibold bg-transparent"
              aria-label="Fill with test data"
              title="Fill with test data"
            >
              T
            </Button>
          </TooltipTrigger>
          <TooltipContent>Fill with test data</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              onClick={onClear}
              variant="outline"
              className="h-7 w-7 rounded-full p-0 text-xs font-semibold bg-transparent"
              aria-label="Clear all fields"
              title="Clear all fields"
            >
              C
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear all fields</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
