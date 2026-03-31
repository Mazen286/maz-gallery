"use client"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { EMAIL } from "@/lib/constants"

interface Step {
  id: string
  question: string
  type: "text" | "email" | "tel" | "select"
  options?: string[]
  required: boolean
}

const STEPS: Step[] = [
  { id: "firstName", question: "Hey there. What's your first name?", type: "text", required: true },
  { id: "lastName", question: "Nice to meet you. And your last name?", type: "text", required: true },
  { id: "phone", question: "What's the best number to reach you at?", type: "tel", required: true },
  { id: "email", question: "And your email?", type: "email", required: true },
  { id: "contactPref", question: "Last one. How would you like me to get back to you?", type: "select", options: ["Email", "Phone", "Text"], required: false },
]

interface Message {
  type: "question" | "answer"
  text: string
}

export function ConversationalForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [isComplete, setIsComplete] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Show first question on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([{ type: "question", text: STEPS[0].question }])
      setIsTyping(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // Focus input
  useEffect(() => {
    if (!isTyping && !isComplete && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isTyping, isComplete])

  const handleSubmitAnswer = () => {
    const step = STEPS[currentStep]
    const value = inputValue.trim()

    if (step.required && !value) return

    // Add answer to messages
    const newMessages: Message[] = [...messages, { type: "answer", text: value || "Skip" }]
    setMessages(newMessages)
    setAnswers((prev) => ({ ...prev, [step.id]: value }))
    setInputValue("")

    const nextStep = currentStep + 1
    if (nextStep >= STEPS.length) {
      // All done - show summary
      setIsComplete(true)
      setCurrentStep(nextStep)
    } else {
      // Show typing indicator, then next question
      setIsTyping(true)
      setCurrentStep(nextStep)
      setTimeout(() => {
        setMessages((prev) => [...prev, { type: "question", text: STEPS[nextStep].question }])
        setIsTyping(false)
      }, 600)
    }
  }

  const handleSelectOption = (option: string) => {
    setInputValue(option)
    setTimeout(() => {
      const step = STEPS[currentStep]
      const newMessages: Message[] = [...messages, { type: "answer", text: option }]
      setMessages(newMessages)
      setAnswers((prev) => ({ ...prev, [step.id]: option }))
      setInputValue("")
      setIsComplete(true)
      setCurrentStep(currentStep + 1)
    }, 100)
  }

  const handleSend = () => {
    const name = `${answers.firstName || ""} ${answers.lastName || ""}`.trim()
    window.location.href = `mailto:${EMAIL}?subject=Consultation Request from ${encodeURIComponent(name)}&body=Name: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(answers.phone || "")}%0AEmail: ${encodeURIComponent(answers.email || "")}%0APreferred Contact: ${encodeURIComponent(answers.contactPref || "")}`
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-2xl border border-navy/10 bg-white shadow-lg">
        <div
          className="text-center"
          style={{ animation: "envelopeFlyAway 2s ease-in 1.5s forwards" }}
        >
          {/* Envelope */}
          <div className="relative mx-auto h-32 w-48">
            {/* Envelope body */}
            <div className="absolute inset-0 rounded-lg border-2 border-navy/20 bg-cream" />
            {/* Envelope flap */}
            <div
              className="absolute left-0 right-0 top-0 h-16 origin-top rounded-t-lg border-2 border-navy/20 bg-cream"
              style={{
                clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                animation: "envelopeSeal 0.6s ease-out 0.3s forwards",
                transformOrigin: "top",
              }}
            />
            {/* Wax seal */}
            <div
              className="absolute left-1/2 top-8 z-10 h-8 w-8 -translate-x-1/2 rounded-full bg-teal shadow-md"
              style={{
                animation: "fadeIn 0.3s ease-out 0.9s both",
              }}
            >
              <span className="flex h-full items-center justify-center text-xs font-bold text-white">M</span>
            </div>
          </div>
          <p
            className="mt-6 text-lg font-bold text-navy"
            style={{ animation: "fadeIn 0.5s ease-out 1s both" }}
          >
            Message sealed & sent
          </p>
          <p
            className="mt-1 text-sm text-charcoal/60"
            style={{ animation: "fadeIn 0.5s ease-out 1.2s both" }}
          >
            I&apos;ll get back to you shortly.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[500px] flex-col rounded-2xl border border-navy/10 bg-white shadow-lg">
      {/* Chat area */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-6" aria-live="polite">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.type === "answer" ? "justify-end" : "justify-start"}`}
              style={{
                animation: "fadeSlideIn 0.3s ease-out forwards",
              }}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  msg.type === "question"
                    ? "rounded-bl-sm bg-slate-50 text-charcoal"
                    : "rounded-br-sm bg-navy text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-slate-50 px-4 py-3">
                <span className="animate-typing-dot h-2 w-2 rounded-full bg-charcoal/30" style={{ animationDelay: "0ms" }} />
                <span className="animate-typing-dot h-2 w-2 rounded-full bg-charcoal/30" style={{ animationDelay: "150ms" }} />
                <span className="animate-typing-dot h-2 w-2 rounded-full bg-charcoal/30" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          {/* Summary card */}
          {isComplete && (
            <div className="mt-4 rounded-xl border border-navy/10 bg-slate-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-teal">Summary</p>
              <div className="space-y-2 text-sm text-charcoal">
                <p><span className="font-medium">Name:</span> {answers.firstName} {answers.lastName}</p>
                <p><span className="font-medium">Phone:</span> {answers.phone}</p>
                <p><span className="font-medium">Email:</span> {answers.email}</p>
                {answers.contactPref && (
                  <p><span className="font-medium">Preferred Contact:</span> {answers.contactPref}</p>
                )}
              </div>
              <button
                onClick={handleSend}
                className="mt-4 w-full rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
              >
                Send Message
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      {!isComplete && !isTyping && currentStep < STEPS.length && (
        <div className="border-t border-navy/10 p-4">
          {STEPS[currentStep].type === "select" ? (
            <div className="flex flex-wrap gap-2">
              {STEPS[currentStep].options?.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
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
              className="flex gap-3"
            >
              <input
                ref={inputRef}
                type={STEPS[currentStep].type}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your answer..."
                required={STEPS[currentStep].required}
                className="flex-1 rounded-full border border-navy/20 bg-transparent px-4 py-2.5 text-sm text-navy outline-none placeholder:text-charcoal/30 focus:border-teal"
              />
              <button
                type="submit"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white transition-colors hover:bg-navy/90"
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
