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
    <div data-tone="dark" className="min-h-screen bg-wall pb-24 pt-28 text-ivory">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <p className="label text-brass">The Gallery</p>
          <h1 className="mt-4 font-display text-4xl font-normal text-ivory">Photo Story Editor</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-mist">
            Write a short story or note for each photo. These appear in the Exhibition view,
            3D Museum plaques, and lightbox. Write naturally, I&apos;ll embellish later.
          </p>
          <p className="mt-3 text-[13px] tabular-nums text-brass-2">
            {filledCount} of {totalCount} stories written
          </p>
        </div>

        {/* Action buttons */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={exportJSON}
            className="btn btn-ivory"
          >
            <Download className="size-4" />
            Export JSON
          </button>
          <button
            onClick={copyForGalleryTs}
            className="btn btn-line text-ivory"
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
                className={`border transition-colors ${
                  hasStory ? "border-brass/40 bg-wall-2" : "border-wall-line bg-wall-2"
                }`}
              >
                {/* Image row */}
                <div
                  className="flex cursor-pointer items-center gap-4 p-4"
                  onClick={() => toggleCollapse(img.src)}
                >
                  <span className="w-7 text-right text-[13px] tabular-nums text-mist-2">{i + 1}</span>
                  <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ivory">
                      {img.alt}
                    </p>
                    <p className="text-[13px] text-mist-2">
                      {img.location || "No location"} &middot;{" "}
                      {img.src.split("/").pop()}
                    </p>
                    {hasStory && isCollapsed && (
                      <p className="mt-1 text-[13px] italic leading-relaxed text-brass-2">
                        {stories[img.src]}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {hasStory && (
                      <Check className="size-4 text-brass" />
                    )}
                    {isCollapsed ? (
                      <ChevronDown className="size-4 text-mist-2" />
                    ) : (
                      <ChevronUp className="size-4 text-mist-2" />
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
                      className="w-full border border-wall-line bg-wall px-4 py-3 text-sm text-ivory outline-none placeholder:text-mist-2 focus:border-brass/60"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom export */}
        <div className="mt-12 border border-wall-line bg-wall-2 p-6">
          <h2 className="font-display text-xl text-ivory">When you&apos;re done</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-mist">
            Click &ldquo;Copy as gallery.ts entries&rdquo; above. Then paste the result into{" "}
            <code className="bg-wall-3 px-1.5 py-0.5 text-[13px] text-brass-2">
              src/lib/gallery.ts
            </code>{" "}
            replacing the GALLERY array contents. Or export as JSON and send it to me.
          </p>
        </div>
      </div>
    </div>
  )
}
