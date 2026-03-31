"use client"

import { useRef, useState, useEffect, useMemo, useCallback, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { X } from "lucide-react"
import type { GalleryImage } from "@/lib/gallery"

const SPACING = 6
const HALL_W = 14
const HALL_H = 4.5
const LOAD_DIST = 16
const UNLOAD_DIST = 24

// Shared mobile input state (written by touch UI, read by Player)
const mobileInput = { forward: 0, strafe: 0, yawDelta: 0 }

// ─── Player ───
function Player() {
  const { camera, gl } = useThree()
  const keys = useRef(new Set<string>())
  const yaw = useRef(0)
  const pitch = useRef(0)
  const drag = useRef(false)
  const velocity = useRef(new THREE.Vector3())

  useEffect(() => {
    camera.position.set(0, 1.6, 2)
    camera.rotation.order = "YXZ"
    const kd = (e: KeyboardEvent) => keys.current.add(e.key.toLowerCase())
    const ku = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase())
    const md = () => { drag.current = true }
    const mu = () => { drag.current = false }
    const mm = (e: MouseEvent) => {
      if (!drag.current) return
      yaw.current -= e.movementX * 0.003
      pitch.current = Math.max(-1, Math.min(1, pitch.current - e.movementY * 0.003))
    }
    // Touch look (right half of screen)
    const lastTouch = { x: 0, y: 0 }
    const ts = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t && t.clientX > window.innerWidth / 2) {
        lastTouch.x = t.clientX; lastTouch.y = t.clientY
        drag.current = true
      }
    }
    const tm = (e: TouchEvent) => {
      if (!drag.current) return
      const t = e.touches[0]
      if (!t) return
      yaw.current -= (t.clientX - lastTouch.x) * 0.004
      pitch.current = Math.max(-1, Math.min(1, pitch.current - (t.clientY - lastTouch.y) * 0.004))
      lastTouch.x = t.clientX; lastTouch.y = t.clientY
    }
    const te = () => { drag.current = false }

    window.addEventListener("keydown", kd)
    window.addEventListener("keyup", ku)
    gl.domElement.addEventListener("mousedown", md)
    window.addEventListener("mouseup", mu)
    window.addEventListener("mousemove", mm)
    gl.domElement.addEventListener("touchstart", ts, { passive: true })
    gl.domElement.addEventListener("touchmove", tm, { passive: true })
    gl.domElement.addEventListener("touchend", te)
    return () => {
      window.removeEventListener("keydown", kd)
      window.removeEventListener("keyup", ku)
      gl.domElement.removeEventListener("mousedown", md)
      window.removeEventListener("mouseup", mu)
      window.removeEventListener("mousemove", mm)
      gl.domElement.removeEventListener("touchstart", ts)
      gl.domElement.removeEventListener("touchmove", tm)
      gl.domElement.removeEventListener("touchend", te)
    }
  }, [camera, gl])

  useFrame((_, dt) => {
    camera.rotation.set(pitch.current, yaw.current, 0, "YXZ")
    const k = keys.current
    const f = (k.has("w") || k.has("arrowup") ? 1 : 0) - (k.has("s") || k.has("arrowdown") ? 1 : 0) + mobileInput.forward
    const s = (k.has("d") || k.has("arrowright") ? 1 : 0) - (k.has("a") || k.has("arrowleft") ? 1 : 0) + mobileInput.strafe
    if (k.has("q")) yaw.current += 2 * dt
    if (k.has("e")) yaw.current -= 2 * dt
    yaw.current += mobileInput.yawDelta * dt
    mobileInput.yawDelta = 0 // consumed
    // Smooth acceleration
    const targetVel = new THREE.Vector3(s, 0, -f)
    if (targetVel.length() > 0.1) {
      targetVel.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current).multiplyScalar(4.5)
    }
    velocity.current.lerp(targetVel, 0.12)
    camera.position.addScaledVector(velocity.current, dt)
    camera.position.y = 1.6
  })
  return null
}


// ─── Lazy Painting ───
function Painting({ image, pos, onSelect }: { image: GalleryImage; pos: PaintingPos; onSelect: () => void }) {
  const { camera } = useThree()
  const [tex, setTex] = useState<THREE.Texture | null>(null)
  const loading = useRef(false)

  const aspect = image.width / image.height
  const maxW = 2.2, maxH = 1.8
  let w: number, h: number
  if (aspect > maxW / maxH) { w = maxW; h = maxW / aspect } else { h = maxH; w = maxH * aspect }

  useFrame(() => {
    const dx = camera.position.x - pos.x
    const dz = camera.position.z - pos.z
    const dist = Math.sqrt(dx * dx + dz * dz)
    if (dist < LOAD_DIST && !tex && !loading.current) {
      loading.current = true
      new THREE.TextureLoader().load(image.src, (t) => { setTex(t); loading.current = false })
    }
    if (dist > UNLOAD_DIST && tex) {
      tex.dispose()
      setTex(null)
      loading.current = false
    }
  })

  return (
    <group position={[pos.x, (pos.y || 0) + 2, pos.z]} rotation={[0, pos.rotY, 0]}>
      {/* Gold frame - furthest back */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[w + 0.16, h + 0.16, 0.04]} />
        <meshBasicMaterial color="#8a7a50" />
      </mesh>
      {/* Inner mat - slightly forward */}
      <mesh position={[0, 0, 0.025]}>
        <planeGeometry args={[w + 0.05, h + 0.05]} />
        <meshBasicMaterial color="#e0dbd0" />
      </mesh>
      {/* Photo or placeholder - most forward, clear of mat */}
      {tex ? (
        <mesh key="loaded" position={[0, 0, 0.03]} onClick={(e) => { e.stopPropagation(); onSelect() }} onPointerOver={() => { document.body.style.cursor = "pointer" }} onPointerOut={() => { document.body.style.cursor = "" }}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={tex} />
        </mesh>
      ) : (
        <mesh key="placeholder" position={[0, 0, 0.03]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial color="#1a1520" />
        </mesh>
      )}
      {/* Plaque */}
      {(image.location || image.alt) && (
        <group position={[0, -h / 2 - 0.22, 0.035]}>
          <mesh>
            <planeGeometry args={[Math.min(w, 1.2), 0.14]} />
            <meshBasicMaterial color="#1a1510" />
          </mesh>
        </group>
      )}
    </group>
  )
}

// ─── Infinite loop teleport ───
function InfiniteLoop({ endZ }: { endZ: number }) {
  const { camera } = useThree()
  useFrame(() => {
    if (camera.position.z < endZ) camera.position.z = 0
    if (camera.position.z > 4) camera.position.z = endZ + 2
  })
  return null
}

// ─── GLB Model artifact on pedestal ───
const ARTIFACT_MODELS = [
  { url: "/models/bastet.glb", scale: 0.25, y: 0.95 },
  { url: "/models/anubis.glb", scale: 0.2, y: 0.95 },
  { url: "/models/ra.glb", scale: 0.2, y: 0.95 },
  { url: "/models/jar.glb", scale: 0.18, y: 0.95 },
  { url: "/models/gem.glb", scale: 0.3, y: 1.0 },
  { url: "/models/obelisk.glb", scale: 0.1, y: 0.95 },
  { url: "/models/monolith.glb", scale: 0.15, y: 0.95 },
]

function ArtifactModel({ url, scale, yOffset }: { url: string; scale: number; yOffset: number }) {
  const { scene } = useGLTF(url)
  const cloned = useMemo(() => scene.clone(), [scene])
  return <primitive object={cloned} scale={scale} position={[0, yOffset, 0]} />
}

function Pedestal({ position, artifactIndex }: { position: [number, number, number]; artifactIndex: number }) {
  const model = ARTIFACT_MODELS[artifactIndex % ARTIFACT_MODELS.length]
  return (
    <group position={position}>
      {/* Pedestal base */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.45, 0.9, 0.45]} />
        <meshBasicMaterial color="#3a3040" />
      </mesh>
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[0.55, 0.04, 0.55]} />
        <meshBasicMaterial color="#4a4050" />
      </mesh>
      {/* 3D model */}
      <Suspense fallback={null}>
        <ArtifactModel url={model.url} scale={model.scale} yOffset={model.y} />
      </Suspense>
    </group>
  )
}

// ─── Fox companion (real GLB model) ───
function FoxCompanion() {
  const { scene, animations } = useGLTF("/models/fox.glb")
  const ref = useRef<THREE.Group>(null)
  const mixer = useRef<THREE.AnimationMixer | null>(null)
  const t = useRef(0)
  const target = useRef(new THREE.Vector3(0, 0, -3))
  const facing = useRef(0)
  const timer = useRef(3)
  const { camera } = useThree()

  useEffect(() => {
    if (animations.length > 0 && ref.current) {
      mixer.current = new THREE.AnimationMixer(ref.current)
      // Play the walk/run animation if available
      const clip = animations.find(a => a.name.toLowerCase().includes("run")) || animations[0]
      if (clip) {
        const action = mixer.current.clipAction(clip)
        action.play()
      }
    }
    return () => { mixer.current?.stopAllAction() }
  }, [animations])

  useFrame((_, dt) => {
    if (!ref.current) return
    mixer.current?.update(dt)
    t.current += dt
    timer.current -= dt

    const fox = ref.current.position
    const cam = camera.position

    if (timer.current <= 0) {
      target.current.set(
        cam.x + (Math.random() - 0.5) * 5,
        0,
        cam.z - 4 - Math.random() * 6
      )
      target.current.x = THREE.MathUtils.clamp(target.current.x, -5, 5)
      timer.current = 2 + Math.random() * 4
    }

    const dx = target.current.x - fox.x
    const dz = target.current.z - fox.z
    const dist = Math.sqrt(dx * dx + dz * dz)
    if (dist > 0.5) {
      fox.x += (dx / dist) * 1.5 * dt
      fox.z += (dz / dist) * 1.5 * dt
      facing.current = THREE.MathUtils.lerp(facing.current, Math.atan2(dx, dz), 0.06)
    }

    ref.current.rotation.y = facing.current
  })

  const cloned = useMemo(() => scene.clone(), [scene])

  return (
    <group ref={ref} position={[1, 0, -3]}>
      <primitive object={cloned} scale={0.012} />
    </group>
  )
}

// ─── Open sky with stars + planets (all point-based, nearly free) ───
function Sky({ spread }: { spread: number }) {
  const geom = useMemo(() => {
    const count = 120
    const pts = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Spread stars across a wide dome above
      const angle = Math.random() * Math.PI * 2
      const radius = 5 + Math.random() * spread * 0.4
      pts[i * 3] = Math.cos(angle) * radius
      pts[i * 3 + 1] = HALL_H + 2 + Math.random() * 20
      pts[i * 3 + 2] = Math.sin(angle) * radius - spread * 0.3
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(pts, 3))
    return g
  }, [spread])

  return (
    <group>
      <points geometry={geom}>
        <pointsMaterial size={0.08} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
      </points>
      {/* A few "planets" - just colored spheres far above, perspective makes them feel huge */}
      <mesh position={[15, HALL_H + 25, -spread * 0.3]}>
        <sphereGeometry args={[3, 8, 8]} />
        <meshBasicMaterial color="#6a4a3a" />
      </mesh>
      <mesh position={[-20, HALL_H + 35, -spread * 0.6]}>
        <sphereGeometry args={[5, 8, 8]} />
        <meshBasicMaterial color="#3a4a6a" />
      </mesh>
      {/* Ring around the blue planet */}
      <mesh position={[-20, HALL_H + 35, -spread * 0.6]} rotation={[1.2, 0.2, 0.3]}>
        <torusGeometry args={[7, 0.3, 4, 24]} />
        <meshBasicMaterial color="#3a4a6a" transparent opacity={0.3} />
      </mesh>
      <mesh position={[8, HALL_H + 45, -spread * 0.8]}>
        <sphereGeometry args={[2, 6, 6]} />
        <meshBasicMaterial color="#5a3a4a" />
      </mesh>
    </group>
  )
}

// ─── Museum layout: corridors, intersections, and upper floor ───
interface PaintingPos {
  x: number
  y: number
  z: number
  rotY: number
}

// A corridor segment: floor + 2 walls
interface Corridor {
  cx: number; cz: number; cy: number  // center
  length: number; width: number
  rotY: number // 0 = along Z axis, PI/2 = along X axis
  color: string
}

function useMuseumLayout(imageCount: number) {
  return useMemo(() => {
    const positions: PaintingPos[] = []
    const corridors: Corridor[] = []
    const half = SPACING / 2
    const hw = HALL_W / 2

    // Split images into sections
    const mainCount = Math.min(24, imageCount)
    const leftCount = Math.min(12, Math.max(0, imageCount - 24))
    const rightCount = Math.max(0, imageCount - 36)

    let z = -3

    // ═══ MAIN HALL ═══
    for (let i = 0; i < mainCount; i++) {
      const side = i % 2 === 0 ? -1 : 1
      positions.push({ x: side * (hw - 0.06), y: 0, z, rotY: -side * Math.PI / 2 })
      z -= half
    }
    const mainEnd = z
    const mainLen = Math.abs(mainEnd) + 8
    corridors.push({ cx: 0, cz: mainEnd / 2, cy: 0, length: mainLen, width: HALL_W, rotY: 0, color: "#2a2535" })

    // ═══ LEFT WING (at 1/3 point) ═══
    const leftWingZ = -3 - Math.floor(mainCount / 3) * half
    let lx = -hw - 3
    for (let i = 0; i < leftCount; i++) {
      const side = i % 2 === 0 ? -1 : 1
      positions.push({ x: lx, y: 0, z: leftWingZ + side * (hw - 0.06), rotY: side * Math.PI / 2 + Math.PI / 2 })
      lx -= half
    }
    if (leftCount > 0) {
      const leftLen = leftCount * half + 6
      corridors.push({ cx: -hw - leftLen / 2, cz: leftWingZ, cy: 0, length: leftLen, width: HALL_W, rotY: Math.PI / 2, color: "#252038" })
    }

    // ═══ RIGHT WING (at 2/3 point) ═══
    const rightWingZ = -3 - Math.floor(mainCount * 2 / 3) * half
    let rx = hw + 3
    for (let i = 0; i < rightCount; i++) {
      const side = i % 2 === 0 ? -1 : 1
      positions.push({ x: rx, y: 0, z: rightWingZ + side * (hw - 0.06), rotY: -side * Math.PI / 2 + Math.PI / 2 })
      rx += half
    }
    if (rightCount > 0) {
      const rightLen = rightCount * half + 6
      corridors.push({ cx: hw + rightLen / 2, cz: rightWingZ, cy: 0, length: rightLen, width: HALL_W, rotY: Math.PI / 2, color: "#252038" })
    }

    return { positions, corridors, mainEnd }
  }, [imageCount])
}

// ─── Scene ───

function Scene({ images, onSelectImage }: { images: GalleryImage[]; onSelectImage: (i: number) => void }) {
  const { positions, corridors, mainEnd } = useMuseumLayout(images.length)

  return (
    <>
      <ambientLight intensity={3} />
      <fog attach="fog" args={["#080818", 20, 55]} />

      {/* Infinite loop: teleport back to start when past the end */}
      <InfiniteLoop endZ={mainEnd - 5} />

      {/* ═══ CORRIDORS (floor + walls for each) ═══ */}
      {corridors.map((c, ci) => {
        const isHorizontal = Math.abs(c.rotY) > 0.1
        return (
          <group key={`cor${ci}`}>
            {/* Floor */}
            <mesh
              rotation={[-Math.PI / 2, isHorizontal ? Math.PI / 2 : 0, 0]}
              position={[c.cx, c.cy + 0.001, c.cz]}
            >
              <planeGeometry args={[c.width, c.length]} />
              <meshBasicMaterial color={c.color} />
            </mesh>
            {/* Carpet */}
            <mesh
              rotation={[-Math.PI / 2, isHorizontal ? Math.PI / 2 : 0, 0]}
              position={[c.cx, c.cy + 0.004, c.cz]}
            >
              <planeGeometry args={[1.6, c.length]} />
              <meshBasicMaterial color="#352540" />
            </mesh>
            {/* Ceiling */}
            <mesh
              rotation={[Math.PI / 2, isHorizontal ? Math.PI / 2 : 0, 0]}
              position={[c.cx, c.cy + HALL_H, c.cz]}
            >
              <planeGeometry args={[c.width, c.length]} />
              <meshBasicMaterial color="#0c0a1a" />
            </mesh>
            {/* Walls */}
            {isHorizontal ? (
              <>
                <mesh position={[c.cx, c.cy + HALL_H / 2, c.cz - c.width / 2]}>
                  <planeGeometry args={[c.length, HALL_H]} />
                  <meshBasicMaterial color="#222040" />
                </mesh>
                <mesh position={[c.cx, c.cy + HALL_H / 2, c.cz + c.width / 2]} rotation={[0, Math.PI, 0]}>
                  <planeGeometry args={[c.length, HALL_H]} />
                  <meshBasicMaterial color="#222040" />
                </mesh>
              </>
            ) : (
              <>
                <mesh rotation={[0, Math.PI / 2, 0]} position={[-c.width / 2 + c.cx, c.cy + HALL_H / 2, c.cz]}>
                  <planeGeometry args={[c.length, HALL_H]} />
                  <meshBasicMaterial color="#222040" />
                </mesh>
                <mesh rotation={[0, -Math.PI / 2, 0]} position={[c.width / 2 + c.cx, c.cy + HALL_H / 2, c.cz]}>
                  <planeGeometry args={[c.length, HALL_H]} />
                  <meshBasicMaterial color="#222040" />
                </mesh>
              </>
            )}
          </group>
        )
      })}

      {/* ═══ TEAL GLOW STRIPS along corridor floors ═══ */}
      {corridors.map((c, ci) => {
        const isH = Math.abs(c.rotY) > 0.1
        return (
          <group key={`glow${ci}`}>
            <mesh
              rotation={[-Math.PI / 2, isH ? Math.PI / 2 : 0, 0]}
              position={[c.cx + (isH ? 0 : -c.width / 2 + 0.15), c.cy + 0.006, c.cz + (isH ? -c.width / 2 + 0.15 : 0)]}
            >
              <planeGeometry args={[0.06, c.length]} />
              <meshBasicMaterial color="#78c8d6" transparent opacity={0.2} />
            </mesh>
            <mesh
              rotation={[-Math.PI / 2, isH ? Math.PI / 2 : 0, 0]}
              position={[c.cx + (isH ? 0 : c.width / 2 - 0.15), c.cy + 0.006, c.cz + (isH ? c.width / 2 - 0.15 : 0)]}
            >
              <planeGeometry args={[0.06, c.length]} />
              <meshBasicMaterial color="#78c8d6" transparent opacity={0.2} />
            </mesh>
          </group>
        )
      })}

      {/* ═══ SKY ═══ */}
      <Sky spread={Math.abs(mainEnd) + 20} />

      {/* ═══ PAINTINGS ═══ */}
      {images.map((img, i) => {
        const p = positions[i]
        if (!p) return null
        return (
          <Painting key={img.src} image={img} pos={p} onSelect={() => onSelectImage(i)} />
        )
      })}

      {/* ═══ PEDESTALS WITH GLB ARTIFACTS ═══ */}
      {positions.map((p, i) => {
        if (i % 7 !== 4) return null
        const pedSide = i % 14 < 7 ? -1 : 1
        return (
          <Pedestal
            key={`ped${i}`}
            position={[pedSide * 2, p.y || 0, p.z]}
            artifactIndex={Math.floor(i / 7)}
          />
        )
      })}

      {/* ═══ FOX COMPANION ═══ */}
      <Suspense fallback={null}>
        <FoxCompanion />
      </Suspense>
      <Player />
    </>
  )
}

// ─── Mobile Controls ───
function MobileJoystick() {
  const ref = useRef<HTMLDivElement>(null)

  const handleTouch = useCallback((e: React.TouchEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const t = e.touches[0]
    if (!t) return
    const dx = (t.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const dy = (t.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    mobileInput.forward = -Math.max(-1, Math.min(1, dy))
    mobileInput.strafe = Math.max(-1, Math.min(1, dx))
  }, [])

  const handleEnd = useCallback(() => {
    mobileInput.forward = 0
    mobileInput.strafe = 0
  }, [])

  return (
    <div
      ref={ref}
      className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm"
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
      onTouchEnd={handleEnd}
    >
      <div className="text-center">
        <p className="text-lg text-white/30">+</p>
        <p className="text-[8px] text-white/20">move</p>
      </div>
    </div>
  )
}

function MobileRotateButtons() {
  return (
    <div className="flex gap-3">
      <button
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/40 backdrop-blur-sm"
        onTouchStart={() => { mobileInput.yawDelta = 3 }}
        onTouchEnd={() => { mobileInput.yawDelta = 0 }}
      >
        ←
      </button>
      <button
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/40 backdrop-blur-sm"
        onTouchStart={() => { mobileInput.yawDelta = -3 }}
        onTouchEnd={() => { mobileInput.yawDelta = 0 }}
      >
        →
      </button>
    </div>
  )
}

// ─── Export ───
export function Museum3D({ images, onExit }: { images: GalleryImage[]; onExit: () => void }) {
  const [started, setStarted] = useState(false)
  const [ready, setReady] = useState(false)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const selected = selectedImage !== null ? images[selectedImage] : null

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedImage !== null) setSelectedImage(null)
        else onExit()
      }
    }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [onExit, selectedImage])

  return (
    <div className="fixed inset-0 z-40 bg-black">
      <button onClick={onExit} className="absolute right-6 top-6 z-50 rounded-full bg-white/10 p-2 text-white/60 backdrop-blur-sm hover:bg-white/20 hover:text-white" aria-label="Exit">
        <X className="size-5" />
      </button>

      {!started && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Welcome to the Museum</h2>
            <p className="mt-3 text-sm text-white/50">A first-person gallery experience</p>
            <div className="mt-8 space-y-2 text-xs text-white/30">
              <div className="hidden sm:block space-y-2">
                <p><kbd className="rounded border border-white/20 px-1.5 py-0.5">W A S D</kbd> move &nbsp; <kbd className="rounded border border-white/20 px-1.5 py-0.5">Q E</kbd> rotate</p>
                <p><kbd className="rounded border border-white/20 px-1.5 py-0.5">Click + Drag</kbd> look &nbsp; <kbd className="rounded border border-white/20 px-1.5 py-0.5">ESC</kbd> exit</p>
              </div>
              <div className="sm:hidden space-y-2">
                <p>Left joystick to move</p>
                <p>Right buttons to rotate</p>
                <p>Drag right side of screen to look around</p>
              </div>
            </div>
            <button onClick={() => setStarted(true)} className="mt-8 rounded-full bg-teal/80 px-8 py-3 text-sm font-semibold text-white hover:bg-teal">
              Enter Museum
            </button>
          </div>
        </div>
      )}

      {started && !ready && (
        <div className="absolute inset-0 z-40 flex items-center justify-center">
          <p className="text-sm text-white/40">Loading museum...</p>
        </div>
      )}

      {started && (
        <Canvas
          camera={{ fov: 70, near: 0.1, far: 50 }}
          onCreated={() => setReady(true)}
          gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
          dpr={1}
          style={{ opacity: ready ? 1 : 0, transition: "opacity 0.5s" }}
        >
          <Scene images={images} onSelectImage={setSelectedImage} />
        </Canvas>
      )}

      {/* Story overlay */}
      {selected && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" style={{ animation: "fadeIn 0.3s ease-out" }} />

          {/* Content */}
          <div
            className="pointer-events-none relative z-10 mx-auto flex max-h-[92vh] max-w-3xl flex-col items-center gap-4 overflow-y-auto px-8 py-6"
            style={{ animation: "imageFloatIn 0.5s cubic-bezier(0.33, 1, 0.68, 1) forwards" }}
          >
            {/* Photo - generous padding, never cut off */}
            <div className="pointer-events-auto flex flex-shrink-0 items-center justify-center">
              <img
                src={selected.src}
                alt={selected.alt}
                className="max-h-[45vh] max-w-[85vw] w-auto rounded-lg object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Story panel - always below */}
            <div className="pointer-events-auto max-w-lg pb-8 text-center" onClick={(e) => e.stopPropagation()}>
              {selected.location && (
                <p className="text-[10px] uppercase tracking-[0.4em] text-teal/70">
                  {selected.location}
                </p>
              )}
              <h3 className="mt-2 text-2xl font-bold text-white">
                {selected.alt}
              </h3>
              {selected.story && (
                <p className="mt-4 text-sm leading-relaxed text-white/50 italic">
                  {selected.story}
                </p>
              )}
              <button
                onClick={() => setSelectedImage(null)}
                className="mt-6 rounded-full border border-white/15 px-5 py-2 text-xs text-white/40 transition-colors hover:border-white/30 hover:text-white/70"
              >
                Back to Museum
              </button>

              {/* Nav between photos */}
              <div className="mt-4 flex justify-center gap-3">
                {selectedImage !== null && selectedImage > 0 && (
                  <button
                    onClick={() => setSelectedImage(selectedImage - 1)}
                    className="text-xs text-white/30 hover:text-teal"
                  >
                    Previous
                  </button>
                )}
                {selectedImage !== null && selectedImage < images.length - 1 && (
                  <button
                    onClick={() => setSelectedImage(selectedImage + 1)}
                    className="text-xs text-white/30 hover:text-teal"
                  >
                    Next
                  </button>
                )}
              </div>

              <p className="mt-4 font-mono text-[9px] text-white/15">
                {(selectedImage ?? 0) + 1} / {images.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Desktop hint */}
      {started && ready && !selected && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-50 -translate-x-1/2 hidden sm:block">
          <p className="text-[10px] text-white/25">WASD move / QE rotate / Click+drag look / Click a photo / ESC exit</p>
        </div>
      )}

      {/* Mobile joystick */}
      {started && ready && !selected && (
        <div className="absolute bottom-8 left-8 z-50 sm:hidden">
          <MobileJoystick />
        </div>
      )}
      {started && ready && !selected && (
        <div className="absolute bottom-8 right-8 z-50 sm:hidden">
          <MobileRotateButtons />
        </div>
      )}
    </div>
  )
}
