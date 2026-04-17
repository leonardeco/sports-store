export default function PromoBanner() {
  return (
    <div className="bg-brand-orange text-white text-xs sm:text-sm font-bold tracking-widest uppercase overflow-hidden whitespace-nowrap py-2 border-b border-white/10 z-50 relative">
      <div className="animate-[marquee_20s_linear_infinite] inline-flex items-center gap-12 sm:gap-24">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="flex items-center gap-4">
            <span>🚀 ENVÍOS A TODO EL PAÍS EN 24HS</span>
            <span className="opacity-50">•</span>
            <span>🎁 LLEVATE DESCUENTOS Y REGALOS EXCLUSIVOS ARMANDO TU COMBO</span>
            <span className="opacity-50">•</span>
          </span>
        ))}
      </div>
    </div>
  )
}
