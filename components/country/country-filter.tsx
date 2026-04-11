"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import type { Country } from "@/types"

export function CountryFilter({
  countries,
  activeSlug,
}: {
  countries: Country[]
  activeSlug?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleSelect(slug?: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) {
      params.set("country", slug)
    } else {
      params.delete("country")
    }
    const qs = params.toString()
    router.push(qs ? `/?${qs}` : "/")
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleSelect(undefined)}
        className={cn(
          "rounded-full border px-4 py-2 text-sm font-medium transition",
          !activeSlug
            ? "border-[var(--brand)] bg-[var(--brand)] text-white"
            : "border-[var(--line)] bg-white text-[var(--ink)] hover:border-[var(--brand)]/40",
        )}
      >
        全部
      </button>
      {countries.map((country) => (
        <button
          key={country.slug}
          onClick={() => handleSelect(country.slug)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition",
            activeSlug === country.slug
              ? "border-[var(--brand)] bg-[var(--brand)] text-white"
              : "border-[var(--line)] bg-white text-[var(--ink)] hover:border-[var(--brand)]/40",
          )}
        >
          {country.flag_emoji} {country.name_zh}
        </button>
      ))}
    </div>
  )
}
