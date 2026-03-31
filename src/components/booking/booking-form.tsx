"use client"

import { useState } from "react"
import { EMAIL } from "@/lib/constants"

export function BookingForm() {
  const [submitted, setSubmitted] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [contactPref, setContactPref] = useState("")

  if (submitted) {
    return (
      <div className="rounded-2xl border border-navy/20 bg-slate-50 p-8 text-center">
        <p className="text-2xl font-bold text-navy">Thanks for reaching out.</p>
        <p className="mt-2 text-charcoal/70">I&apos;ll get back to you shortly.</p>
      </div>
    )
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        const name = `${firstName} ${lastName}`.trim()
        window.location.href = `mailto:${EMAIL}?subject=Consultation Request from ${encodeURIComponent(name)}&body=Name: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AEmail: ${encodeURIComponent(email)}%0APreferred Contact: ${encodeURIComponent(contactPref)}`
        setSubmitted(true)
      }}
    >
      <div>
        <p className="text-sm font-medium text-navy">Name</p>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-xs text-charcoal/60">
              First Name <span className="text-charcoal/40">(required)</span>
            </label>
            <input
              id="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 w-full border-b border-charcoal/30 bg-transparent py-2 text-navy outline-none focus:border-navy"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-xs text-charcoal/60">
              Last Name <span className="text-charcoal/40">(required)</span>
            </label>
            <input
              id="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 w-full border-b border-charcoal/30 bg-transparent py-2 text-navy outline-none focus:border-navy"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-navy">
          Phone <span className="text-xs font-normal text-charcoal/40">(required)</span>
        </label>
        <input
          id="phone"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-2 w-full border-b border-charcoal/30 bg-transparent py-2 text-navy outline-none focus:border-navy"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-navy">
          Email <span className="text-xs font-normal text-charcoal/40">(required)</span>
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border-b border-charcoal/30 bg-transparent py-2 text-navy outline-none focus:border-navy"
        />
      </div>

      <div>
        <label htmlFor="contactPref" className="block text-sm font-medium text-navy">
          How do you prefer to be contacted?
        </label>
        <select
          id="contactPref"
          value={contactPref}
          onChange={(e) => setContactPref(e.target.value)}
          className="mt-2 w-full border-b border-charcoal/30 bg-transparent py-2 text-navy outline-none focus:border-navy"
        >
          <option value="">Select an option</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="text">Text</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full rounded-sm border-2 border-navy bg-transparent px-8 py-3.5 text-base font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
      >
        Book
      </button>
    </form>
  )
}
