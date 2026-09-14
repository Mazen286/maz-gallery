import Link from "next/link"
import styles from "./BackToIndex.module.css"

// Standardized "back to the Café Maz index" control, shared across the
// print menu, barista book, and flavor lab. The guest-facing digital
// menu (/cafe-maz/cafe) intentionally does not use it.
export function BackToIndex({ className }: { className?: string }) {
  return (
    <Link
      href="/cafe-maz"
      className={className ? `${styles.back} ${className}` : styles.back}
    >
      ← back to index
    </Link>
  )
}
