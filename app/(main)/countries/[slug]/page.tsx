import Link from "next/link"
import { CountryHero } from "@/components/country/country-hero"
import { PostCard } from "@/components/post/post-card"
import { getApprovedPosts, getProfiles, requireCountry } from "@/lib/data"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const country = await requireCountry(slug)

  return {
    title: `${country.name_zh} 打工度假知識庫`,
    description: `在棲地無界查看 ${country.name_zh} 的簽證、預算與過來人經驗。`,
  }
}

export default async function CountryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [country, countryPosts, profiles] = await Promise.all([
    requireCountry(slug),
    getApprovedPosts(slug),
    getProfiles(),
  ])

  return (
    <div className="space-y-8">
      <Link href="/" className="text-sm font-medium text-[var(--brand)] hover:underline">
        ← 回到全部故事
      </Link>
      <CountryHero country={country} />

      {countryPosts.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--ink)]">{country.name_zh} 的過來人故事</h2>
          <div className="space-y-4">
            {countryPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                country={country}
                author={profiles.find((p) => p.id === post.author_id)}
              />
            ))}
          </div>
        </section>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--sand)]/40 px-6 py-12 text-center text-sm text-[var(--muted-ink)]">
          {country.name_zh} 目前還沒有過來人故事，我們正在整理中。
        </div>
      )}
    </div>
  )
}
