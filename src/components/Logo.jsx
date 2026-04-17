// ─── Componente Logo LEOFIT ──────────────────────────────────────────────────
// Usá este componente en Navbar, Footer y donde necesites el logo.
// Props:
//   size     → "sm" | "md" | "lg"  (default: "md")
//   mono     → true = solo el ícono sin texto (útil para favicons, badges)
//   dark     → true = versión para fondos claros (invierte colores del texto)
//   className → clases extra para el wrapper

export default function Logo({ size = "md", mono = false, className = "" }) {
  const cfg = {
    sm: { icon: 22, text: "text-xl",   gap: "gap-1.5" },
    md: { icon: 28, text: "text-2xl",  gap: "gap-2"   },
    lg: { icon: 44, text: "text-5xl",  gap: "gap-3"   },
  }[size] ?? { icon: 28, text: "text-2xl", gap: "gap-2" }

  return (
    <div className={`flex items-center ${cfg.gap} ${className}`}>

      {/* ── Ícono: rayo (lightning bolt) ──────────────────────────
          SVG propio, sin dependencias externas.
          El rayo usa un gradiente naranja → verde neón
          que refleja la energía de la marca.
      */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 28"
        width={cfg.icon}
        height={cfg.icon}
        fill="none"
        aria-hidden="true"
      >
        <defs>
          {/* Gradiente vertical naranja → verde neón */}
          <linearGradient id="leofit-bolt" x1="12" y1="0" x2="12" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#FF6B00" />
            <stop offset="100%" stopColor="#AAFF00" />
          </linearGradient>
        </defs>

        {/*
          Rayo diseñado a mano:
            – Parte superior: diagonal derecha-izquierda (trazo potente)
            – Notch central: la "cintura" del rayo
            – Parte inferior: diagonal izquierda-derecha hasta la punta
          La forma es angulosa y directa, muy legible a cualquier tamaño.
        */}
        <polygon
          points="16,1 5,15 11,15 8,27 19,13 13,13"
          fill="url(#leofit-bolt)"
        />
      </svg>

      {/* ── Texto: LEO (blanco) + FIT (naranja) ────────────────── */}
      {!mono && (
        <span className={`font-display tracking-widest leading-none ${cfg.text}`}>
          <span className="text-white">LEO</span>
          <span className="text-brand-orange">FIT</span>
        </span>
      )}
    </div>
  )
}
