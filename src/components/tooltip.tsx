import { Info } from "lucide-react"
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

export const ToolTip = ({ data }: { data: string }) => {
  return (
    <div>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="link" className="ml-1 h-4 w-4 p-0">
              <Info className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="center"
            className="max-w-[500px] min-w-[50px] max-h-[300px] min-h-[20px] text-wrap overflow-auto"
          >
            <p>{data}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
