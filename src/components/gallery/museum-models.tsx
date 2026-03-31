"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

// ═══════════════════════════════════════════
// PROCEDURAL 3D ARTIFACTS
// Uses LatheGeometry to spin profile curves
// ═══════════════════════════════════════════

function createLathePoints(profile: [number, number][]): THREE.Vector2[] {
  return profile.map(([x, y]) => new THREE.Vector2(x, y))
}

// Classic amphora / tall vase
export function Amphora({ color = "#8B6F47" }: { color?: string }) {
  const points = useMemo(() => createLathePoints([
    [0, 0], [0.12, 0.01], [0.14, 0.05], [0.12, 0.1],
    [0.06, 0.15], [0.05, 0.2], [0.06, 0.25], [0.1, 0.35],
    [0.12, 0.45], [0.11, 0.5], [0.08, 0.55], [0.05, 0.58],
    [0.04, 0.6], [0.05, 0.62], [0.06, 0.63], [0, 0.63],
  ]), [])
  return (
    <mesh>
      <latheGeometry args={[points, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

// Round bowl
export function Bowl({ color = "#9C7B5B" }: { color?: string }) {
  const points = useMemo(() => createLathePoints([
    [0, 0], [0.08, 0.01], [0.1, 0.03], [0.08, 0.06],
    [0.06, 0.08], [0.12, 0.12], [0.16, 0.18], [0.17, 0.22],
    [0.16, 0.24], [0.15, 0.25], [0, 0.25],
  ]), [])
  return (
    <mesh>
      <latheGeometry args={[points, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

// Goblet / chalice
export function Goblet({ color = "#B8960C" }: { color?: string }) {
  const points = useMemo(() => createLathePoints([
    [0, 0], [0.1, 0.01], [0.1, 0.03], [0.03, 0.06],
    [0.02, 0.15], [0.025, 0.25], [0.03, 0.28],
    [0.08, 0.32], [0.1, 0.38], [0.1, 0.42],
    [0.09, 0.43], [0, 0.43],
  ]), [])
  return (
    <mesh>
      <latheGeometry args={[points, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

// Urn with lid
export function Urn({ color = "#6B4E3D" }: { color?: string }) {
  const points = useMemo(() => createLathePoints([
    [0, 0], [0.08, 0.01], [0.09, 0.04], [0.07, 0.08],
    [0.05, 0.1], [0.08, 0.18], [0.11, 0.28], [0.1, 0.35],
    [0.07, 0.38], [0.05, 0.39], [0.06, 0.41],
    [0.08, 0.42], [0.07, 0.44], [0.03, 0.46],
    [0.01, 0.48], [0, 0.48],
  ]), [])
  return (
    <mesh>
      <latheGeometry args={[points, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

// Tall slim bottle
export function Bottle({ color = "#4A6E5C" }: { color?: string }) {
  const points = useMemo(() => createLathePoints([
    [0, 0], [0.08, 0.01], [0.09, 0.05], [0.08, 0.15],
    [0.09, 0.25], [0.08, 0.3], [0.04, 0.35], [0.025, 0.4],
    [0.02, 0.5], [0.025, 0.55], [0.02, 0.56], [0, 0.56],
  ]), [])
  return (
    <mesh>
      <latheGeometry args={[points, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

// Stone bust (head on a neck)
export function Bust({ color = "#A0978E" }: { color?: string }) {
  return (
    <group>
      {/* Neck */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.12, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.26, -0.09]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.02, 0.04, 4]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.06, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}

// Stack of old books
export function BookStack({ color = "#5C3A21" }: { color?: string }) {
  return (
    <group>
      <mesh position={[0, 0.02, 0]} rotation={[0, 0.1, 0]}>
        <boxGeometry args={[0.18, 0.04, 0.12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.06, 0]} rotation={[0, -0.15, 0]}>
        <boxGeometry args={[0.16, 0.035, 0.11]} />
        <meshBasicMaterial color="#7B4F2E" />
      </mesh>
      <mesh position={[0, 0.095, 0]} rotation={[0, 0.25, 0]}>
        <boxGeometry args={[0.17, 0.03, 0.115]} />
        <meshBasicMaterial color="#3D2B1F" />
      </mesh>
    </group>
  )
}

// Small globe on stand
export function Globe({ color = "#2C4A6E" }: { color?: string }) {
  return (
    <group>
      {/* Stand */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.01, 0.04, 0.16, 6]} />
        <meshBasicMaterial color="#5a4a3a" />
      </mesh>
      {/* Ring */}
      <mesh position={[0, 0.2, 0]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.09, 0.005, 6, 16]} />
        <meshBasicMaterial color="#8a7a55" />
      </mesh>
      {/* Sphere */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}

// Candelabra
export function Candelabra({ color = "#8a7a55" }: { color?: string }) {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.04, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.015, 0.02, 0.28, 6]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Center candle */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.1, 6]} />
        <meshBasicMaterial color="#e8e0d0" />
      </mesh>
      {/* Flame */}
      <mesh position={[0, 0.44, 0]}>
        <sphereGeometry args={[0.012, 4, 4]} />
        <meshBasicMaterial color="#ffaa22" />
      </mesh>
      {/* Arms */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.06, 0.28, 0]} rotation={[0, 0, side * 0.5]}>
            <cylinderGeometry args={[0.008, 0.008, 0.12, 4]} />
            <meshBasicMaterial color={color} />
          </mesh>
          <mesh position={[side * 0.09, 0.32, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.08, 6]} />
            <meshBasicMaterial color="#e8e0d0" />
          </mesh>
          <mesh position={[side * 0.09, 0.37, 0]}>
            <sphereGeometry args={[0.01, 4, 4]} />
            <meshBasicMaterial color="#ffaa22" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ═══════════════════════════════════════════
// 3D CATS
// ═══════════════════════════════════════════

// Cat behavior states
type CatState = "idle" | "walking" | "trotting" | "sitting" | "looking"

// Walking cat with realistic behavior
export function WalkingCat() {
  const ref = useRef<THREE.Group>(null)
  const tailRef = useRef<THREE.Mesh>(null)
  const legsRef = useRef<THREE.Mesh[]>([])
  const t = useRef(0)
  const { camera } = useThree()

  // Behavior state machine
  const state = useRef<CatState>("walking")
  const stateTimer = useRef(0)
  const target = useRef(new THREE.Vector3(0, 0, -3))
  const facingAngle = useRef(0)
  const walkSpeed = useRef(0)

  useFrame((_, dt) => {
    if (!ref.current) return
    t.current += dt
    stateTimer.current -= dt

    const cat = ref.current.position
    const cam = camera.position
    const distToPlayer = Math.sqrt((cat.x - cam.x) ** 2 + (cat.z - cam.z) ** 2)

    // State transitions
    if (stateTimer.current <= 0) {
      const roll = Math.random()

      if (distToPlayer > 12) {
        // Too far from player, trot to catch up
        state.current = "trotting"
        stateTimer.current = 2 + Math.random() * 2
      } else if (state.current === "idle" || state.current === "sitting" || state.current === "looking") {
        // Was resting, start walking
        state.current = "walking"
        stateTimer.current = 3 + Math.random() * 4
        // Pick a new target: somewhere ahead of or near the player
        target.current.set(
          cam.x + (Math.random() - 0.5) * 6,
          0,
          cam.z - 2 - Math.random() * 8
        )
        // Clamp to hall
        target.current.x = THREE.MathUtils.clamp(target.current.x, -4, 4)
      } else if (roll < 0.3) {
        // Stop and sit
        state.current = "sitting"
        stateTimer.current = 2 + Math.random() * 3
      } else if (roll < 0.5) {
        // Stop and look around (at a painting)
        state.current = "looking"
        stateTimer.current = 1.5 + Math.random() * 2
      } else if (roll < 0.7) {
        // Idle (stand still, lick paw)
        state.current = "idle"
        stateTimer.current = 1 + Math.random() * 2
      } else {
        // Keep walking to a new spot
        state.current = "walking"
        stateTimer.current = 3 + Math.random() * 4
        target.current.set(
          cam.x + (Math.random() - 0.5) * 6,
          0,
          cam.z - 2 - Math.random() * 8
        )
        target.current.x = THREE.MathUtils.clamp(target.current.x, -4, 4)
      }
    }

    // Behavior execution
    const s = state.current
    let targetSpeed = 0
    let bobAmount = 0
    let legAnimSpeed = 0

    if (s === "walking") {
      targetSpeed = 1.2
      bobAmount = 0.008
      legAnimSpeed = 5
    } else if (s === "trotting") {
      // Trot toward player
      target.current.set(cam.x + (Math.random() - 0.5) * 2, 0, cam.z - 3)
      targetSpeed = 3
      bobAmount = 0.015
      legAnimSpeed = 10
    } else if (s === "looking") {
      targetSpeed = 0
      // Slowly turn head toward nearest wall (painting)
      const wallSide = cat.x > 0 ? 1 : -1
      const lookAngle = wallSide * Math.PI / 2
      facingAngle.current = THREE.MathUtils.lerp(facingAngle.current, lookAngle, 0.03)
    } else {
      // idle or sitting
      targetSpeed = 0
    }

    // Smooth speed
    walkSpeed.current = THREE.MathUtils.lerp(walkSpeed.current, targetSpeed, 0.05)

    // Move toward target
    if (walkSpeed.current > 0.1) {
      const dx = target.current.x - cat.x
      const dz = target.current.z - cat.z
      const dist = Math.sqrt(dx * dx + dz * dz)

      if (dist > 0.3) {
        const moveX = (dx / dist) * walkSpeed.current * dt
        const moveZ = (dz / dist) * walkSpeed.current * dt
        cat.x += moveX
        cat.z += moveZ

        // Face movement direction (smoothly)
        const targetAngle = Math.atan2(dx, dz)
        facingAngle.current = THREE.MathUtils.lerp(facingAngle.current, targetAngle, 0.08)
      }
    }

    // Apply facing
    ref.current.rotation.y = facingAngle.current

    // Bob when walking
    cat.y = Math.sin(t.current * legAnimSpeed) * bobAmount

    // Clamp to hall
    cat.x = THREE.MathUtils.clamp(cat.x, -4.5, 4.5)

    // Tail animation - more active when walking, lazy when sitting
    if (tailRef.current) {
      if (s === "walking" || s === "trotting") {
        tailRef.current.rotation.x = 0.8 + Math.sin(t.current * 2.5) * 0.3
        tailRef.current.rotation.z = Math.sin(t.current * 2) * 0.25
      } else if (s === "sitting") {
        tailRef.current.rotation.x = 0.3
        tailRef.current.rotation.z = Math.sin(t.current * 0.8) * 0.15
      } else {
        tailRef.current.rotation.x = 0.5 + Math.sin(t.current * 1.2) * 0.15
        tailRef.current.rotation.z = Math.sin(t.current * 0.6) * 0.1
      }
    }

    // Leg animation
    legsRef.current.forEach((leg, i) => {
      if (!leg) return
      if (walkSpeed.current > 0.2) {
        const offset = i < 2 ? 0 : Math.PI // front/back pair offset
        const sideOffset = i % 2 === 0 ? 0 : Math.PI // left/right offset
        leg.rotation.x = Math.sin(t.current * legAnimSpeed + offset + sideOffset) * 0.3 * Math.min(walkSpeed.current / 2, 1)
      } else {
        leg.rotation.x = THREE.MathUtils.lerp(leg.rotation.x, 0, 0.1)
      }
    })
  })

  return (
    <group ref={ref} position={[1, 0, -3]}>
      {/* Body */}
      <mesh position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.07, 0.25, 6, 8]} />
        <meshBasicMaterial color="#0e0e0e" />
      </mesh>
      {/* Chest (slightly lighter) */}
      <mesh position={[0, 0.16, -0.1]}>
        <sphereGeometry args={[0.065, 6, 6]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.24, -0.2]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#0e0e0e" />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 0.22, -0.27]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshBasicMaterial color="#141414" />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.235, -0.295]}>
        <sphereGeometry args={[0.008, 4, 4]} />
        <meshBasicMaterial color="#4a3535" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.03, 0.26, -0.26]}>
        <sphereGeometry args={[0.016, 6, 6]} />
        <meshBasicMaterial color="#78c8d6" />
      </mesh>
      <mesh position={[0.03, 0.26, -0.26]}>
        <sphereGeometry args={[0.016, 6, 6]} />
        <meshBasicMaterial color="#78c8d6" />
      </mesh>
      {/* Pupils */}
      <mesh position={[-0.03, 0.26, -0.275]}>
        <sphereGeometry args={[0.008, 4, 4]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      <mesh position={[0.03, 0.26, -0.275]}>
        <sphereGeometry args={[0.008, 4, 4]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      {/* Ears */}
      <mesh position={[-0.04, 0.32, -0.18]} rotation={[0.2, 0, -0.2]}>
        <coneGeometry args={[0.025, 0.05, 4]} />
        <meshBasicMaterial color="#0e0e0e" />
      </mesh>
      <mesh position={[0.04, 0.32, -0.18]} rotation={[0.2, 0, 0.2]}>
        <coneGeometry args={[0.025, 0.05, 4]} />
        <meshBasicMaterial color="#0e0e0e" />
      </mesh>
      {/* Inner ears */}
      <mesh position={[-0.038, 0.315, -0.185]} rotation={[0.2, 0, -0.2]}>
        <coneGeometry args={[0.013, 0.03, 4]} />
        <meshBasicMaterial color="#2a1a1a" />
      </mesh>
      <mesh position={[0.038, 0.315, -0.185]} rotation={[0.2, 0, 0.2]}>
        <coneGeometry args={[0.013, 0.03, 4]} />
        <meshBasicMaterial color="#2a1a1a" />
      </mesh>
      {/* Legs (with refs for walk animation) */}
      {[[-0.04, -0.12], [0.04, -0.12], [-0.04, 0.1], [0.04, 0.1]].map(([x, z], i) => (
        <group key={i} position={[x, 0.06, z]}>
          <mesh ref={(el) => { if (el) legsRef.current[i] = el }}>
            <cylinderGeometry args={[0.018, 0.015, 0.12, 5]} />
            <meshBasicMaterial color="#0e0e0e" />
          </mesh>
          {/* Paw */}
          <mesh position={[0, -0.06, 0]}>
            <sphereGeometry args={[0.018, 4, 4]} />
            <meshBasicMaterial color="#0e0e0e" />
          </mesh>
        </group>
      ))}
      {/* Tail */}
      <mesh ref={tailRef} position={[0, 0.22, 0.18]} rotation={[0.6, 0, 0]}>
        <capsuleGeometry args={[0.012, 0.22, 4, 4]} />
        <meshBasicMaterial color="#0e0e0e" />
      </mesh>
    </group>
  )
}

// Sleeping cat (curled up on a surface)
export function SleepingCat({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)
  const t = useRef(Math.random() * 10)

  useFrame((_, dt) => {
    if (!ref.current) return
    t.current += dt
    // Gentle breathing
    ref.current.scale.y = 1 + Math.sin(t.current * 1.5) * 0.02
  })

  return (
    <group ref={ref} position={position}>
      {/* Curled body (torus-like shape) */}
      <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.06, 0.04, 6, 12, Math.PI * 1.6]} />
        <meshBasicMaterial color="#0e0e0e" />
      </mesh>
      {/* Fill center */}
      <mesh position={[0, 0.06, 0]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshBasicMaterial color="#0e0e0e" />
      </mesh>
      {/* Head tucked in */}
      <mesh position={[0.05, 0.08, -0.04]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial color="#0e0e0e" />
      </mesh>
      {/* Ears */}
      <mesh position={[0.04, 0.12, -0.06]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.015, 0.03, 3]} />
        <meshBasicMaterial color="#0e0e0e" />
      </mesh>
      <mesh position={[0.07, 0.12, -0.04]} rotation={[0, 0, 0.1]}>
        <coneGeometry args={[0.015, 0.03, 3]} />
        <meshBasicMaterial color="#0e0e0e" />
      </mesh>
      {/* Tail wrapping around */}
      <mesh position={[-0.04, 0.04, 0.06]} rotation={[0, 0.5, Math.PI / 2]}>
        <capsuleGeometry args={[0.01, 0.1, 3, 4]} />
        <meshBasicMaterial color="#0e0e0e" />
      </mesh>
    </group>
  )
}

// ═══════════════════════════════════════════
// ARTIFACT REGISTRY
// Returns a component for each artifact type
// ═══════════════════════════════════════════
const ARTIFACT_TYPES = [
  { Component: Amphora, scale: 0.5, yOffset: 0, props: { color: "#8B6F47" } },
  { Component: Bust, scale: 0.55, yOffset: 0, props: { color: "#A0978E" } },
  { Component: Bowl, scale: 0.5, yOffset: 0, props: { color: "#9C7B5B" } },
  { Component: Goblet, scale: 0.55, yOffset: 0, props: { color: "#B8960C" } },
  { Component: Urn, scale: 0.5, yOffset: 0, props: { color: "#6B4E3D" } },
  { Component: Bottle, scale: 0.5, yOffset: 0, props: { color: "#4A6E5C" } },
  { Component: BookStack, scale: 0.7, yOffset: 0, props: {} },
  { Component: Globe, scale: 0.55, yOffset: 0, props: {} },
  { Component: Candelabra, scale: 0.5, yOffset: 0, props: {} },
  { Component: Amphora, scale: 0.45, yOffset: 0, props: { color: "#5C6B4A" } },
  { Component: Bust, scale: 0.5, yOffset: 0, props: { color: "#C8B8A0" } },
  { Component: Goblet, scale: 0.5, yOffset: 0, props: { color: "#8a7a55" } },
]

export function ArtifactOnPedestal({ index, position }: { index: number; position: [number, number, number] }) {
  const type = ARTIFACT_TYPES[index % ARTIFACT_TYPES.length]
  const { Component } = type

  return (
    <group position={position}>
      {/* Pedestal */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.45, 0.9, 0.45]} />
        <meshBasicMaterial color="#5a4d3d" />
      </mesh>
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[0.55, 0.04, 0.55]} />
        <meshBasicMaterial color="#7a6a55" />
      </mesh>
      {/* Artifact */}
      <group position={[0, 0.95, 0]} scale={type.scale}>
        <Component {...type.props} />
      </group>
    </group>
  )
}

// Sleeping cat on pedestal variant
export function SleepingCatPedestal({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pedestal */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.5, 0.7, 0.5]} />
        <meshBasicMaterial color="#5a4d3d" />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[0.6, 0.04, 0.6]} />
        <meshBasicMaterial color="#7a6a55" />
      </mesh>
      {/* Cushion */}
      <mesh position={[0, 0.76, 0]}>
        <cylinderGeometry args={[0.18, 0.2, 0.04, 12]} />
        <meshBasicMaterial color="#3a2a2a" />
      </mesh>
      {/* Sleeping cat */}
      <SleepingCat position={[0, 0.78, 0]} />
    </group>
  )
}
