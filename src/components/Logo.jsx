// ─── Componente Logo LEOFIT ──────────────────────────────────────────────────
// Usá este componente en Navbar, Footer y donde necesites el logo.
// Props:
//   size     → "sm" | "md" | "lg"  (default: "md")
//   mono     → true = solo el ícono sin texto (útil para favicons, badges)
//   dark     → true = versión para fondos claros (invierte colores del texto)
//   className → clases extra para el wrapper

export default function Logo({ size = "md", className = "" }) {
  const cfg = {
    sm: { height: "36px" },
    md: { height: "64px" },
    lg: { height: "96px" },
  }[size] ?? { height: "64px" }

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/img/leofit-logo.png"
        alt="LEOFIT"
        style={{ height: cfg.height, width: "auto", objectFit: "contain" }}
        className="transition-transform duration-300 hover:scale-105"
      />
    </div>
  )
}
