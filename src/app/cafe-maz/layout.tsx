import type { Metadata } from "next"
import { Cinzel, Cormorant_Garamond, Amiri, JetBrains_Mono } from "next/font/google"
import "./cafe-maz.css"

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
})

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
})

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: { absolute: "Café Maz" },
  description: "A one-table café — open whenever you're over.",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: undefined },
  openGraph: {
    type: "website",
    title: "Café Maz",
    description: "A one-table café — open whenever you're over.",
    siteName: "Café Maz",
  },
  twitter: {
    card: "summary_large_image",
    title: "Café Maz",
    description: "A one-table café — open whenever you're over.",
  },
}

export default function CafeMazLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`cafe-maz ${cinzel.variable} ${cormorant.variable} ${amiri.variable} ${jetbrains.variable}`}
    >
      {children}
    </div>
  )
}
