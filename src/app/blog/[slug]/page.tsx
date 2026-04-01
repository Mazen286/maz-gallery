import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { BLOG_POSTS, getPost, formatDate, CATEGORY_COLORS } from "@/lib/blog"
import { POST_CONTENT } from "@/components/blog/posts"

export const runtime = "edge"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: "Post Not Found" }
  return {
    title: post.title,
    description: post.description,
    keywords: [post.category, "Mazen Abugharbieh", "maz gallery"],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://maz.gallery/blog/${post.slug}`,
      type: "article",
      publishedTime: `${post.date}T12:00:00Z`,
      modifiedTime: `${post.date}T12:00:00Z`,
      authors: ["https://maz.gallery/about"],
      images: [{ url: post.image, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [{ url: post.image, alt: post.title }],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3)

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: `https://maz.gallery${post.image}`,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: "Mazen Abugharbieh", url: "https://maz.gallery" },
    publisher: { "@type": "Person", name: "Mazen Abugharbieh", url: "https://maz.gallery" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://maz.gallery/blog/${post.slug}` },
    keywords: post.category,
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://maz.gallery" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://maz.gallery/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://maz.gallery/blog/${post.slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <article className="bg-white pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div className="mx-auto max-w-3xl px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs text-charcoal/40">
              <li><Link href="/" className="hover:text-teal">Home</Link></li>
              <li>/</li>
              <li><Link href="/blog" className="hover:text-teal">Blog</Link></li>
              <li>/</li>
              <li className="text-charcoal/60">{post.title}</li>
            </ol>
          </nav>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-charcoal/40">
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
          <p className="mt-3 text-sm text-charcoal/50">By Mazen Abugharbieh</p>
          <p className="mt-3 text-lg text-charcoal/60">{post.description}</p>

          {/* Hero image */}
          <div className="relative mt-8 aspect-video overflow-hidden rounded-xl">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          {/* Article body */}
          <div className="prose prose-lg mt-12 max-w-none text-charcoal/80 prose-headings:text-navy prose-h2:mt-14 prose-h2:text-2xl prose-h2:sm:text-3xl prose-h3:mt-8 prose-h3:text-lg prose-h3:italic prose-h3:text-charcoal/50 prose-h3:font-medium prose-p:leading-relaxed prose-a:text-teal prose-hr:my-10">
            {POST_CONTENT[post.slug] ? (
              (() => {
                const Content = POST_CONTENT[post.slug]
                return <Content />
              })()
            ) : (
              <p className="text-center text-charcoal/30 italic">
                This post is coming soon. Check back later for the full story.
              </p>
            )}
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
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
