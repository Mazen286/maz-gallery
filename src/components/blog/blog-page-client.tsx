"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { FadeIn } from "@/components/shared/fade-in"
import {
  BLOG_POSTS,
  BLOG_CATEGORIES,
  CATEGORY_COLORS,
  formatDate,
  type BlogCategory,
} from "@/lib/blog"

export function BlogPageClient() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "All">("All")

  const filtered =
    activeCategory === "All"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === activeCategory)

  return (
    <>
      {/* Hero */}
      <section className="bg-white pb-6 pt-36 sm:pt-44">
        <div className="mx-auto max-w-5xl px-6">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-teal">
              Blog
            </p>
            <h1
              className="mt-4 font-bold leading-[0.95] text-navy"
              style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
            >
              Thoughts &<br />Stories
            </h1>
            <p className="mt-5 max-w-lg text-lg text-charcoal/50">
              Travel, food, games, and whatever else is on my mind.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Category filter */}
      <section className="bg-white pb-8 pt-2">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("All")}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                activeCategory === "All"
                  ? "bg-navy text-white"
                  : "border border-navy/10 text-navy/50 hover:border-navy/25 hover:text-navy/80"
              }`}
            >
              All
            </button>
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? "text-white"
                    : "border border-navy/10 text-navy/50 hover:border-navy/25 hover:text-navy/80"
                }`}
                style={
                  activeCategory === cat
                    ? { backgroundColor: CATEGORY_COLORS[cat] }
                    : undefined
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts grid */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg font-medium text-charcoal/50">
                I&apos;m working on writing these.
              </p>
              <p className="mt-2 text-sm text-charcoal/30">
                Check back soon for stories about travel, food, games, and more.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post, i) => (
                <FadeIn key={post.slug} delay={i * 80}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {/* Category badge */}
                      <span
                        className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white"
                        style={{ backgroundColor: CATEGORY_COLORS[post.category] }}
                      >
                        {post.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6">
                      <div className="flex items-center gap-2 text-xs text-charcoal/40">
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                        <span>&middot;</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h2 className="mt-2 text-lg font-bold text-navy group-hover:text-teal transition-colors duration-300">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-charcoal/55">
                        {post.description}
                      </p>
                    </div>

                    {/* Accent line */}
                    <div
                      className="h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                      style={{ backgroundColor: CATEGORY_COLORS[post.category] }}
                    />
                  </Link>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
