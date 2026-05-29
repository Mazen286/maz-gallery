import type { Metadata } from "next"
import { Cinzel, Cormorant_Garamond, Aref_Ruqaa, JetBrains_Mono } from "next/font/google"
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

const arefRuqaa = Aref_Ruqaa({
  variable: "--font-aref-ruqaa",
  subsets: ["arabic"],
  weight: ["400", "700"],
})

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Café Maz",
  description: "A one-table café — open whenever you're over.",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: undefined },
  openGraph: { images: [] },
  twitter: { card: "summary" },
}

export default function CafeMazLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`cafe-maz ${cinzel.variable} ${cormorant.variable} ${arefRuqaa.variable} ${jetbrains.variable}`}
    >
      {children}
    </div>
  )
}
