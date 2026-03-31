"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { GALLERY } from "@/lib/gallery"
import { Download, Check, ChevronDown, ChevronUp } from "lucide-react"

interface StoryEntry {
  src: string
  alt: string
  location: string
  story: string
}

export function StoryEditor() {
  const [stories, setStories] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    GALLERY.forEach((img) => {
      initial[img.src] = img.story || ""
    })
    return initial
  })
  const [saved, setSaved] = useState(false)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const updateStory = useCallback((src: string, story: string) => {
    setStories((prev) => ({ ...prev, [src]: story }))
    setSaved(false)
  }, [])

  const toggleCollapse = useCallback((src: string) => {
    setCollapsed((prev) => ({ ...prev, [src]: !prev[src] }))
  }, [])

  const exportJSON = useCallback(() => {
    const data: StoryEntry[] = GALLERY.map((img) => ({
      src: img.src,
      alt: img.alt,
      location: img.location || "",
      story: stories[img.src] || "",
    }))
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "gallery-stories.json"
    a.click()
    URL.revokeObjectURL(url)
    setSaved(true)
  }, [stories])

  const copyForGalleryTs = useCallback(() => {
    // Generate the gallery.ts array entries with stories filled in
    const lines = GALLERY.map((img) => {
      const story = (stories[img.src] || "").replace(/"/g, '\\"')
      const loc = img.location ? `location: "${img.location}", ` : ""
      const storyStr = story ? `story: "${story}", ` : `story: "", `
      return `  { src: "${img.src}", alt: "${img.alt}", ${loc}${storyStr}width: ${img.width}, height: ${img.height} },`
    }).join("\n")

    navigator.clipboard.writeText(lines)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [stories])

  const filledCount = Object.values(stories).filter((s) => s.trim().length > 0).length
  const totalCount = GALLERY.length

  return (
    <div className="min-h-screen bg-charcoal pt-24 pb-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Photo Story Editor</h1>
          <p className="mt-2 text-sm text-white/50">
            Write a short story or note for each photo. These appear in the Exhibition view,
            3D Museum plaques, and lightbox. Write naturally, I&apos;ll embellish later.
          </p>
          <p className="mt-2 font-mono text-xs text-teal">
            {filledCount} / {totalCount} stories written
          </p>
        </div>

        {/* Action buttons */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={exportJSON}
            className="flex items-center gap-2 rounded-full bg-teal/80 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal"
          >
            <Download className="size-4" />
            Export JSON
          </button>
          <button
            onClick={copyForGalleryTs}
            className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white/70 hover:border-teal hover:text-teal"
          >
            {saved ? <Check className="size-4" /> : null}
            {saved ? "Copied!" : "Copy as gallery.ts entries"}
          </button>
        </div>

        {/* Photo list */}
        <div className="space-y-4">
          {GALLERY.map((img, i) => {
            const isCollapsed = collapsed[img.src] && stories[img.src]?.trim()
            const hasStory = (stories[img.src] || "").trim().length > 0

            return (
              <div
                key={img.src}
                className={`rounded-xl border transition-colors ${
                  hasStory
                    ? "border-teal/20 bg-teal/5"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {/* Image row */}
                <div
                  className="flex cursor-pointer items-center gap-4 p-4"
                  onClick={() => toggleCollapse(img.src)}
                >
                  <span className="font-mono text-xs text-white/30 w-6 text-right">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">
                      {img.alt}
                    </p>
                    <p className="text-xs text-white/40">
                      {img.location || "No location"} &middot;{" "}
                      {img.src.split("/").pop()}
                    </p>
                    {hasStory && isCollapsed && (
                      <p className="mt-1 truncate text-xs italic text-teal/60">
                        {stories[img.src]}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {hasStory && (
                      <Check className="size-4 text-teal" />
                    )}
                    {isCollapsed ? (
                      <ChevronDown className="size-4 text-white/30" />
                    ) : (
                      <ChevronUp className="size-4 text-white/30" />
                    )}
                  </div>
                </div>

                {/* Story textarea */}
                {!isCollapsed && (
                  <div className="px-4 pb-4">
                    <textarea
                      value={stories[img.src] || ""}
                      onChange={(e) => updateStory(img.src, e.target.value)}
                      placeholder="Write your story here... Where were you? What caught your eye? What were you feeling?"
                      rows={3}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-teal/50"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom export */}
        <div className="mt-12 rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-bold text-white">When you&apos;re done</h2>
          <p className="mt-2 text-sm text-white/50">
            Click &ldquo;Copy as gallery.ts entries&rdquo; above. Then paste the result into{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-teal">
              src/lib/gallery.ts
            </code>{" "}
            replacing the GALLERY array contents. Or export as JSON and send it to me.
          </p>
        </div>
      </div>
    </div>
  )
}
