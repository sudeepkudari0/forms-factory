"use client"

import { cn } from "@/lib/utils"
import type { SideNavItem } from "@/types"
import { Icon } from "@iconify/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const SideNav = ({ SideNavItems }: { SideNavItems: SideNavItem[] }) => {
  return (
    <div className="fixed hidden h-screen flex-1 border-r md:flex md:w-60">
      <div className="flex w-full flex-col space-y-6">
        <Link
          href="/"
          className="flex h-[80px] w-full flex-row items-center justify-center space-x-3 border-b md:justify-start md:px-6"
        >
          <div className="bg-[url('/logo-2.jpg')] h-[40px] w-[150px] bg-contain bg-center items-center justify-center space-x-3 border-b  md:h-[80px] md:w-[300px] dark:bg-[url('/logo-2-dark.png')]" />
        </Link>

        <div className="flex flex-col space-y-2  md:px-6 ">
          {SideNavItems.map((item, idx) => {
            return <MenuItem key={idx} item={item} />
          })}
        </div>
      </div>
    </div>
  )
}

export default SideNav

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname()
  const [subMenuOpen, setSubMenuOpen] = useState(false)

  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen)
  }

  return (
    <div className="">
      {item.submenu ? (
        <>
          <button
            type="button"
            onClick={toggleSubMenu}
            className={cn(
              "flex w-full flex-row items-center justify-between bg-zinc-100 rounded-lg p-2 dark:bg-zinc-700 dark:hover:bg-zinc-700 hover:bg-zinc-100"
            )}
          >
            <div className="flex flex-row items-center space-x-4">
              {item.icon}
              <span className="flex text-sm  font-semibold">{item.title}</span>
            </div>

            <div className={`${subMenuOpen ? "rotate-180" : ""} flex`}>
              <Icon icon="lucide:chevron-down" width="24" height="24" />
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-2 ml-12 flex flex-col space-y-4">
              {item.subMenuItems?.map((subItem, idx) => {
                return (
                  <Link
                    key={idx}
                    href={subItem.path}
                    className={`${subItem.path === pathname ? "font-bold" : ""}`}
                  >
                    <span>{subItem.title}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={cn(
            "flex flex-row items-center space-x-4 rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700",
            item.path === pathname && "bg-zinc-100 dark:bg-zinc-700"
          )}
        >
          {item.icon}
          <span className="flex text-sm font-semibold">{item.title}</span>
        </Link>
      )}
    </div>
  )
}
