"use client"

import { useState, useCallback, useRef, type ReactNode } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface TextScrambleProps {
  children: string
  className?: string
  as?: "span" | "a" | "p" | "h1" | "h2" | "h3"
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*"

export function TextScramble({ children, className = "", as: Tag = "span" }: TextScrambleProps) {
  const [display, setDisplay] = useState(children)
  const reduced = useReducedMotion()
  const animRef = useRef<number | null>(null)
  const original = children

  const scramble = useCallback(() => {
    if (reduced) return
    let iteration = 0
    const length = original.length
    if (animRef.current) cancelAnimationFrame(animRef.current)

    const animate = () => {
      setDisplay(
        original
          .split("")
          .map((char, i) => {
            if (char === " ") return " "
            if (i < iteration) return original[i]
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join("")
      )
      iteration += 0.8
      if (iteration < length) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        setDisplay(original)
      }
    }
    animate()
  }, [original, reduced])

  const reset = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    setDisplay(original)
  }, [original])

  return (
    <Tag
      className={className}
      onMouseEnter={scramble}
      onMouseLeave={reset}
    >
      {display}
    </Tag>
  )
}

// Wrapper that accepts ReactNode children (for Links wrapping text)
interface ScrambleWrapperProps {
  text: string
  children: (display: string) => ReactNode
}

export function ScrambleWrapper({ text, children }: ScrambleWrapperProps) {
  const [display, setDisplay] = useState(text)
  const reduced = useReducedMotion()
  const animRef = useRef<number | null>(null)

  const scramble = useCallback(() => {
    if (reduced) return
    let iteration = 0
    const length = text.length
    if (animRef.current) cancelAnimationFrame(animRef.current)

    const animate = () => {
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " "
            if (i < iteration) return text[i]
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join("")
      )
      iteration += 0.8
      if (iteration < length) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        setDisplay(text)
      }
    }
    animate()
  }, [text, reduced])

  const reset = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    setDisplay(text)
  }, [text])

  return (
    <span onMouseEnter={scramble} onMouseLeave={reset}>
      {children(display)}
    </span>
  )
}
