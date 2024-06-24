"use client"

import { Typewriter } from "react-simple-typewriter"

interface DashboardHeaderProps {
  heading: string | React.ReactNode
  text?: string
  children?: React.ReactNode
}

export function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  const _headingArray =
    typeof heading === "string" ? [heading] : Array.isArray(heading) ? heading : []
  return (
    <div className="flex flex-col justify-between gap-4 overflow-hidden px-2 lg:flex-row lg:items-center">
      <div className="grid gap-1">
        <h1 className="font-heading  truncate text-3xl md:text-4xl">{heading}</h1>
        {text && (
          <p className="text-muted-foreground h-[25px] text-lg">
            <Typewriter words={[text]} />
          </p>
        )}
      </div>
      {children}
    </div>
  )
}
