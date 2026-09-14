import { getCloudflareContext } from "@opennextjs/cloudflare"
import { EMAIL, SITE_URL, TURNSTILE_ACTION } from "@/lib/constants"
import { getPhotoBySlug } from "@/lib/gallery"

// Front Desk messages. Sent through Cloudflare Email Service from
// frontdesk@maz.gallery to the site owner, with the visitor as Reply-To.

const FROM = { email: "frontdesk@maz.gallery", name: "Maz Gallery Front Desk" }
const ALLOWED_ORIGINS = new Set([SITE_URL, "http://localhost:2892", "http://127.0.0.1:2892"])

// Per-IP budget in isolate memory: stops casual abuse, resets with the isolate
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 60 * 1000
const hits = new Map<string, { count: number; resetAt: number }>()
function rateLimited(ip: string) {
  const now = Date.now()
  const e = hits.get(ip)
  if (!e || e.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }
  e.count += 1
  return e.count > RATE_LIMIT
}

// Visitors take longer than this to answer five questions; bots do not
const MIN_FILL_MS = 4000

type ContactBody = {
  name?: string
  email?: string
  phone?: string
  message?: string
  contactPref?: string
  photo?: string // slug of a photograph the message is about
  website?: string // honeypot, must stay empty
  turnstileToken?: string
  startedAt?: number
}

type EmailBinding = {
  send: (msg: {
    to: string
    from: { email: string; name: string }
    replyTo?: string
    subject: string
    text: string
    html: string
  }) => Promise<unknown>
}

// Turnstile: enforced once TURNSTILE_SECRET_KEY exists in the Worker (or
// .dev.vars). Without it the honeypot and fill-time checks stand alone, and
// the skip is logged so it is never silent. Development uses Cloudflare's
// always-pass test secret so the widget works on localhost.
const IS_DEV = process.env.NODE_ENV === "development"
const TURNSTILE_HOSTNAMES = new Set(IS_DEV ? ["localhost", "127.0.0.1"] : ["maz.gallery", "www.maz.gallery"])

function turnstileSecret(env: Record<string, unknown>): string | undefined {
  if (IS_DEV) return "1x0000000000000000000000000000000AA"
  const fromBinding = env.TURNSTILE_SECRET_KEY
  return typeof fromBinding === "string" && fromBinding ? fromBinding : process.env.TURNSTILE_SECRET_KEY
}

async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  if (!token || token.length > 2048) return false
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    })
    if (!r.ok) return false
    const result = (await r.json()) as { success?: boolean; action?: string; hostname?: string; "error-codes"?: string[] }
    if (!result.success) {
      console.warn("contact: turnstile rejected", result["error-codes"])
      return false
    }
    // Test keys report a fixed action and hostname; only real keys are checked strictly
    if (IS_DEV) return true
    return result.action === TURNSTILE_ACTION && !!result.hostname && TURNSTILE_HOSTNAMES.has(result.hostname)
  } catch (err) {
    console.error("contact: siteverify failed", err instanceof Error ? err.message : err)
    return false
  }
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "")
const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string)

export async function POST(req: Request) {
  const origin = req.headers.get("origin")
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return Response.json({ error: "Forbidden." }, { status: 403 })
  }
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for") ?? "unknown"
  if (rateLimited(ip)) {
    return Response.json({ error: "That's a lot of messages. Try again in an hour, or email me directly." }, { status: 429 })
  }

  let body: ContactBody
  try {
    body = (await req.json()) as ContactBody
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 })
  }

  // Bot checks: honeypot filled, or the form was submitted implausibly fast.
  // Both answer 200 so a bot learns nothing; nothing is sent.
  const tooFast = typeof body.startedAt === "number" && Date.now() - body.startedAt < MIN_FILL_MS
  if (clean(body.website, 10) || tooFast) {
    return Response.json({ ok: true })
  }

  const name = clean(body.name, 120)
  const email = clean(body.email, 200)
  const phone = clean(body.phone, 40)
  const message = clean(body.message, 4000)
  const contactPref = clean(body.contactPref, 20)
  const photoSlugValue = clean(body.photo, 120)
  const photo = getPhotoBySlug(photoSlugValue)

  if (!name || !message) {
    return Response.json({ error: "A name and a message are the minimum." }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "That email address doesn't look right." }, { status: 400 })
  }

  let env: Record<string, unknown> = {}
  try {
    env = getCloudflareContext().env as unknown as Record<string, unknown>
  } catch {
    env = {}
  }

  const secret = turnstileSecret(env)
  if (secret) {
    const human = await verifyTurnstile(secret, clean(body.turnstileToken, 2048), ip)
    if (!human) {
      return Response.json({ error: "The bot check didn't pass. Try once more, or email me directly." }, { status: 403 })
    }
  } else {
    console.warn("contact: TURNSTILE_SECRET_KEY not set; skipping bot verification")
  }

  const sender = env.EMAIL as EmailBinding | undefined
  if (!sender) {
    console.error("contact: EMAIL binding unavailable")
    return Response.json({ error: "The front desk is unattended right now." }, { status: 503 })
  }

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    contactPref ? `Prefers: ${contactPref}` : null,
    photo ? `Photograph: ${photo.alt} (${SITE_URL}/gallery/${photoSlugValue})` : null,
    "",
    message,
  ].filter((l): l is string => l !== null)

  const html = `
    <div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.55;color:#1b2233">
      <p style="margin:0 0 4px"><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p>
      ${phone ? `<p style="margin:0 0 4px">Phone: ${escapeHtml(phone)}</p>` : ""}
      ${contactPref ? `<p style="margin:0 0 12px">Prefers: ${escapeHtml(contactPref)}</p>` : ""}
      <p style="white-space:pre-wrap;margin:12px 0 0;padding:12px 16px;border-left:3px solid #78c8d6;background:#f6f8f9">${escapeHtml(message)}</p>
      <p style="margin:20px 0 0;font-size:12px;color:#6b6e78">Sent from the Front Desk at maz.gallery. Reply to answer ${escapeHtml(name)} directly.</p>
    </div>`

  try {
    await sender.send({
      to: EMAIL,
      from: FROM,
      replyTo: email,
      subject: photo ? `Front Desk: ${name} · print of "${photo.alt}"` : `Front Desk: ${name}`,
      text: lines.join("\n"),
      html,
    })
    return Response.json({ ok: true })
  } catch (err) {
    const code = (err as { code?: string })?.code
    console.error("contact: send failed", code, err instanceof Error ? err.message : err)
    return Response.json({ error: "The message didn't go through." }, { status: 502 })
  }
}
