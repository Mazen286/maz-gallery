"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GALLERY, getPhotoBySlug, type GalleryImage } from "@/lib/gallery"
import type { GameSlug } from "@/lib/annex"
import { JigsawPuzzle } from "../jigsaw-puzzle"
import { PhotoPicker } from "./photo-picker"
import { PairsGame } from "./pairs-game"
import { PostcardsGame } from "./postcards-game"
import { PinMapGame } from "./pin-map-game"

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
