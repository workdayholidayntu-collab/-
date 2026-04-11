import Link from "next/link"
import Image from "next/image"
import { NavTabs } from "@/components/layout/nav-tabs"

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[rgba(244,248,251,0.82)] backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="棲地無界" width={32} height={32} className="shrink-0" />
          <span className="text-sm font-bold text-[var(--ink)]">棲地無界 Borderless Habitat</span>
        </Link>
        <NavTabs />
      </div>
    </header>
  )
}
