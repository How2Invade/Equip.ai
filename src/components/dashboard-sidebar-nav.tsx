"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutGrid,
  Map,
  MessageSquare,
  User,
  TrendingUp,
} from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { href: "/dashboard/roadmap", icon: Map, label: "Roadmap" },
  { href: "/dashboard/counselor", icon: MessageSquare, label: "Counselor" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
]

export function DashboardSidebarNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname()

  const navLink = (item: typeof navItems[0]) => {
    const isActive = pathname === item.href
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
          isActive && "bg-accent text-accent-foreground",
          isMobile && "gap-4 px-2.5",
          !isMobile && "h-9 w-9 items-center justify-center rounded-lg md:h-8 md:w-8"
        )}
      >
        <item.icon className={cn("h-5 w-5", isMobile && "h-6 w-6")} />
        <span className={cn(isMobile ? "text-lg" : "sr-only")}>{item.label}</span>
      </Link>
    )
  }

  if (isMobile) {
    return (
      <>
        {navItems.map((item) => navLink(item))}
      </>
    )
  }

  return (
    <>
      {navItems.map((item) => (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>
            {navLink(item)}
          </TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      ))}
    </>
  )
}
