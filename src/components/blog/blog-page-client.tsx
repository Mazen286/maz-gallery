"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { FadeIn } from "@/components/shared/fade-in"
import { BLOG_POSTS, BLOG_CATEGORIES, formatDate, type BlogCategory } from "@/lib/blog"

// Only offer filters that lead somewhere
const CATEGORIES = BLOG_CATEGORIES.filter((cat) => BLOG_POSTS.some((p) => p.category === cat))

export function BlogPageClient() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "All">("All")

  const filtered = activeCategory === "All" ? BLOG_POSTS : BLOG_POSTS.filter((p) => p.category === activeCategory)

  const chip = (active: boolean) =>
    `inline-flex min-h-10 items-center rounded-full px-4 text-sm transition-colors ${
      active ? "bg-ink text-paper" : "border border-line text-ink-2 hover:border-ink hover:text-ink"
    }`

  return (
    <div className="bg-paper text-ink">
      {/* Title */}
      <section className="pb-10 pt-32 sm:pt-40">
        <div className="mx-auto max-w-[1312px] px-5 sm:px-8 lg:px-12">
          <FadeIn immediate>
            <p className="label text-brass-ink">No. 05 &middot; Reading Room</p>
            <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-end lg:gap-16">
              <h1
                className="font-display font-normal leading-[0.95] tracking-[-0.02em]"
                style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)" }}
              >
                Thoughts &amp; <span className="italic">stories</span>
              </h1>
              <p className="font-display text-lg leading-relaxed text-ink-2 sm:text-xl">
                Travel, food, games, and whatever else is on my mind.
              </p>
            </div>
          </FadeIn>

          {/* Category filter */}
          <div role="group" aria-label="Filter by category" className="mt-12 flex flex-wrap gap-2 border-t border-line pt-6">
            <button type="button" onClick={() => setActiveCategory("All")} aria-pressed={activeCategory === "All"} className={chip(activeCategory === "All")}>
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={chip(activeCategory === cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="pb-28 pt-6 sm:pb-36">
        <div className="mx-auto max-w-[1312px] px-5 sm:px-8 lg:px-12">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-display text-2xl text-ink">I&apos;m working on writing these.</p>
              <p className="mt-2 text-[15px] text-ink-2">Check back soon for stories about travel, food, games, and more.</p>
            </div>
          ) : (
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post, i) => (
                <FadeIn key={post.slug} delay={(i % 3) * 80}>
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <div className="relative aspect-[16/10] overflow-hidden bg-paper-2 shadow-[0_0_0_1px_var(--line)]">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 92vw"
                      />
                    </div>
                    <p className="label mt-5 text-brass-ink">{post.category}</p>
                    <h2 className="mt-2 font-display text-[24px] leading-tight text-ink">{post.title}</h2>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{post.description}</p>
                    <p className="mt-3 text-[13px] text-ink-3">
                      <time dateTime={post.date}>{formatDate(post.date)}</time> &middot; {post.readTime}
                    </p>
                  </Link>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
