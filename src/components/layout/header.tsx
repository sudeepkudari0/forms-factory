"use client"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import { } from "react"

import { getCurrentUserDetails } from "@/actions/users"
import useScroll from "@/hooks/use-scroll"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { ModeToggle } from "../mode-toggle"
import { UserAccountNav } from "../user-account-nav"
import { UserNav } from "../user-nav"


const Header = () => {
  const scrolled = useScroll(5)
  const selectedLayout = useSelectedLayoutSegment()

  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      return await getCurrentUserDetails()
    }
})

  return (
    <div
      className={cn("sticky inset-x-0 top-0 z-30 w-full border-b transition-all", {
        "border-b backdrop-blur-lg": scrolled,
        "border-b   backdrop-blur-lg": scrolled,
        "border-b  ": selectedLayout,
      })}
    >
      <div className="flex h-[79px] items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex flex-row items-center justify-center space-x-3 md:hidden">
            <span className="h-7 w-7 rounded-lg" />
            <span className="flex text-xl font-bold ">Logo</span>
          </Link>
        </div>
        <div className="flex items-center justify-between w-full">
          <h1 className="hidden font-heading tracking-wide text-2xl font-bold md:block">
            <span className=" text-lg font-sans font-medium">Welcome Back,</span> {userData?.name}
          </h1>
          <div className="mr-4 hidden space-x-2 md:flex md:items-center md:justify-center">
            <ModeToggle />
            {userData ? <UserAccountNav /> : <UserNav />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
