import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BLOG_POSTS, getPost, formatDate } from "@/lib/blog"
import { POST_CONTENT } from "@/components/blog/posts"
import { ReadingProgress } from "@/components/blog/reading-progress"

// Every published post is prerendered at build and served as a static file,
// so reading one never renders in the Worker
export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

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
    author: { "@type": "Person", "@id": "https://maz.gallery/about#person", name: "Mazen Abugharbieh", url: "https://maz.gallery/about" },
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
      <article className="bg-paper pb-16 pt-28 text-ink sm:pb-24 sm:pt-36">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="label flex min-w-0 items-center gap-2 text-ink-3">
              <li className="shrink-0"><Link href="/" className="py-2 transition-colors hover:text-ink">Home</Link></li>
              <li aria-hidden="true" className="shrink-0">/</li>
              <li className="shrink-0"><Link href="/blog" className="py-2 transition-colors hover:text-ink">Reading Room</Link></li>
            </ol>
          </nav>

          {/* Placard */}
          <p className="label text-brass-ink">
            {post.category} &middot; <time dateTime={post.date}>{formatDate(post.date)}</time> &middot; {post.readTime}
          </p>

          <h1
            className="mt-5 font-display font-normal leading-[1.05] tracking-[-0.01em]"
            style={{ fontSize: "clamp(2.2rem, 5.4vw, 3.6rem)" }}
          >
            {post.title}
          </h1>
          <p className="mt-5 font-display text-lg italic leading-relaxed text-ink-2 sm:text-xl">{post.description}</p>
          <p className="mt-5 text-[13px] text-ink-3">By Mazen Abugharbieh</p>

          {/* Hero image */}
          <div className="frame-light mt-10">
            <div className="relative aspect-video overflow-hidden">
              <Image src={post.image} alt={post.title} fill className="object-cover" preload sizes="(max-width: 768px) 92vw, 752px" />
            </div>
          </div>

          {/* Article body */}
          <div className="reading-room prose prose-lg mt-14 max-w-none font-display text-ink/90 prose-headings:font-display prose-headings:font-normal prose-headings:text-ink prose-h2:mt-14 prose-h2:text-[28px] prose-h2:sm:text-[32px] prose-h3:mt-6 prose-h3:text-lg prose-h3:font-normal prose-h3:italic prose-h3:text-ink-2 prose-p:leading-[1.85] prose-a:text-brass-ink prose-a:decoration-brass-ink/40 prose-a:underline-offset-4 prose-strong:text-ink prose-blockquote:border-l-brass-ink/50 prose-blockquote:font-display prose-blockquote:italic prose-blockquote:text-ink-2 prose-hr:my-12 prose-hr:border-line prose-li:marker:text-ink-3">
            {POST_CONTENT[post.slug] ? (
              (() => {
                const Content = POST_CONTENT[post.slug]
                return <Content />
              })()
            ) : (
              <p className="text-center italic text-ink-2">This post is coming soon. Check back later for the full story.</p>
            )}
          </div>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="border-t border-line bg-paper-2 py-20 text-ink">
          <div className="mx-auto max-w-[1312px] px-5 sm:px-8 lg:px-12">
            <p className="label text-brass-ink">Also in the Reading Room</p>
            <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden shadow-[0_0_0_1px_var(--line)]">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 92vw"
                    />
                  </div>
                  <p className="mt-4 text-[13px] text-ink-3">{formatDate(p.date)}</p>
                  <h3 className="mt-1 font-display text-[22px] leading-tight text-ink">{p.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
