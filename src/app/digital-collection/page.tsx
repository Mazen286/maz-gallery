import type { Metadata } from "next"
import Image from "next/image"
import { FadeIn } from "@/components/shared/fade-in"

export const metadata: Metadata = {
  title: "Digital Collection",
  description: "Explore curated digital collectibles and VeVe showcases.",
  alternates: { canonical: "/digital-collection" },
}

const COLLECTION = [
  { src: "/images/collection/avatar-freeguy.png", alt: "Free Guy Avatar", width: 600, height: 600 },
  { src: "/images/collection/IMG_7908.jpeg", alt: "Digital collectible showcase", width: 600, height: 800 },
  { src: "/images/collection/IMG_7895.jpeg", alt: "VeVe collectible display", width: 600, height: 800 },
  { src: "/images/collection/IMG_7903.jpeg", alt: "Digital art piece", width: 600, height: 800 },
  { src: "/images/collection/IMG_7906.jpeg", alt: "Collectible figure", width: 600, height: 800 },
  { src: "/images/collection/IMG_7914.jpeg", alt: "VeVe showcase room", width: 600, height: 800 },
  { src: "/images/collection/IMG_7915.jpeg", alt: "Digital art display", width: 600, height: 800 },
  { src: "/images/collection/IMG_7519.jpeg", alt: "Collectible exhibit", width: 600, height: 800 },
  { src: "/images/collection/IMG_1438.jpg", alt: "Digital art collection", width: 600, height: 800 },
  { src: "/images/collection/IMG_1909.jpg", alt: "VeVe collection piece", width: 600, height: 800 },
  { src: "/images/collection/IMG_0253.jpeg", alt: "Digital showcase", width: 600, height: 800 },
  { src: "/images/collection/IMG_0637.jpeg", alt: "Collectible art", width: 600, height: 800 },
  { src: "/images/collection/IMG_1007.jpeg", alt: "Digital gallery", width: 600, height: 800 },
  { src: "/images/collection/87192.jpg", alt: "VeVe collectible", width: 600, height: 800 },
]

export default function DigitalCollectionPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-charcoal pt-24 sm:pt-28">
        {/* Banner image */}
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src="/images/collection/metaverse-cyber-tron.png"
              alt="Digital collection banner"
              width={1200}
              height={500}
              className="h-[280px] w-full object-cover sm:h-[360px] lg:h-[420px]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-8 pb-10 text-center sm:pb-12">
              <h1 className="text-5xl font-bold text-white sm:text-6xl">
                Digital Collection
              </h1>
              <p className="mt-3 text-lg text-white/70">
                I collect digital art the way some people collect vinyl. These are
                the pieces I keep coming back to.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <FadeIn>
            <div className="grid items-start gap-8 md:grid-cols-[auto_1fr]">
              <Image
                src="/images/collection/avatar-freeguy.png"
                alt="Free Guy Avatar"
                width={200}
                height={200}
                className="rounded-full"
              />
              <p className="text-lg leading-relaxed text-charcoal">
                VeVe, NFTs, digital figurines. I got into collecting digital
                art early and I&apos;m still fascinated by where it&apos;s
                headed. These are some of my favorite pieces and showroom
                setups.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-white pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
            {COLLECTION.slice(1).map((item, i) => (
              <FadeIn key={item.src} delay={i * 50}>
                <div className="mb-4 break-inside-avoid overflow-hidden rounded-lg">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    className="h-auto w-full object-cover"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
