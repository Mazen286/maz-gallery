"use client"

import { useState } from "react"
import { Share2, Check } from "lucide-react"

// Native share sheet where available, otherwise copies the link
export function ShareButton({ title, url, className = "" }: { title: string; url: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // User dismissed the sheet or clipboard is blocked; nothing to do
    }
  }

  return (
    <button type="button" onClick={share} className={className} aria-live="polite">
      {copied ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}
      {copied ? "Link copied" : "Share"}
    </button>
  )
}
