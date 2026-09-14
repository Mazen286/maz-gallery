"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Pencil } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { EMAIL, SITE_URL, TURNSTILE_SITE_KEY, TURNSTILE_ACTION } from "@/lib/constants"
import { getPhotoBySlug, photoSlug } from "@/lib/gallery"

interface Step {
  id: "name" | "email" | "message" | "phone" | "contactPref"
  question: string
  label: string
  type: "text" | "email" | "tel" | "textarea" | "select"
  options?: string[]
  required: boolean
}

const STEPS: Step[] = [
  { id: "name", question: "Hey there. What should I call you?", label: "Name", type: "text", required: true },
  { id: "email", question: "Nice to meet you. Where can I reply?", label: "Email", type: "email", required: true },
  { id: "message", question: "What's on your mind? A project, a photo, a question, anything.", label: "Message", type: "textarea", required: true },
  { id: "phone", question: "A phone number, if you'd rather talk. Skip is fine.", label: "Phone", type: "tel", required: false },
  { id: "contactPref", question: "Last one. How should I get back to you?", label: "Prefers", type: "select", options: ["Email", "Phone", "Text"], required: false },
]

interface Message {
  type: "question" | "answer"
  text: string
}

type Status = "idle" | "sending" | "sent" | "failed"

// Turnstile's explicit-render API, loaded once from Cloudflare
type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  reset: (id: string) => void
  remove: (id: string) => void
}
declare global {
  interface Window {
    turnstile?: Turnstile
  }
}
const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
function loadTurnstile(): Promise<Turnstile | null> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`)
    const script = existing ?? Object.assign(document.createElement("script"), { src: TURNSTILE_SRC, async: true, defer: true })
    script.addEventListener("load", () => resolve(window.turnstile ?? null))
    script.addEventListener("error", () => resolve(null))
    if (!existing) document.head.appendChild(script)
  })
}

export function ConversationalForm() {
  // Arriving from a photograph page pre-writes the message about that print
  const photo = getPhotoBySlug(useSearchParams().get("photo") ?? "")
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<Record<Step["id"], string>>>({})
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [isComplete, setIsComplete] = useState(false)
  const [editing, setEditing] = useState(false)
  const [status, setStatus] = useState<Status>("idle")
  const [errorText, setErrorText] = useState("")
  const [honeypot, setHoneypot] = useState("")
  // Turnstile token for this submission; widgets are single-use and reset after a failed send
  const [turnstileToken, setTurnstileToken] = useState("")
  const [turnstileState, setTurnstileState] = useState<"pending" | "ready" | "unavailable">("pending")
  const turnstileHost = useRef<HTMLDivElement>(null)
  const turnstileId = useRef<string | null>(null)
  const startedAt = useRef(Date.now())
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  // Show first question on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([
        { type: "question", text: photo ? `Asking about "${photo.alt}"? Good eye. ${STEPS[0].question}` : STEPS[0].question },
      ])
      setIsTyping(false)
    }, 800)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, isTyping, isComplete])

  // Focus input. On touch devices, skip the initial autofocus: it scrolls
  // the page past the header and pops the keyboard before the visitor
  // has read anything. Focus only once they have started answering.
  useEffect(() => {
    if (isTyping || (isComplete && !editing) || !inputRef.current) return
    const isTouch = window.matchMedia("(pointer: coarse)").matches
    if (isTouch && messages.length <= 1) return
    inputRef.current.focus({ preventScroll: messages.length <= 1 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping, isComplete, editing])

  const summaryShown = isComplete && !editing

  // Render the Turnstile widget once the summary is on screen. Interaction-only
  // appearance means most people never see it; a challenge appears only if needed.
  useEffect(() => {
    if (!summaryShown || turnstileId.current || !turnstileHost.current) return
    let cancelled = false
    const host = turnstileHost.current
    loadTurnstile().then((ts) => {
      if (cancelled || !ts || turnstileId.current) return
      try {
        turnstileId.current = ts.render(host, {
          sitekey: TURNSTILE_SITE_KEY,
          action: TURNSTILE_ACTION,
          appearance: "interaction-only",
          theme: "light",
          callback: (token: string) => {
            setTurnstileToken(token)
            setTurnstileState("ready")
          },
          "expired-callback": () => setTurnstileToken(""),
          "error-callback": () => setTurnstileState("unavailable"),
        })
      } catch {
        setTurnstileState("unavailable")
      }
    })
    return () => {
      cancelled = true
    }
  }, [summaryShown])

  const showingInput = !isTyping && (!isComplete || editing) && currentStep < STEPS.length
  const step = STEPS[currentStep]

  const record = (value: string) => {
    const shown = value || "Skip"
    setMessages((prev) => [...prev, { type: "answer", text: shown }])
    setAnswers((prev) => ({ ...prev, [step.id]: value }))
    setInputValue("")

    if (editing) {
      // Back to the summary after fixing one answer
      setEditing(false)
      setCurrentStep(STEPS.length)
      return
    }

    const nextStep = currentStep + 1
    if (nextStep >= STEPS.length) {
      setIsComplete(true)
      setCurrentStep(nextStep)
    } else {
      setIsTyping(true)
      setCurrentStep(nextStep)
      setTimeout(() => {
        setMessages((prev) => [...prev, { type: "question", text: STEPS[nextStep].question }])
        if (STEPS[nextStep].id === "message" && photo) {
          setInputValue(`I'd like to ask about a print of "${photo.alt}" (${SITE_URL}/gallery/${photoSlug(photo)}).\n\n`)
        }
        setIsTyping(false)
      }, 600)
    }
  }

  const handleSubmitAnswer = () => {
    const value = inputValue.trim()
    if (step.required && !value) return
    record(value)
  }

  const handleEdit = (id: Step["id"]) => {
    const idx = STEPS.findIndex((s) => s.id === id)
    setEditing(true)
    setCurrentStep(idx)
    setInputValue(answers[id] ?? "")
    setMessages((prev) => [...prev, { type: "question", text: `Let's fix that. ${STEPS[idx].question}` }])
  }

  const handleSend = async () => {
    setStatus("sending")
    setErrorText("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          photo: photo ? photoSlug(photo) : undefined,
          website: honeypot,
          startedAt: startedAt.current,
          turnstileToken,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (res.ok && data.ok) {
        setStatus("sent")
      } else {
        setErrorText(data.error || "The message didn't go through.")
        setStatus("failed")
      }
    } catch {
      setErrorText("Couldn't reach the front desk.")
      setStatus("failed")
    }
    // A token is single-use: get a fresh one before any retry
    if (turnstileId.current && window.turnstile) {
      setTurnstileToken("")
      setTurnstileState("pending")
      window.turnstile.reset(turnstileId.current)
    }
  }

  const mailtoFallback = `mailto:${EMAIL}?subject=${encodeURIComponent(`Hello from ${answers.name ?? ""}`)}&body=${encodeURIComponent(answers.message ?? "")}`

  if (status === "sent") {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-lg border border-navy/15 bg-[#fffdf8] shadow-lg">
        <div className="text-center">
          <div className="relative mx-auto h-32 w-48" style={{ animation: "envelopeFlyAway 2s ease-in 1.5s forwards" }}>
            <div className="absolute inset-0 rounded-lg border-2 border-navy/20 bg-cream" />
            <div
              className="absolute left-0 right-0 top-0 h-16 origin-top rounded-t-lg border-2 border-navy/20 bg-cream"
              style={{
                clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                animation: "envelopeSeal 0.6s ease-out 0.3s forwards",
                transformOrigin: "top",
              }}
            />
            <div
              className="absolute left-1/2 top-8 z-10 h-8 w-8 -translate-x-1/2 rounded-full bg-teal shadow-md"
              style={{ animation: "fadeIn 0.3s ease-out 0.9s both" }}
            >
              <span className="flex h-full items-center justify-center text-xs font-semibold text-white">M</span>
            </div>
          </div>
          <p className="mt-6 text-lg font-semibold text-navy" style={{ animation: "fadeIn 0.5s ease-out 1s both" }}>
            Message sealed and sent
          </p>
          <p className="mt-1 text-sm text-charcoal/60" style={{ animation: "fadeIn 0.5s ease-out 1.2s both" }}>
            Thanks, {answers.name}. I&apos;ll reply to {answers.email} within a day.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[500px] flex-col rounded-lg border border-navy/15 bg-[#fffdf8] shadow-lg">
      {/* Chat area */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-6" aria-live="polite">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.type === "answer" ? "justify-end" : "justify-start"}`}
              style={{ animation: "fadeSlideIn 0.3s ease-out forwards" }}
            >
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${
                  msg.type === "question"
                    ? "rounded-bl-sm bg-slate-50 text-charcoal"
                    : "rounded-br-sm bg-navy text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start" aria-hidden="true">
              <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-slate-50 px-4 py-3">
                <span className="animate-typing-dot h-2 w-2 rounded-full bg-charcoal/30" style={{ animationDelay: "0ms" }} />
                <span className="animate-typing-dot h-2 w-2 rounded-full bg-charcoal/30" style={{ animationDelay: "150ms" }} />
                <span className="animate-typing-dot h-2 w-2 rounded-full bg-charcoal/30" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          {/* Summary card with editable rows */}
          {isComplete && !editing && (
            <div className="mt-4 rounded-xl border border-navy/10 bg-slate-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-teal">Before it goes out</p>
              <dl className="space-y-2 text-sm text-charcoal">
                {STEPS.filter((s) => answers[s.id]).map((s) => (
                  <div key={s.id} className="flex items-start gap-3">
                    <dt className="w-16 shrink-0 font-medium">{s.label}</dt>
                    <dd className="min-w-0 flex-1 whitespace-pre-wrap break-words">{answers[s.id]}</dd>
                    <button
                      type="button"
                      onClick={() => handleEdit(s.id)}
                      className="shrink-0 rounded-full p-1 text-charcoal/40 transition-colors hover:bg-navy/5 hover:text-navy"
                      aria-label={`Edit ${s.label.toLowerCase()}`}
                    >
                      <Pencil className="size-3.5" />
                    </button>
                  </div>
                ))}
              </dl>
              {/* Turnstile mounts here; interaction-only, so usually invisible */}
              <div ref={turnstileHost} className="mt-3 empty:hidden" />
              {turnstileState === "unavailable" && (
                <p className="mt-3 text-xs text-charcoal/50">
                  The bot check couldn&apos;t load (an ad blocker, maybe). You can still{" "}
                  <a href={mailtoFallback} className="font-medium underline underline-offset-2">send it by email</a>.
                </p>
              )}
              {status === "failed" && (
                <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                  {errorText}{" "}
                  <a href={mailtoFallback} className="font-medium underline underline-offset-2">
                    Send it by email instead
                  </a>
                  .
                </p>
              )}
              <button
                onClick={handleSend}
                disabled={status === "sending" || turnstileState === "pending"}
                className="mt-4 w-full rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy/90 disabled:opacity-60"
              >
                {status === "sending"
                  ? "Sending…"
                  : turnstileState === "pending"
                    ? "One moment…"
                    : status === "failed"
                      ? "Try again"
                      : "Send Message"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      {showingInput && (
        <div className="border-t border-navy/10 p-4">
          {step.type === "select" ? (
            <div className="flex flex-wrap gap-2">
              {step.options?.map((opt) => (
                <button
                  key={opt}
                  onClick={() => record(opt)}
                  className="rounded-full border border-navy/20 px-4 py-2 text-sm text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmitAnswer()
              }}
              className="flex items-end gap-3"
            >
              {/* Honeypot: hidden from people, tempting to bots */}
              <div className="absolute -left-[9999px] top-0" aria-hidden="true">
                <label htmlFor="fd-extra">Leave this empty</label>
                <input id="fd-extra" name="fd_extra" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </div>
              <label htmlFor={`step-${step.id}`} className="sr-only">
                {step.question}
              </label>
              {step.type === "textarea" ? (
                <textarea
                  id={`step-${step.id}`}
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault()
                      handleSubmitAnswer()
                    }
                  }}
                  placeholder="Type your message. Cmd+Enter to send."
                  rows={3}
                  required
                  aria-required="true"
                  className="flex-1 resize-none rounded-2xl border border-navy/20 bg-transparent px-4 py-2.5 text-sm text-navy outline-none placeholder:text-charcoal/30 focus:border-teal"
                />
              ) : (
                <input
                  id={`step-${step.id}`}
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type={step.type}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={step.required ? "Type your answer..." : "Type your answer, or send empty to skip"}
                  required={step.required}
                  aria-required={step.required}
                  autoComplete={step.id === "email" ? "email" : step.id === "phone" ? "tel" : step.id === "name" ? "name" : "off"}
                  className="flex-1 rounded-full border border-navy/20 bg-transparent px-4 py-2.5 text-sm text-navy outline-none placeholder:text-charcoal/30 focus:border-teal"
                />
              )}
              <button
                type="submit"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-white transition-colors hover:bg-navy/90"
                aria-label="Send"
              >
                <Send className="size-4" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
