"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GALLERY, getPhotoBySlug, type GalleryImage } from "@/lib/gallery"
import type { GameSlug } from "@/lib/annex"
import dynamic from "next/dynamic"
import { PhotoPicker } from "./photo-picker"

// The games shuffle photos and read personal bests when they mount, so they
// render on the client only; the stage itself paints the backdrop first.
const JigsawPuzzle = dynamic(() => import("../jigsaw-puzzle").then((m) => m.JigsawPuzzle), { ssr: false })
const PairsGame = dynamic(() => import("./pairs-game").then((m) => m.PairsGame), { ssr: false })
const PostcardsGame = dynamic(() => import("./postcards-game").then((m) => m.PostcardsGame), { ssr: false })
const PinMapGame = dynamic(() => import("./pin-map-game").then((m) => m.PinMapGame), { ssr: false })

const randomImage = () => GALLERY[Math.floor(Math.random() * GALLERY.length)]

// Mounts one game full-screen. Back returns to the Annex hub.
export function GameStage({ game, photo }: { game: GameSlug; photo?: string }) {
  const router = useRouter()
  const back = () => router.push("/annex")

  const [jigsawImage, setJigsawImage] = useState<GalleryImage | null>(() => (photo ? getPhotoBySlug(photo) ?? null : null))
  const [picking, setPicking] = useState(!photo)

  // The stage covers the page; keep the page from scrolling underneath
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col"
      style={{ background: "radial-gradient(ellipse at 50% 0%, #161a26 0%, #0b0d13 55%, #08090d 100%)" }}
    >
      {game === "jigsaw" && (picking || !jigsawImage) && (
        <PhotoPicker
          images={GALLERY}
          onBack={back}
          onPick={(image) => {
            setJigsawImage(image)
            setPicking(false)
          }}
        />
      )}
      {game === "jigsaw" && !picking && jigsawImage && (
        <JigsawPuzzle
          image={jigsawImage}
          onClose={back}
          onChangePhoto={() => setPicking(true)}
          onRandomPhoto={() => setJigsawImage(randomImage())}
        />
      )}
      {game === "pairs" && <PairsGame images={GALLERY} onBack={back} />}
      {game === "postcards" && <PostcardsGame images={GALLERY} onBack={back} />}
      {game === "pin-the-map" && <PinMapGame onBack={back} />}
    </div>
  )
}
