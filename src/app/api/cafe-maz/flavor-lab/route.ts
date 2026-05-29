import Anthropic from "@anthropic-ai/sdk"
import { CATALOG, findFlavor, flavorId, type Flavor } from "@/lib/cafe-maz-flavors"

export const runtime = "edge"

const SYSTEM_PROMPT = `You're helping Maz design hookah tobacco bowls for Café Maz, a home Levantine lounge. You build combos using ONLY the named Darkside and MustHave flavors on Maz's shelf — never invent flavor names or use brands not on the shelf. Always include a cold-mint or menthol base at 35-50% of the blend.`

const COMBO_SCHEMA = {
  type: "object",
  properties: {
    combos: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string", description: "Poetic 2-3 word name, Levantine/Mediterranean atmosphere" },
          ar: { type: "string", description: "Short Arabic equivalent of the name (or transliteration)" },
          blend: {
            type: "array",
            items: {
              type: "object",
              properties: {
                brand: { type: "string", enum: ["Darkside", "MustHave"] },
                line: { type: "string" },
                name: { type: "string", description: "Exact flavor name from the shelf" },
                percent: { type: "integer" },
              },
              required: ["brand", "line", "name", "percent"],
              additionalProperties: false,
            },
          },
          profile: {
            type: "array",
            items: { type: "string" },
            description: "1-2 short adjective tags like 'cool', 'herbal', 'smoky'",
          },
          note: { type: "string", description: "One-sentence tasting note under 22 words" },
          session: {
            type: "string",
            enum: ["morning", "afternoon", "late night", "lazy", "lively", "intimate"],
          },
        },
        required: ["name", "ar", "blend", "profile", "note", "session"],
        additionalProperties: false,
      },
    },
  },
  required: ["combos"],
  additionalProperties: false,
}

type ComboRequest = {
  selectedIds?: string[]
  mood?: string
}

function formatShelf(flavors: Flavor[]): string {
  const grouped: Record<string, Flavor[]> = {}
  for (const f of flavors) {
    const key = `${f.brand} · ${f.line}`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(f)
  }
  return Object.entries(grouped)
    .map(([heading, items]) => {
      const lines = items.map((i) => `  - ${i.name} [${i.profiles.join(", ")}]${i.note ? ` — ${i.note}` : ""}`)
      return `${heading}\n${lines.join("\n")}`
    })
    .join("\n\n")
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 503 },
    )
  }

  let body: ComboRequest
  try {
    body = (await req.json()) as ComboRequest
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const selectedIds = Array.isArray(body.selectedIds) ? body.selectedIds.slice(0, 4) : []
  const mood = typeof body.mood === "string" ? body.mood.slice(0, 200) : ""

  const selected = selectedIds
    .map((id) => findFlavor(id))
    .filter((f): f is Flavor => f !== undefined)

  const selectedSummary = selected.length
    ? selected.map((f) => `${f.brand} ${f.line} · ${f.name}`).join(", ")
    : "(none — pick anything reasonable from the shelf)"

  const userMessage =
    `THE SHELF (only use these exact flavors):\n${formatShelf(CATALOG)}\n\n` +
    `MAZ HAS REQUESTED: ${selectedSummary}\n` +
    (mood ? `Mood / occasion: ${mood}\n` : "") +
    `\nSuggest exactly 2 combos. Each must:\n` +
    `- have a poetic 2-3 word name (Levantine/Mediterranean atmosphere — nature, time of day, places, hours, weather, gardens)\n` +
    `- include a short Arabic equivalent of the name (or transliteration)\n` +
    `- use 2-4 flavors from THE SHELF in a blend that sums to 100% (always include a cold-mint or menthol base at 35-50%)\n` +
    `- include the exact brand, line, and name for each flavor (must match THE SHELF verbatim)\n` +
    `- if Maz selected specific flavors, you MUST build around those\n` +
    `- include 1-2 short adjective tags (e.g. "cool", "herbal", "smoky", "tropical")\n` +
    `- one-sentence tasting note under 22 words\n` +
    `- a session vibe: one of "morning", "afternoon", "late night", "lazy", "lively", "intimate"`

  const client = new Anthropic({ apiKey })

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
      output_config: {
        format: {
          type: "json_schema",
          schema: COMBO_SCHEMA,
        },
      },
    })

    const textBlock = response.content.find((b) => b.type === "text")
    if (!textBlock || textBlock.type !== "text") {
      return Response.json({ error: "Empty response from Claude." }, { status: 502 })
    }

    const parsed = JSON.parse(textBlock.text) as {
      combos: Array<{
        name: string
        ar: string
        blend: Array<{ brand: string; line: string; name: string; percent: number }>
        profile: string[]
        note: string
        session: string
      }>
    }

    // Validate that every named flavor exists in the catalog. If Claude
    // hallucinates a flavor name we'd rather know about it.
    for (const combo of parsed.combos) {
      for (const item of combo.blend) {
        if (!findFlavor(flavorId({ brand: item.brand as never, line: item.line, name: item.name, profiles: [] }))) {
          // Soft-fail — keep the combo but tag it
          ;(item as { offShelf?: boolean }).offShelf = true
        }
      }
    }

    const stamped = parsed.combos.map((c, i) => ({
      ...c,
      id: `gen-${Date.now()}-${i}`,
      num: `Nº ${String(i + 1).padStart(2, "0")}`,
    }))

    return Response.json({ combos: stamped })
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      return Response.json(
        { error: `Claude API error (${err.status}): ${err.message}` },
        { status: err.status ?? 502 },
      )
    }
    const msg = err instanceof Error ? err.message : "unknown error"
    return Response.json({ error: `Server error: ${msg}` }, { status: 500 })
  }
}
