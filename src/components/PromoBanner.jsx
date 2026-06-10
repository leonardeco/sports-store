export default function PromoBanner() {
  return (
    <div className="bg-brand-orange text-brand-dark text-xs sm:text-sm font-bold tracking-widest uppercase overflow-hidden whitespace-nowrap py-2 border-b border-black/10 z-50 relative">
      <div className="animate-[marquee_20s_linear_infinite] inline-flex items-center gap-12 sm:gap-24">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="flex items-center gap-4">
            <span>🔥 ENVÍO GRATIS DESDE $150.000</span>
            <span className="opacity-50">•</span>
            <span>📦 PRODUCTOS 100% ORIGINALES</span>
            <span className="opacity-50">•</span>
            <span>⚡ DESCUENTO EN CREATINAS</span>
            <span className="opacity-50">•</span>
          </span>
        ))}
      </div>
    </div>
  )
}
