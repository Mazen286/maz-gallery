export function AuroraBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-50"
      aria-hidden="true"
    >
      {/* Teal blob */}
      <div
        className="animate-aurora-1 absolute -left-1/4 -top-1/4 h-[60vh] w-[60vh] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(ellipse at center, rgba(120,200,214,0.12) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Indigo blob */}
      <div
        className="animate-aurora-2 absolute -right-1/4 top-1/3 h-[50vh] w-[50vh] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(ellipse at center, rgba(67,56,202,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Warm gold blob */}
      <div
        className="animate-aurora-3 absolute -bottom-1/4 left-1/3 h-[55vh] w-[55vh] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(ellipse at center, rgba(212,168,83,0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
    </div>
  )
}
