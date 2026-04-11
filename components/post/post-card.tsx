import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import type { Country, Post, Profile } from "@/types"

export function PostCard({
  post,
  country,
  author,
}: {
  post: Post
  country?: Country | null
  author?: Profile | null
}) {
  const avatarSrc = author?.avatar_url || "/avatar-default.svg"

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex gap-5 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 transition hover:-translate-y-0.5 hover:shadow-md sm:gap-6 sm:p-6"
    >
      <div className="shrink-0 text-center">
        <Image
          src={avatarSrc}
          alt={author?.nickname ?? "作者"}
          width={72}
          height={72}
          className="rounded-full object-cover"
          style={{ width: 72, height: 72 }}
        />
        {author?.nickname ? (
          <p className="mt-2 text-sm font-bold text-[var(--ink)]">{author.nickname}</p>
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted-ink)]">
          {country ? (
            <Badge className="pointer-events-none">
              {country.flag_emoji} {country.name_zh}
            </Badge>
          ) : null}
          {post.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} className="pointer-events-none bg-white">
              {tag}
            </Badge>
          ))}
          <span className="ml-auto text-xs">{formatDate(post.created_at)}</span>
        </div>

        <h2 className="mt-3 text-lg font-bold text-[var(--ink)] group-hover:text-[var(--brand)] sm:text-xl">
          <span>{post.title}</span>
          <ArrowUpRight className="ml-1.5 inline-block h-4 w-4 opacity-0 transition group-hover:opacity-100" />
        </h2>

        {post.excerpt ? (
          <p className="mt-2 line-clamp-2 text-sm leading-7 text-[var(--muted-ink)]">
            {post.excerpt}
          </p>
        ) : null}

        {author?.bio ? (
          <p className="mt-2 text-xs leading-5 text-[var(--muted-ink)]">{author.bio}</p>
        ) : null}
      </div>
    </Link>
  )
}
