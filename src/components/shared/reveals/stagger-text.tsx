"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"

interface StaggerTextProps {
  text: string
  className?: string
  as?: "p" | "h2" | "h3" | "span"
  delay?: number
}

export function StaggerText({ text, className = "", as: Tag = "p", delay = 0 }: StaggerTextProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 })

  // Split into words, keeping spaces
  const words = text.split(" ")

  return (
    <div ref={ref}>
      <Tag className={className}>
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-pre">
            {word.split("").map((char, ci) => {
              const charIndex = words.slice(0, wi).join(" ").length + ci
              return (
                <span
                  key={ci}
                  className="inline-block transition-all duration-500 ease-out"
                  style={{
                    transitionDelay: isVisible ? `${delay + charIndex * 15}ms` : "0ms",
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(8px)",
                  }}
                >
                  {char}
                </span>
              )
            })}
            {wi < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </Tag>
    </div>
  )
}
