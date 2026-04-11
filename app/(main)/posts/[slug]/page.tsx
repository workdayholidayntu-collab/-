import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getCountries, getPostBodyHtml, getProfiles, requirePost } from "@/lib/data"
import { formatDate } from "@/lib/utils"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await requirePost(slug)
  return { title: post.title, description: post.excerpt ?? "棲地無界文章" }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, countries, profiles] = await Promise.all([requirePost(slug), getCountries(), getProfiles()])
  const country = countries.find((item) => item.slug === post.country_slug)
  const author = profiles.find((item) => item.id === post.author_id)

  return (
    <article className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {country ? <Badge>{country.flag_emoji} {country.name_zh}</Badge> : null}
          {post.tags.map((tag) => (
            <Badge key={tag} className="bg-white">{tag}</Badge>
          ))}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-[var(--muted-ink)]">
          {author ? <span className="font-medium text-[var(--ink)]">{author.nickname}</span> : null}
          <span>{formatDate(post.created_at)}</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="prose-whv max-w-none text-base" dangerouslySetInnerHTML={{ __html: getPostBodyHtml(post) }} />
        </CardContent>
      </Card>
    </article>
  )
}
