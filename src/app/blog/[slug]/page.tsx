import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { BLOG_POSTS, getPost, formatDate, CATEGORY_COLORS } from "@/lib/blog"

export const runtime = "edge"

export function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Metadata {
  const post = getPost(params.slug)
  if (!post) return { title: "Post Not Found" }
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [{ url: post.image }],
    },
  }
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = getPost(params.slug)
  if (!post) notFound()

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <>
      <article className="bg-white pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div className="mx-auto max-w-3xl px-6">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-teal hover:text-teal/80"
          >
            <ArrowLeft className="size-4" />
            Back to blog
          </Link>

          {/* Meta */}
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-charcoal/40">
            <span
              className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white"
              style={{ backgroundColor: CATEGORY_COLORS[post.category] }}
            >
              {post.category}
            </span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>&middot;</span>
            <span>{post.readTime}</span>
          </div>

          {/* Title */}
          <h1 className="mt-4 text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-charcoal/60">{post.description}</p>

          {/* Hero image */}
          <div className="relative mt-8 aspect-video overflow-hidden rounded-xl">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article body placeholder */}
          <div className="prose prose-lg mt-12 max-w-none text-charcoal/80">
            <p className="text-center text-charcoal/30 italic">
              This post is coming soon. Check back later for the full story.
            </p>
          </div>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="border-t border-border bg-slate-50 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
              More Posts
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group block overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-charcoal/40">
                      {formatDate(p.date)}
                    </p>
                    <h3 className="mt-1 text-sm font-bold text-navy group-hover:text-teal transition-colors">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
