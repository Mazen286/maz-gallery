// A room's section heading: the room number (the same "No. 0x" the header,
// directory, placards and footer use), the room's name, and a hairline.
// One numbering system across the site: numbers only ever name rooms.
export function SectionHead({
  number,
  title,
  tone = "light",
  className = "",
}: {
  number?: string
  title: string
  tone?: "light" | "dark"
  className?: string
}) {
  return (
    <div className={`flex items-baseline gap-4 ${className}`}>
      {number && (
        <span className={`shrink-0 font-display text-[17px] italic ${tone === "dark" ? "text-brass" : "text-brass-ink"}`}>
          {number}
        </span>
      )}
      <span className={`label shrink-0 ${tone === "dark" ? "text-ivory" : "text-ink"}`}>{title}</span>
      <span aria-hidden="true" className={`h-px flex-1 -translate-y-1 ${tone === "dark" ? "bg-wall-line" : "bg-line"}`} />
    </div>
  )
}
