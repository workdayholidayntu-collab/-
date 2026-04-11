import { PostCard } from "@/components/post/post-card"
import { CountryFilter } from "@/components/country/country-filter"
import { getApprovedPosts, getCountries, getProfiles } from "@/lib/data"

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const activeCountry = typeof params.country === "string" ? params.country : undefined

  const [countries, posts, profiles] = await Promise.all([
    getCountries(),
    getApprovedPosts(activeCountry),
    getProfiles(),
  ])

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
          過來人故事
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted-ink)]">
          每一篇都是真實走過打工度假的人，把簽證、工作、住宿與生活整理出來的第一手經驗。
        </p>
      </section>

      <CountryFilter countries={countries} activeSlug={activeCountry} />

      <section className="space-y-6">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--sand)]/40 px-6 py-12 text-center text-sm text-[var(--muted-ink)]">
            這個國家目前還沒有過來人故事，我們正在整理中。
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              country={countries.find((c) => c.slug === post.country_slug)}
              author={profiles.find((p) => p.id === post.author_id)}
            />
          ))
        )}
      </section>
    </div>
  )
}
