import type { Metadata } from "next"
import { DailyPostcard } from "./daily-client"

export const metadata: Metadata = {
  title: "The Daily Postcard | A Photo Guessing Game",
  description:
    "One photograph from the collection every day. Guess where it was taken in three tries, keep your streak alive, and share your result.",
  alternates: { canonical: "/daily" },
  openGraph: {
    title: "The Daily Postcard",
    description: "One photo a day. Guess where it was taken in three tries.",
    url: "https://maz.gallery/daily",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630, alt: "The Daily Postcard at Maz Gallery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Daily Postcard",
    description: "One photo a day. Guess where it was taken in three tries.",
  },
}

export default function DailyPage() {
  return <DailyPostcard />
}
