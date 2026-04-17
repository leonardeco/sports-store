import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useToast } from "../context/ToastContext"
import { CONFIG } from "../config"

const badgeColors = {
  "Más vendido": "bg-brand-orange text-white",
  "Mas vendido": "bg-brand-orange text-white",
  "Nuevo":       "bg-brand-neon text-brand-dark",
  "Oferta":      "bg-red-500 text-white",
  "Destacado":   "bg-purple-500 text-white",
}

function getRating(id) {
  const rating = 4.5 + (id % 6) * 0.1;
  const reviews = 80 + (id * 17) % 300;
  return { rating: rating.toFixed(1), reviews };
}

export default function ProductCard({ product }) {
  const { addItem, isInCart, openCart } = useCart()
  const { addToast } = useToast()
  const enCarrito = isInCart(product.id)
  const brandConfig = CONFIG.brands[product.marca] || { accent: "#FF6B00" }
  const { rating, reviews } = getRating(product.id)

  const handleAgregar = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock === 0) return
    
    if (!enCarrito) {
      addItem(product)
      addToast(`✅ ${product.nombre} agregado al carrito`)
    }
    openCart()
  }

  return (
    <div className="card group animate-fade-in flex flex-col">

      {/* ── Imagen con overlay de hover ─────────────────────────── */}
      <Link to={`/producto/${product.id}`} className="relative block overflow-hidden rounded-t-xl">

        {/* Badge */}
        {product.badge && (
          <span className={`product-badge absolute top-3 left-3 z-10 ${badgeColors[product.badge] || "bg-brand-orange text-white"}`}>
            {product.badge}
          </span>
        )}

        {/* Sin stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-sm bg-red-600/80 px-3 py-1 rounded-full">Sin stock</span>
          </div>
        )}

        {/* Imagen */}
        <img
          src={product.imagen}
          alt={product.nombre}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Overlay "Ver producto" — aparece al hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 bg-white text-brand-dark text-sm font-bold px-5 py-2 rounded-full shadow-lg">
            Ver producto →
          </span>
        </div>

      </Link>

      {/* ── Info del producto ──────────────────────────────────── */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs text-brand-muted uppercase tracking-wider">
            {product.categoria}
          </span>
          <span className="text-white/20">·</span>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: brandConfig.accent }}>
            {product.marca}
          </span>
        </div>

        {/* Estrellas dinámicas */}
        <div className="flex items-center gap-1 mt-1 mb-1">
          <div className="flex text-yellow-500 text-[10px] sm:text-xs tracking-tighter">
             ★★★★★
          </div>
          <span className="text-brand-muted text-[10px] ml-1">{rating} ({reviews})</span>
        </div>

        <Link to={`/producto/${product.id}`} className="mt-1 flex-1">
          <h3 className="font-semibold text-white hover:text-brand-orange transition-colors duration-200 line-clamp-2 leading-snug">
            {product.nombre}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-3 gap-2">
          <span className="text-brand-orange font-bold text-lg">
            {CONFIG.store.currencySymbol}{product.precio.toLocaleString("es-AR")}
          </span>

          <button
            onClick={handleAgregar}
            disabled={product.stock === 0}
            className={`text-sm px-4 py-2 rounded-lg font-semibold transition-all duration-200
              ${product.stock === 0
                ? "bg-brand-dark-card text-brand-muted cursor-not-allowed"
                : "bg-brand-orange hover:bg-brand-orange-light text-white hover:scale-105 active:scale-95 cursor-pointer shadow-md shadow-brand-orange/20 hover:shadow-brand-orange/40"}
              `}
          >
            {product.stock === 0 ? "Agotado" : enCarrito ? "Agregado ✓" : "Agregar"}
          </button>
        </div>

        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-xs text-yellow-400 mt-2">
            ⚠ ¡Últimas {product.stock} unidades!
          </p>
        )}
      </div>
    </div>
  )
}
