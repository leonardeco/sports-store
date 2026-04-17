import { useParams, useNavigate, Link, Navigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useToast } from "../context/ToastContext"
import { useState, useEffect } from "react"
import productos from "../data/productos.json"
import { CONFIG } from "../config"
import useSEO from "../hooks/useSEO"

// Colores de badges
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

export default function DetalleProducto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, isInCart } = useCart()
  const { addToast } = useToast()
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [vistos, setVistos] = useState([])

  const producto = productos.find(p => p.id === parseInt(id))
  
  // Fake safe rating
  const { rating, reviews } = producto ? getRating(producto.id) : { rating: "5.0", reviews: 0 }

  useSEO({
    title: producto ? producto.nombre : "Producto no encontrado",
    description: producto ? producto.descripcion : "Detalle del producto en LEOFIT"
  })

  if (!producto) {
    return <Navigate to="/catalogo" replace />
  }

  const enCarrito = isInCart(producto.id)

  const handleBotonCarrito = () => {
    if (enCarrito) {
      navigate("/carrito")
    } else {
      addItem(producto)
      addToast(`✅ ${producto.nombre} agregado al carrito`)
    }
  }

  // Productos relacionados: priorizar misma marca, luego misma categoría (hasta 4)
  const relacionados = [
    ...productos.filter(p => p.marca === producto.marca && p.id !== producto.id),
    ...productos.filter(p => p.marca !== producto.marca && p.categoria === producto.categoria && p.id !== producto.id),
  ].slice(0, 4)

  // Historial locales
  useEffect(() => {
    if (producto) {
      const recentIds = JSON.parse(localStorage.getItem("leofit_recent") || "[]")
      const updatedIds = [producto.id, ...recentIds.filter(id => id !== producto.id)].slice(0, 5)
      localStorage.setItem("leofit_recent", JSON.stringify(updatedIds))
      
      const loadedVistos = updatedIds
        .filter(id => id !== producto.id)
        .map(id => productos.find(p => p.id === id))
        .filter(Boolean)
      setVistos(loadedVistos)
    }
  }, [producto])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
    
      {/* Lightbox */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center cursor-pointer opacity-0 animate-fade-in"
          style={{ animationFillMode: "forwards" }}
          onClick={() => setIsLightboxOpen(false)}
        >
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img src={producto.imagen} alt={producto.nombre} className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl scale-95 hover:scale-100 transition-transform duration-300" />
        </div>
      )}

      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <nav className="flex items-center gap-2 text-sm text-brand-muted mb-8 overflow-x-auto whitespace-nowrap pb-1 scrollbar-hide">
        <Link to="/" className="hover:text-brand-orange transition-colors">Inicio</Link>
        <span>/</span>
        <Link to="/catalogo" className="hover:text-brand-orange transition-colors">Catálogo</Link>
        <span>/</span>
        <Link
          to={`/catalogo?categoria=${producto.categoria}`}
          className="hover:text-brand-orange transition-colors"
        >
          {producto.categoria}
        </Link>
        <span>/</span>
        <span className="text-white line-clamp-1">{producto.nombre}</span>
      </nav>

      {/* ── Detalle principal ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

        {/* ── Imagen ─────────────────────────────────────────────
            REEMPLAZAR: cambiá producto.imagen por tu foto real.
            Ejemplo: src="/imagenes/whey-protein-gold.jpg"
        */}
        <div 
          className="relative rounded-2xl overflow-hidden aspect-square bg-brand-dark-card cursor-zoom-in group"
          onClick={() => setIsLightboxOpen(true)}
        >
          {producto.badge && (
            <span
              className={`product-badge absolute top-4 left-4 z-10 ${badgeColors[producto.badge] || "bg-brand-orange text-white"}`}
            >
              {producto.badge}
            </span>
          )}
          <img
            src={producto.imagen}
            alt={producto.nombre}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
             <span className="bg-brand-dark/80 text-white px-4 py-2 rounded-full backdrop-blur-sm font-semibold flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" /></svg>
               Ampliar
             </span>
          </div>
        </div>

        {/* ── Info ─────────────────────────────────────────────── */}
        <div className="flex flex-col justify-center animate-slide-up">
          {/* Categoría y Marca */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-brand-orange text-sm font-semibold uppercase tracking-widest">
              {producto.categoria}
            </span>
            <span className="text-white/20">·</span>
            <span
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: CONFIG.brands[producto.marca]?.accent || "#FF6B00" }}
            >
              {producto.marca}
            </span>
          </div>

          {/* Social Proof Estrellas */}
          <div className="flex items-center gap-2 mb-4">
             <div className="text-yellow-500 text-sm tracking-tighter">★★★★★</div>
             <span className="text-white font-bold text-sm">{rating}</span>
             <span className="text-brand-muted text-sm ml-1 hover:text-brand-orange cursor-pointer underline decoration-brand-muted/30 underline-offset-4">
                ({reviews} reseñas verificadas)
             </span>
          </div>

          {/* Nombre */}
          <h1 className="font-display text-4xl sm:text-5xl text-white leading-tight mb-4">
            {producto.nombre.toUpperCase()}
          </h1>

          {/* Precio */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-brand-orange font-bold text-4xl">
              {CONFIG.store.currencySymbol}{producto.precio.toLocaleString("es-AR")}
            </span>
            <span className="text-brand-muted text-sm">{CONFIG.store.currency}</span>
          </div>

          {/* Descripción */}
          <p className="text-gray-300 leading-relaxed mb-6 text-base">
            {producto.descripcion}
          </p>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            {producto.stock > 5 ? (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                <span className="text-green-400 text-sm font-medium">En stock ({producto.stock} disponibles)</span>
              </>
            ) : producto.stock > 0 ? (
              <>
                <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
                <span className="text-yellow-400 text-sm font-medium">¡Últimas {producto.stock} unidades!</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                <span className="text-red-400 text-sm font-medium">Sin stock</span>
              </>
            )}
          </div>

          {/* Botón principal */}
          <button
            onClick={handleBotonCarrito}
            disabled={producto.stock === 0}
            className={`w-full text-lg py-4 rounded-xl font-bold transition-all duration-200 cursor-pointer mb-3
              ${enCarrito
                ? "bg-green-600 hover:bg-green-500 text-white"
                : producto.stock === 0
                  ? "bg-brand-dark-card text-brand-muted cursor-not-allowed"
                  : "bg-brand-orange hover:bg-brand-orange-light text-white hover:scale-[1.02] active:scale-[0.98]"
              }`}
          >
            {enCarrito
              ? "✓ Ver mi carrito"
              : producto.stock === 0
                ? "Sin stock"
                : "Agregar al carrito"
            }
          </button>

          {/* Link volver al catálogo */}
          <Link
            to="/catalogo"
            className="text-center text-brand-muted hover:text-brand-orange text-sm transition-colors mt-2"
          >
            ← Volver al catálogo
          </Link>

          {/* ── ACORDEÓN DE INFORMACIÓN TÉCNICA ──────────────── */}
          <div className="mt-8 flex flex-col gap-3">
            {[
              { titulo: "¿Para qué sirve y beneficios?", icono: "📖", texto: producto.beneficios },
              { titulo: "¿Cómo se toma este producto?", icono: "🥄", texto: producto.modo_uso },
            ].map(sec => sec.texto && (
              <details key={sec.titulo} className="group bg-brand-dark-3 rounded-xl border border-white/5 overflow-hidden">
                <summary className="cursor-pointer p-4 font-bold text-white flex justify-between items-center group-open:text-brand-orange transition-colors">
                  <span className="flex items-center gap-3">
                    <span className="text-xl opacity-90">{sec.icono}</span>
                    {sec.titulo}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 transition-transform group-open:rotate-180">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <div className="px-4 pb-5 pt-3 text-brand-muted text-sm leading-relaxed border-t border-white/5 bg-brand-dark-card/50">
                  {sec.texto}
                </div>
              </details>
            ))}
          </div>

        </div>
      </div>

      {/* ── Productos relacionados ─────────────────────────────── */}
      {relacionados.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-3xl text-white tracking-wide mb-6">
            TAMBIÉN TE PUEDE INTERESAR
          </h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible pb-2 sm:pb-0">
            {relacionados.map(p => (
              <Link
                key={p.id}
                to={`/producto/${p.id}`}
                className="card group flex flex-col overflow-hidden flex-shrink-0 w-44 sm:w-auto"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-brand-muted uppercase">{p.categoria}</p>
                  <h4 className="text-white text-sm font-semibold mt-1 line-clamp-2">{p.nombre}</h4>
                  <p className="text-brand-orange font-bold mt-1">
                    {CONFIG.store.currencySymbol}{p.precio.toLocaleString("es-AR")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Vistos recientemente ─────────────────────────────── */}
      {vistos.length > 0 && (
        <section className="mt-16 pt-16 border-t border-white/5">
          <h2 className="font-display text-3xl text-brand-muted tracking-wide mb-6">
            VISTOS RECIENTEMENTE
          </h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible pb-2 sm:pb-0 opacity-70 hover:opacity-100 transition-opacity duration-300">
            {vistos.map(p => (
              <Link key={`visto-${p.id}`} to={`/producto/${p.id}`} className="card group flex flex-col overflow-hidden flex-shrink-0 w-44 sm:w-auto">
                <div className="aspect-square overflow-hidden mb-2">
                  <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-3 pt-0">
                  <h4 className="text-white text-xs font-semibold line-clamp-1">{p.nombre}</h4>
                  <p className="text-brand-orange font-bold text-sm mt-1">{CONFIG.store.currencySymbol}{p.precio.toLocaleString("es-AR")}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
