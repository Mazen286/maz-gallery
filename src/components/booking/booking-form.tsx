"use client"

import { useState } from "react"
import { EMAIL } from "@/lib/constants"

export function BookingForm() {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  if (submitted) {
    return (
      <div className="rounded-2xl border border-teal/30 bg-teal/5 p-8 text-center">
        <p className="text-2xl font-bold text-white">Thanks for reaching out.</p>
        <p className="mt-2 text-white/70">I&apos;ll get back to you shortly.</p>
      </div>
    )
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        window.location.href = `mailto:${EMAIL}?subject=Consultation Request from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(name)} (${encodeURIComponent(email)})`
        setSubmitted(true)
      }}
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white/80">Name</label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-teal"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white/80">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-teal"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-white/80">Message</label>
        <textarea
          id="message"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-teal"
          placeholder="Tell me about your project or what you'd like to discuss..."
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-teal px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-teal/90"
      >
        Get in Touch
      </button>
    </form>
  )
}
