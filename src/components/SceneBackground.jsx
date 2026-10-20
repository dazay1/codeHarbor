// Illustrated Archway & Scene Background Layer
export default function SceneBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Top Archway Frame */}
      <svg className="absolute top-0 left-0 w-full h-32 text-amber-900/20" viewBox="0 0 400 120" preserveAspectRatio="none">
        <path d="M0 0 L400 0 L400 30 Q200 90 0 30 Z" fill="currentColor" />
        <path d="M0 0 L400 0 L400 15 Q200 75 0 15 Z" fill="rgba(180, 83, 9, 0.15)" />
      </svg>

      {/* Desert Landscape Waves */}
      <div className="absolute top-20 -left-10 w-48 h-48 rounded-full bg-amber-200/40 blur-xl" />
      <div className="absolute top-60 -right-10 w-56 h-56 rounded-full bg-amber-300/30 blur-2xl" />

      {/* Decorative Minaret & Arch Silhouettes (Left & Right) */}
      <svg className="absolute top-1/4 -left-6 w-28 h-64 text-amber-700/15" viewBox="0 0 100 200" fill="currentColor">
        <rect x="30" y="40" width="40" height="160" rx="4" />
        <path d="M50 0 L70 35 L30 35 Z" />
        <circle cx="50" cy="15" r="8" />
      </svg>

      <svg className="absolute top-1/2 -right-6 w-32 h-72 text-amber-700/15" viewBox="0 0 100 200" fill="currentColor">
        <rect x="25" y="50" width="50" height="150" rx="6" />
        <path d="M50 10 L75 45 L25 45 Z" />
        <rect x="40" y="80" width="20" height="35" rx="10" fill="rgba(251, 191, 36, 0.2)" />
      </svg>

      {/* Palm Trees & Market Tent Props along the path */}
      <div className="absolute top-[28%] left-6 text-3xl opacity-80">🌴</div>
      <div className="absolute top-[48%] right-8 text-3xl opacity-80">🎪</div>
      <div className="absolute top-[68%] left-8 text-3xl opacity-80">🐪</div>
    </div>
  );
}