"use client"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { X } from "lucide-react"
import type { GalleryImage } from "@/lib/gallery"

/* ────────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────────── */

interface JigsawPuzzleProps {
  image: GalleryImage
  difficulty?: "easy" | "medium" | "hard"
  onClose: () => void
  onNewImage?: () => void
}

type EdgeType = "flat" | "tab" | "blank"

interface PieceData {
  row: number
  col: number
  edges: { top: EdgeType; right: EdgeType; bottom: EdgeType; left: EdgeType }
  placed: boolean
  x: number
  y: number
}

const DIFFICULTY_MAP = {
  easy: { cols: 3, rows: 2 },
  medium: { cols: 4, rows: 3 },
  hard: { cols: 6, rows: 4 },
} as const

const OVERHANG = 0.2 // 20% of cell size for tab overhang
const SNAP_DISTANCE = 30

/* ────────────────────────────────────────────────────────────
   SVG path generation for jigsaw piece clip-paths
   ──────────────────────────────────────────────────────────── */

/**
 * Generates the SVG path for a single jigsaw piece.
 * Coordinates are in a viewBox of 0 0 100 100,
 * where the "cell" occupies the region from (overhang, overhang) to (100-overhang, 100-overhang),
 * leaving room for tabs on all sides.
 *
 * ovh = overhang in viewBox units = OVERHANG / (1 + 2*OVERHANG) * 100
 * cellSize in viewBox units = 100 - 2*ovh
 */
function generatePiecePath(edges: {
  top: EdgeType
  right: EdgeType
  bottom: EdgeType
  left: EdgeType
}): string {
  const ovh = (OVERHANG / (1 + 2 * OVERHANG)) * 100
  const cs = 100 - 2 * ovh // cell size in viewBox units

  // Corner coordinates of the cell region
  const x0 = ovh
  const y0 = ovh
  const x1 = ovh + cs
  const y1 = ovh + cs

  const parts: string[] = []

  // Start at top-left corner
  parts.push(`M ${x0} ${y0}`)

  // Top edge: left to right
  if (edges.top === "flat") {
    parts.push(`L ${x1} ${y0}`)
  } else {
    const dir = edges.top === "tab" ? -1 : 1
    const tabH = cs * 0.20
    parts.push(`L ${x0 + cs * 0.35} ${y0}`)
    parts.push(
      `C ${x0 + cs * 0.35} ${y0 + dir * tabH * 0.6},` +
      ` ${x0 + cs * 0.38} ${y0 + dir * tabH},` +
      ` ${x0 + cs * 0.5} ${y0 + dir * tabH}`
    )
    parts.push(
      `C ${x0 + cs * 0.62} ${y0 + dir * tabH},` +
      ` ${x0 + cs * 0.65} ${y0 + dir * tabH * 0.6},` +
      ` ${x0 + cs * 0.65} ${y0}`
    )
    parts.push(`L ${x1} ${y0}`)
  }

  // Right edge: top to bottom
  if (edges.right === "flat") {
    parts.push(`L ${x1} ${y1}`)
  } else {
    const dir = edges.right === "tab" ? 1 : -1
    const tabH = cs * 0.20
    parts.push(`L ${x1} ${y0 + cs * 0.35}`)
    parts.push(
      `C ${x1 + dir * tabH * 0.6} ${y0 + cs * 0.35},` +
      ` ${x1 + dir * tabH} ${y0 + cs * 0.38},` +
      ` ${x1 + dir * tabH} ${y0 + cs * 0.5}`
    )
    parts.push(
      `C ${x1 + dir * tabH} ${y0 + cs * 0.62},` +
      ` ${x1 + dir * tabH * 0.6} ${y0 + cs * 0.65},` +
      ` ${x1} ${y0 + cs * 0.65}`
    )
    parts.push(`L ${x1} ${y1}`)
  }

  // Bottom edge: right to left
  if (edges.bottom === "flat") {
    parts.push(`L ${x0} ${y1}`)
  } else {
    const dir = edges.bottom === "tab" ? 1 : -1
    const tabH = cs * 0.20
    parts.push(`L ${x0 + cs * 0.65} ${y1}`)
    parts.push(
      `C ${x0 + cs * 0.65} ${y1 + dir * tabH * 0.6},` +
      ` ${x0 + cs * 0.62} ${y1 + dir * tabH},` +
      ` ${x0 + cs * 0.5} ${y1 + dir * tabH}`
    )
    parts.push(
      `C ${x0 + cs * 0.38} ${y1 + dir * tabH},` +
      ` ${x0 + cs * 0.35} ${y1 + dir * tabH * 0.6},` +
      ` ${x0 + cs * 0.35} ${y1}`
    )
    parts.push(`L ${x0} ${y1}`)
  }

  // Left edge: bottom to top
  if (edges.left === "flat") {
    parts.push(`L ${x0} ${y0}`)
  } else {
    const dir = edges.left === "tab" ? -1 : 1
    const tabH = cs * 0.20
    parts.push(`L ${x0} ${y0 + cs * 0.65}`)
    parts.push(
      `C ${x0 + dir * tabH * 0.6} ${y0 + cs * 0.65},` +
      ` ${x0 + dir * tabH} ${y0 + cs * 0.62},` +
      ` ${x0 + dir * tabH} ${y0 + cs * 0.5}`
    )
    parts.push(
      `C ${x0 + dir * tabH} ${y0 + cs * 0.38},` +
      ` ${x0 + dir * tabH * 0.6} ${y0 + cs * 0.35},` +
      ` ${x0} ${y0 + cs * 0.35}`
    )
    parts.push(`L ${x0} ${y0}`)
  }

  parts.push("Z")
  return parts.join(" ")
}

/* ────────────────────────────────────────────────────────────
   Grid + piece generation
   ──────────────────────────────────────────────────────────── */

function generateGrid(
  rows: number,
  cols: number,
  boardW: number,
  boardH: number
): PieceData[] {
  // Pre-compute horizontal edges (between col and col+1)
  // and vertical edges (between row and row+1)
  const hEdges: ("tab" | "blank")[][] = []
  const vEdges: ("tab" | "blank")[][] = []

  for (let r = 0; r < rows; r++) {
    hEdges[r] = []
    for (let c = 0; c < cols - 1; c++) {
      hEdges[r][c] = Math.random() > 0.5 ? "tab" : "blank"
    }
  }
  for (let r = 0; r < rows - 1; r++) {
    vEdges[r] = []
    for (let c = 0; c < cols; c++) {
      vEdges[r][c] = Math.random() > 0.5 ? "tab" : "blank"
    }
  }

  const pieces: PieceData[] = []

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const top: EdgeType =
        r === 0 ? "flat" : vEdges[r - 1][c] === "tab" ? "blank" : "tab"
      const bottom: EdgeType =
        r === rows - 1 ? "flat" : vEdges[r][c]
      const left: EdgeType =
        c === 0 ? "flat" : hEdges[r][c - 1] === "tab" ? "blank" : "tab"
      const right: EdgeType =
        c === cols - 1 ? "flat" : hEdges[r][c]

      // Scatter pieces: outside the board if room, otherwise on top of it
      const cellW = boardW / cols
      const cellH = boardH / rows
      const pw = cellW * (1 + 2 * OVERHANG)
      const ph = cellH * (1 + 2 * OVERHANG)
      const viewW = typeof window !== "undefined" ? window.innerWidth : 1200
      const sideSpace = (viewW - boardW) / 2
      const canScatterOutside = sideSpace > pw + 20
      const side = (r * cols + c) % 2
      let scatterX: number, scatterY: number
      if (canScatterOutside) {
        if (side === 0) {
          scatterX = -(pw + 10 + Math.random() * Math.min(pw * 0.5, sideSpace - pw - 30))
          scatterY = Math.random() * (boardH - ph)
        } else {
          scatterX = boardW + 10 + Math.random() * Math.min(pw * 0.5, sideSpace - pw - 30)
          scatterY = Math.random() * (boardH - ph)
        }
      } else {
        // Not enough room - scatter on the board
        scatterX = Math.random() * (boardW - pw)
        scatterY = Math.random() * (boardH - ph)
      }

      pieces.push({
        row: r,
        col: c,
        edges: { top, right, bottom, left },
        placed: false,
        x: scatterX,
        y: scatterY,
      })
    }
  }

  return pieces
}

/* ────────────────────────────────────────────────────────────
   Confetti particle
   ──────────────────────────────────────────────────────────── */

function ConfettiOverlay() {
  const particles = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      size: 4 + Math.random() * 6,
      color: ["#78c8d6", "#ffffff", "#f0c040", "#e06070", "#80e0a0"][
        Math.floor(Math.random() * 5)
      ],
      rotation: Math.random() * 360,
    }))
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: "-10px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.size > 7 ? "50%" : "1px",
            transform: `rotate(${p.rotation}deg)`,
            animation: `jigsaw-confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Main component
   ──────────────────────────────────────────────────────────── */

export function JigsawPuzzle({
  image,
  difficulty: initialDifficulty = "medium",
  onClose,
  onNewImage,
}: JigsawPuzzleProps) {
  const [difficulty, setDifficulty] = useState(initialDifficulty)
  const [pieces, setPieces] = useState<PieceData[]>([])
  const [moves, setMoves] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [timerStarted, setTimerStarted] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [boardSize, setBoardSize] = useState({ w: 600, h: 400 })

  const boardRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    pieceIdx: number
    startX: number
    startY: number
    origX: number
    origY: number
  } | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { cols, rows } = DIFFICULTY_MAP[difficulty]

  // Compute board size based on image aspect ratio and viewport
  const computeBoardSize = useCallback(() => {
    const aspect = image.width / image.height
    const maxW = Math.min(window.innerWidth * 0.85, 900)
    const maxH = window.innerHeight * 0.6

    let w: number, h: number
    if (maxW / aspect <= maxH) {
      w = maxW
      h = maxW / aspect
    } else {
      h = maxH
      w = maxH * aspect
    }
    return { w: Math.round(w), h: Math.round(h) }
  }, [image.width, image.height])

  // Initialize / reset puzzle
  const initPuzzle = useCallback(
    (diff: "easy" | "medium" | "hard") => {
      const size = computeBoardSize()
      setBoardSize(size)
      const { cols: c, rows: r } = DIFFICULTY_MAP[diff]
      const newPieces = generateGrid(r, c, size.w, size.h)
      setPieces(newPieces)
      setMoves(0)
      setElapsed(0)
      setTimerStarted(false)
      setCompleted(false)
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null
    },
    [computeBoardSize]
  )

  // Init on mount and difficulty change
  useEffect(() => {
    initPuzzle(difficulty)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [difficulty, initPuzzle])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const size = computeBoardSize()
      setBoardSize(size)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [computeBoardSize])

  // ESC to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  // Timer
  useEffect(() => {
    if (timerStarted && !completed) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1)
      }, 1000)
      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }, [timerStarted, completed])

  // Cell dimensions
  const cellW = boardSize.w / cols
  const cellH = boardSize.h / rows

  // Piece visual size (larger to accommodate tabs)
  const pieceW = cellW * (1 + 2 * OVERHANG)
  const pieceH = cellH * (1 + 2 * OVERHANG)

  // Correct position for a piece (top-left of piece div, accounting for overhang)
  const correctPos = useCallback(
    (r: number, c: number) => ({
      x: c * cellW - cellW * OVERHANG,
      y: r * cellH - cellH * OVERHANG,
    }),
    [cellW, cellH]
  )

  // Start timer on first drag
  const ensureTimerStarted = useCallback(() => {
    if (!timerStarted) setTimerStarted(true)
  }, [timerStarted])

  // Check completion
  const checkCompletion = useCallback(
    (updatedPieces: PieceData[]) => {
      if (updatedPieces.every((p) => p.placed)) {
        setCompleted(true)
      }
    },
    []
  )

  /* ── Pointer event handlers ── */

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, idx: number) => {
      if (pieces[idx].placed || completed) return
      ensureTimerStarted()

      const target = e.currentTarget as HTMLElement
      target.setPointerCapture(e.pointerId)

      dragRef.current = {
        pieceIdx: idx,
        startX: e.clientX,
        startY: e.clientY,
        origX: pieces[idx].x,
        origY: pieces[idx].y,
      }
    },
    [pieces, completed, ensureTimerStarted]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return
      const { pieceIdx, startX, startY, origX, origY } = dragRef.current
      const dx = e.clientX - startX
      const dy = e.clientY - startY

      setPieces((prev) => {
        const next = [...prev]
        next[pieceIdx] = { ...next[pieceIdx], x: origX + dx, y: origY + dy }
        return next
      })
    },
    []
  )

  const handlePointerUp = useCallback(
    (_e: React.PointerEvent) => {
      if (!dragRef.current) return
      const { pieceIdx } = dragRef.current
      dragRef.current = null

      setMoves((m) => m + 1)

      setPieces((prev) => {
        const next = [...prev]
        const piece = next[pieceIdx]
        const target = correctPos(piece.row, piece.col)

        const dx = Math.abs(piece.x - target.x)
        const dy = Math.abs(piece.y - target.y)

        if (dx < SNAP_DISTANCE && dy < SNAP_DISTANCE) {
          next[pieceIdx] = { ...piece, x: target.x, y: target.y, placed: true }
        }

        // Check completion async to allow state update
        setTimeout(() => checkCompletion(next), 50)
        return next
      })
    },
    [correctPos, checkCompletion]
  )

  // Shuffle unplaced pieces
  const shufflePieces = useCallback(() => {
    const pw = cellW * (1 + 2 * OVERHANG)
    const ph = cellH * (1 + 2 * OVERHANG)
    const viewW = typeof window !== "undefined" ? window.innerWidth : 1200
    const sideSpace = (viewW - boardSize.w) / 2
    const canScatterOutside = sideSpace > pw + 20
    let sideToggle = 0
    setPieces((prev) =>
      prev.map((p) => {
        if (p.placed) return p
        sideToggle++
        const side = sideToggle % 2
        let x: number, y: number
        if (canScatterOutside) {
          if (side === 0) {
            x = -(pw + 10 + Math.random() * Math.min(pw * 0.5, sideSpace - pw - 30))
            y = Math.random() * (boardSize.h - ph)
          } else {
            x = boardSize.w + 10 + Math.random() * Math.min(pw * 0.5, sideSpace - pw - 30)
            y = Math.random() * (boardSize.h - ph)
          }
        } else {
          x = Math.random() * (boardSize.w - pw)
          y = Math.random() * (boardSize.h - ph)
        }
        return { ...p, x, y }
      })
    )
  }, [boardSize, cellW, cellH])

  // Difficulty change
  const changeDifficulty = (d: "easy" | "medium" | "hard") => {
    setDifficulty(d)
  }

  // Format time
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  return (
    <>
      {/* Inline keyframes */}
      <style>{`
        @keyframes jigsaw-snap-glow {
          0% { box-shadow: 0 0 15px 5px rgba(120,200,214,0.6); }
          100% { box-shadow: 0 0 0 0 rgba(120,200,214,0); }
        }
        @keyframes jigsaw-confetti-fall {
          0% { opacity: 1; transform: translateY(0) rotate(0deg); }
          100% { opacity: 0; transform: translateY(100vh) rotate(720deg); }
        }
        @keyframes jigsaw-celebration-in {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* Full-screen overlay */}
      <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm" style={{ color: "#78c8d6" }}>
              {formatTime(elapsed)}
            </span>
            <span className="text-sm text-white/50">
              {moves} move{moves !== 1 ? "s" : ""}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close puzzle"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Board area */}
        <div className="flex flex-1 items-center justify-center overflow-visible px-4 pb-2">
          <div
            ref={boardRef}
            className="relative rounded-lg"
            style={{
              width: boardSize.w,
              height: boardSize.h,
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              touchAction: "none",
            }}
          >
            {/* Ghost image guide */}
            <div
              className="pointer-events-none absolute inset-0 rounded-lg"
              style={{
                backgroundImage: `url(${image.src})`,
                backgroundSize: "100% 100%",
                opacity: showPreview ? 0.3 : 0,
                transition: "opacity 0.3s",
              }}
            />

            {/* Grid lines (faint guide) */}
            <svg
              className="pointer-events-none absolute inset-0"
              width={boardSize.w}
              height={boardSize.h}
              style={{ opacity: 0.1 }}
            >
              {Array.from({ length: rows - 1 }, (_, i) => (
                <line
                  key={`h-${i}`}
                  x1={0}
                  y1={(i + 1) * cellH}
                  x2={boardSize.w}
                  y2={(i + 1) * cellH}
                  stroke="white"
                  strokeWidth={0.5}
                />
              ))}
              {Array.from({ length: cols - 1 }, (_, i) => (
                <line
                  key={`v-${i}`}
                  x1={(i + 1) * cellW}
                  y1={0}
                  x2={(i + 1) * cellW}
                  y2={boardSize.h}
                  stroke="white"
                  strokeWidth={0.5}
                />
              ))}
            </svg>

            {/* SVG clip-path definitions */}
            <svg width={0} height={0} style={{ position: "absolute" }}>
              <defs>
                {pieces.map((piece) => (
                  <clipPath
                    key={`clip-${piece.row}-${piece.col}`}
                    id={`piece-${piece.row}-${piece.col}`}
                    clipPathUnits="objectBoundingBox"
                  >
                    <path
                      d={generatePiecePath(piece.edges)}
                      transform="scale(0.01)"
                    />
                  </clipPath>
                ))}
              </defs>
            </svg>

            {/* Pieces */}
            {pieces.map((piece, idx) => {
              // bg = full image at board size, offset so the cell center
              // of the piece div aligns with the correct slice
              const ovhX = cellW * OVERHANG
              const ovhY = cellH * OVERHANG
              const bgPosX = -(piece.col * cellW) + ovhX
              const bgPosY = -(piece.row * cellH) + ovhY

              return (
                <div
                  key={`${piece.row}-${piece.col}`}
                  onPointerDown={(e) => handlePointerDown(e, idx)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  style={{
                    position: "absolute",
                    width: pieceW,
                    height: pieceH,
                    transform: `translate(${piece.x}px, ${piece.y}px)${
                      dragRef.current?.pieceIdx === idx ? " scale(1.05)" : ""
                    }`,
                    zIndex: piece.placed
                      ? 1
                      : dragRef.current?.pieceIdx === idx
                        ? 100
                        : 10,
                    cursor: piece.placed ? "default" : "grab",
                    clipPath: `url(#piece-${piece.row}-${piece.col})`,
                    backgroundImage: `url(${image.src})`,
                    backgroundSize: `${boardSize.w}px ${boardSize.h}px`,
                    backgroundPosition: `${bgPosX}px ${bgPosY}px`,
                    backgroundRepeat: "no-repeat",
                    filter: piece.placed
                      ? "none"
                      : `drop-shadow(2px 3px 4px rgba(0,0,0,0.5))${
                          dragRef.current?.pieceIdx === idx
                            ? " drop-shadow(0 0 8px rgba(0,0,0,0.7))"
                            : ""
                        }`,
                    transition: piece.placed
                      ? "transform 0.2s ease-out"
                      : "none",
                    animation: piece.placed
                      ? "jigsaw-snap-glow 0.6s ease-out forwards"
                      : undefined,
                    willChange: "transform",
                  }}
                />
              )
            })}

            {/* Completion overlay */}
            {completed && (
              <div
                className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-lg"
                style={{
                  backgroundColor: "rgba(0,0,0,0.7)",
                  animation:
                    "jigsaw-celebration-in 0.5s cubic-bezier(0.33,1,0.68,1) forwards",
                }}
              >
                <ConfettiOverlay />
                <h2
                  className="text-3xl font-bold sm:text-4xl"
                  style={{ color: "#78c8d6" }}
                >
                  Puzzle Complete!
                </h2>
                <p className="mt-4 text-lg text-white/70">
                  {formatTime(elapsed)} &middot; {moves} move
                  {moves !== 1 ? "s" : ""}
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => onNewImage ? onNewImage() : initPuzzle(difficulty)}
                    className="rounded-full border px-5 py-2 text-sm transition-all hover:bg-white/10"
                    style={{ borderColor: "#78c8d6", color: "#78c8d6" }}
                  >
                    Play Again
                  </button>
                  <button
                    onClick={onClose}
                    className="rounded-full border border-white/20 px-5 py-2 text-sm text-white/50 transition-all hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 px-4 pb-4 pt-2">
          <button
            onClick={() => setShowPreview((p) => !p)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
              showPreview
                ? "border-[#78c8d6]/50 bg-[#78c8d6]/10 text-[#78c8d6]"
                : "border-white/15 text-white/50 hover:border-white/30 hover:text-white/70"
            }`}
          >
            Preview
          </button>
          <button
            onClick={shufflePieces}
            className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-white/50 transition-all hover:border-white/30 hover:text-white/70"
          >
            Shuffle
          </button>
          <div className="flex rounded-full border border-white/15">
            {(["easy", "medium", "hard"] as const).map((d) => (
              <button
                key={d}
                onClick={() => changeDifficulty(d)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition-all first:rounded-l-full last:rounded-r-full ${
                  difficulty === d
                    ? "bg-[#78c8d6]/20 text-[#78c8d6]"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
