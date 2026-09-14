import { SITE_URL, AUTHOR_NAME, roomFor } from "./constants"
import type { GalleryImage } from "./gallery"

// The Front Desk notification, built to match the museum: a dark placard
// header, the message on a cream card, the details as a desk list. Tables
// and inline styles because email clients ignore most of everything else;
// Georgia stands in for Fraunces and the system stack for Inter Tight.

export interface FrontDeskMessage {
  name: string
  email: string
  phone?: string
  contactPref?: string
  message: string
  photo?: { image: GalleryImage; slug: string }
  receivedAt?: Date
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string)

const DISPLAY = "Georgia, 'Times New Roman', serif"
const BODY = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
const MONO = "'SF Mono', Menlo, Consolas, 'Courier New', monospace"

const INK = "#0a0c11"
const NAVY = "#1b2233"
const TEAL = "#78c8d6"
const TEAL_DEEP = "#2e8fa0"
const CREAM = "#f7f5ef"
const PAPER = "#fffdf8"
const RULE = "#e3dfd3"
const MUTED = "#6b6e78"

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:9px 0;border-bottom:1px solid ${RULE};font-family:${BODY};font-size:13px;color:${MUTED};width:110px;vertical-align:top;">${esc(label)}</td>
      <td style="padding:9px 0;border-bottom:1px solid ${RULE};font-family:${BODY};font-size:14px;color:${NAVY};vertical-align:top;">${value}</td>
    </tr>`
}

export function renderFrontDeskEmail(m: FrontDeskMessage): { subject: string; html: string; text: string } {
  const when = (m.receivedAt ?? new Date()).toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
  const room = roomFor("/booking")
  const isPrint = !!m.photo
  const subject = isPrint ? `Front Desk: ${m.name} asks about a print of "${m.photo!.image.alt}"` : `Front Desk: ${m.name}`
  const replySubject = encodeURIComponent(isPrint ? `Re: your note about "${m.photo!.image.alt}"` : "Re: your note to the Front Desk")
  const replyHref = `mailto:${m.email}?subject=${replySubject}`
  const photoUrl = m.photo ? `${SITE_URL}/gallery/${m.photo.slug}` : null
  const photoImg = m.photo ? `${SITE_URL}${m.photo.image.src}` : null

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${CREAM};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(m.message.slice(0, 120))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};">
  <tr><td align="center" style="padding:32px 16px 48px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- Placard header -->
      <tr><td style="background:${INK};padding:28px 32px 24px;border-radius:8px 8px 0 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="font-family:${DISPLAY};font-size:20px;color:#ffffff;">Maz <i>Gallery</i></td>
          <td align="right" style="font-family:${MONO};font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${TEAL};">${esc(room?.number ?? "No. 08")} &middot; Front Desk</td>
        </tr></table>
        <div style="height:1px;background:rgba(120,200,214,0.25);margin:20px 0 18px;"></div>
        <div style="font-family:${MONO};font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.45);">${isPrint ? "Print inquiry" : "A visitor left a note"}</div>
        <div style="font-family:${DISPLAY};font-size:30px;line-height:1.15;color:#ffffff;margin-top:8px;">${esc(m.name)}</div>
        <div style="font-family:${BODY};font-size:13px;color:rgba(255,255,255,0.5);margin-top:6px;">${esc(when)} Pacific</div>
      </td></tr>

      <!-- The message -->
      <tr><td style="background:${PAPER};padding:28px 32px 8px;">
        <div style="font-family:${MONO};font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${TEAL_DEEP};">The message</div>
        <div style="margin-top:12px;padding:16px 20px;border-left:3px solid ${TEAL};background:${CREAM};font-family:${DISPLAY};font-size:17px;line-height:1.6;color:${NAVY};white-space:pre-wrap;">${esc(m.message)}</div>
      </td></tr>

      ${
        m.photo
          ? `<!-- The photograph -->
      <tr><td style="background:${PAPER};padding:20px 32px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${RULE};border-radius:6px;">
          <tr>
            <td style="padding:12px;width:132px;vertical-align:top;">
              <a href="${photoUrl}" style="text-decoration:none;"><img src="${photoImg}" width="120" alt="${esc(m.photo.image.alt)}" style="display:block;width:120px;height:auto;border-radius:4px;"></a>
            </td>
            <td style="padding:14px 14px 14px 4px;vertical-align:top;">
              <div style="font-family:${MONO};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${MUTED};">About this photograph</div>
              <div style="font-family:${DISPLAY};font-size:17px;font-style:italic;color:${NAVY};margin-top:4px;">${esc(m.photo.image.alt)}</div>
              ${m.photo.image.location ? `<div style="font-family:${BODY};font-size:13px;color:${MUTED};margin-top:2px;">${esc(m.photo.image.location)}</div>` : ""}
              <a href="${photoUrl}" style="display:inline-block;margin-top:8px;font-family:${BODY};font-size:13px;color:${TEAL_DEEP};">Open in the gallery &rarr;</a>
            </td>
          </tr>
        </table>
      </td></tr>`
          : ""
      }

      <!-- At the desk -->
      <tr><td style="background:${PAPER};padding:24px 32px 8px;">
        <div style="font-family:${MONO};font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${TEAL_DEEP};">At the desk</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:6px;">
          ${row("Name", esc(m.name))}
          ${row("Email", `<a href="mailto:${esc(m.email)}" style="color:${NAVY};text-decoration:none;">${esc(m.email)}</a>`)}
          ${m.phone ? row("Phone", esc(m.phone)) : ""}
          ${m.contactPref ? row("Prefers", esc(m.contactPref)) : ""}
        </table>
      </td></tr>

      <!-- Reply -->
      <tr><td style="background:${PAPER};padding:24px 32px 32px;border-radius:0 0 8px 8px;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="border-radius:999px;background:${NAVY};">
            <a href="${replyHref}" style="display:inline-block;padding:12px 24px;font-family:${BODY};font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px;">Reply to ${esc(m.name.split(" ")[0])}</a>
          </td>
          <td style="padding-left:14px;font-family:${BODY};font-size:12px;color:${MUTED};">Replying to this email also reaches them.</td>
        </tr></table>
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding:22px 8px 0;text-align:center;">
        <div style="font-family:${MONO};font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${MUTED};">Open whenever &middot; Free admission</div>
        <div style="font-family:${BODY};font-size:12px;color:${MUTED};margin-top:8px;">Sent by the Front Desk at <a href="${SITE_URL}/booking" style="color:${TEAL_DEEP};text-decoration:none;">maz.gallery</a>. Bot check passed, message stored nowhere but here.</div>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`

  const text = [
    `MAZ GALLERY · FRONT DESK`,
    isPrint ? `Print inquiry from ${m.name}` : `A note from ${m.name}`,
    `${when} Pacific`,
    ``,
    m.message,
    ``,
    ...(m.photo ? [`Photograph: ${m.photo.image.alt}${m.photo.image.location ? ` (${m.photo.image.location})` : ""}`, `${photoUrl}`, ``] : []),
    `Name: ${m.name}`,
    `Email: ${m.email}`,
    ...(m.phone ? [`Phone: ${m.phone}`] : []),
    ...(m.contactPref ? [`Prefers: ${m.contactPref}`] : []),
    ``,
    `Reply to this email to answer ${m.name}. Received at ${SITE_URL}/booking by ${AUTHOR_NAME}'s Front Desk.`,
  ].join("\n")

  return { subject, html, text }
}
