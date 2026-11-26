import { SITE_URL, AUTHOR_NAME, SITE_DESCRIPTION, ROOMS } from "./constants"
import { ALL_PROJECTS, PROJECT_ROOMS } from "./projects"
import { PROJECT_PAGES } from "./project-pages"
import { BLOG_POSTS } from "./blog"
import { GAMES } from "./annex"

// llms.txt (https://llmstxt.org): a plain map of the site for AI answer
// engines. Built from the same data as the pages, prerendered at build.

const FIGMENT_FOREVER_SUMMARY =
  "Figment Forever makes wedding invitations and websites, built first for a friend's wedding, with personal invitations, replies and tracking in English and Arabic."

const summaryOf = (slug: string) =>
  slug === "figment-forever" ? FIGMENT_FOREVER_SUMMARY : (PROJECT_PAGES.find((p) => p.slug === slug)?.summary ?? "")

// Copy that still waits on Maz is written in [square brackets]; never hand that to an answer engine as fact
const sourced = (s: string) => !/\[[^\]]+\]/.test(s)

export function llmsTxt(): string {
  const lines: string[] = []
  lines.push(`# Maz Gallery`, "")
  lines.push(`> ${SITE_DESCRIPTION} Maz Gallery (maz.gallery) is his personal site: a gallery of his travel photographs, the projects he builds, and small games made from the photographs.`, "")
  lines.push(`Written by ${AUTHOR_NAME}. Every project below has its own page with what it is, how it was built and a link to the project itself.`, "")
  lines.push("## Projects", "")
  for (const room of PROJECT_ROOMS) {
    for (const p of ALL_PROJECTS.filter((x) => x.room === room.id)) {
      lines.push(`- [${p.title}](${SITE_URL}/projects/${p.slug}): ${summaryOf(p.slug)}`)
    }
  }
  lines.push("", "## Rooms", "")
  for (const r of ROOMS) lines.push(`- [${r.name}](${SITE_URL}${r.href === "/" ? "" : r.href})`)
  lines.push("", "## Writing", "")
  for (const post of BLOG_POSTS) lines.push(`- [${post.title}](${SITE_URL}/blog/${post.slug}): ${post.description}`)
  lines.push("", "## Optional", "")
  for (const g of GAMES) lines.push(`- [${g.title}](${SITE_URL}/annex/${g.slug}): ${g.description}`)
  lines.push(`- [Full project notes](${SITE_URL}/llms-full.txt): every project page as plain text`)
  return lines.join("\n") + "\n"
}

export function llmsFullTxt(): string {
  const out: string[] = [`# Maz Gallery: projects by ${AUTHOR_NAME}`, "", `> ${SITE_DESCRIPTION}`, ""]
  for (const p of ALL_PROJECTS) {
    const page = PROJECT_PAGES.find((x) => x.slug === p.slug)
    out.push(`## ${p.title}`, "", `URL: ${SITE_URL}/projects/${p.slug}`)
    out.push(`Lives at: ${p.url.startsWith("http") ? p.url : SITE_URL + p.url}`, "")
    out.push(summaryOf(p.slug), "")
    if (page) {
      for (const f of page.facts) if (sourced(f.value)) out.push(`- ${f.label}: ${f.value}${f.note && sourced(f.note) ? ` (${f.note})` : ""}`)
      out.push("")
      for (const para of page.what) if (sourced(para)) out.push(para, "")
      for (const b of page.built) if (sourced(b.body)) out.push(`### ${b.heading}`, "", b.body, "")
    } else {
      out.push(p.description, "")
    }
  }
  return out.join("\n")
}
