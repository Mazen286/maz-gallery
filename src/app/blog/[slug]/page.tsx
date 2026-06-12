import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { BLOG_POSTS, getPost, formatDate, CATEGORY_COLORS } from "@/lib/blog"
import { POST_CONTENT } from "@/components/blog/posts"
import { ReadingProgress } from "@/components/blog/reading-progress"

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
      images: [{ url: post.image, width: post.imageWidth, height: post.imageHeight, alt: post.title }],
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
    publisher: {
      "@type": "Organization",
      name: "Maz Gallery",
      url: "https://maz.gallery",
      logo: { "@type": "ImageObject", url: "https://maz.gallery/favicon-512.png" },
    },
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
      <ReadingProgress />
      <article className="bg-[#fbfaf6] pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div className="mx-auto max-w-3xl px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-charcoal/40">
              <li><Link href="/" className="hover:text-teal">Home</Link></li>
              <li>/</li>
              <li><Link href="/blog" className="hover:text-teal">Reading Room</Link></li>
              <li>/</li>
              <li className="truncate text-charcoal/60">{post.title}</li>
            </ol>
          </nav>

          {/* Placard meta */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-charcoal/45">
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
          <h1
            className="mt-5 font-display font-semibold leading-[1.08] text-navy"
            style={{ fontSize: "clamp(2.1rem, 5vw, 3.4rem)" }}
          >
            {post.title}
          </h1>
          <p className="mt-4 font-display text-lg italic leading-relaxed text-charcoal/60 sm:text-xl">
            {post.description}
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-charcoal/40">
            By Mazen Abugharbieh
          </p>

          {/* Hero image */}
          <div className="relative mt-8 aspect-video overflow-hidden rounded-xl">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              preload
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          {/* Article body */}
          <div className="reading-room prose prose-lg mt-12 max-w-none font-display text-charcoal/85 prose-headings:font-display prose-headings:text-navy prose-h2:mt-14 prose-h2:text-2xl prose-h2:sm:text-3xl prose-h3:mt-8 prose-h3:text-lg prose-h3:italic prose-h3:text-charcoal/50 prose-h3:font-medium prose-p:leading-[1.85] prose-a:text-teal prose-blockquote:border-l-teal/50 prose-blockquote:font-display prose-blockquote:italic prose-hr:my-10">
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
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-teal">
              Also in the Reading Room
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
                    <h3 className="mt-1 font-display text-base text-navy group-hover:text-teal transition-colors">
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
