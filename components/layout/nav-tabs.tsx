"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const tabs = [
  { label: "過來人故事", href: "/" },
  { label: "國家知識庫", href: "/countries" },
  { label: "關於我們", href: "/about" },
]

export function NavTabs() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-4">
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/"
            ? pathname === "/" || pathname.startsWith("/posts")
            : pathname.startsWith(tab.href)

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "border-b-2 px-1 py-1.5 text-sm font-medium transition",
              isActive
                ? "border-[var(--ink)] text-[var(--ink)]"
                : "border-transparent text-[var(--muted-ink)] hover:border-[var(--line)] hover:text-[var(--ink)]",
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
