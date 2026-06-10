import { useParams, Link, Navigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useToast } from "../context/ToastContext"
import { useState, useEffect } from "react"
import productos from "../data/productos.json"
import { CONFIG, SITE_URL } from "../config"
import useSEO from "../hooks/useSEO"
import { formatoCOP } from "../utils/moneda"

// Colores de badges
const badgeColors = {
  "Más vendido": "bg-brand-orange text-white",
  "Mas vendido": "bg-brand-orange text-white",
  "Nuevo":       "bg-brand-neon text-brand-dark",
  "Oferta":      "bg-red-500 text-white",
  "Destacado":   "bg-purple-500 text-white",
}



export default function DetalleProducto() {
  const { id } = useParams()
  const { addItem, countInCart } = useCart()
  const { addToast } = useToast()
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [vistos, setVistos] = useState([])

  const producto = productos.find(p => p.id === parseInt(id))
  


  // Variantes lógicas basadas en categoría (Simuladas)
  const variantesDisponibles = producto ? (
    ["Proteínas", "Creatinas", "Otros Suplementos"].includes(producto.categoria) 
      ? ["Chocolate", "Vainilla", "Fresa", "Neutro"]
      : producto.categoria === "Preentrenos" 
        ? ["Punch", "Limón", "Blue Raspberry"] 
        : ["Talla Única"]
  ) : []
  const [selectedVariant, setSelectedVariant] = useState(variantesDisponibles[0])

  useSEO({
    title: producto ? producto.nombre : "Producto no encontrado",
    description: producto ? producto.descripcion : "Detalle del producto en LEOFIT",
    image: producto ? `${SITE_URL}${producto.imagen}` : undefined
  })

  useEffect(() => {
    if (producto && !variantesDisponibles.includes(selectedVariant)) {
      setSelectedVariant(variantesDisponibles[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [producto])

  const inCartCount = countInCart(producto?.id)

  const handleBotonCarrito = () => {
    const itemCartId = `${producto.id}-${selectedVariant}`
    addItem({ ...producto, cartId: itemCartId, variante: selectedVariant })
    addToast(`✅ ${producto.nombre} (${selectedVariant}) agregado al carrito`)
  }

  // Productos relacionados: priorizar misma marca, luego misma categoría (hasta 4)
  const relacionados = producto ? [
    ...productos.filter(p => p.marca === producto.marca && p.id !== producto.id),
    ...productos.filter(p => p.marca !== producto.marca && p.categoria === producto.categoria && p.id !== producto.id),
  ].slice(0, 4) : []

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

  if (!producto) {
    return <Navigate to="/catalogo" replace />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
    
      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center cursor-pointer opacity-0 animate-fade-in"
          style={{ animationFillMode: "forwards" }}
          onClick={() => setIsLightboxOpen(false)}
          onKeyDown={e => e.key === "Escape" && setIsLightboxOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Cerrar imagen ampliada"
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
            REEMPLAZAR: cambia producto.imagen por tu foto real.
            Ejemplo: src="/imagenes/whey-protein-gold.jpg"
        */}
        <div
          className="relative rounded-2xl overflow-hidden aspect-square bg-brand-dark-card cursor-zoom-in group"
          onClick={() => setIsLightboxOpen(true)}
          onKeyDown={e => e.key === "Enter" && setIsLightboxOpen(true)}
          role="button"
          tabIndex={0}
          aria-label="Ampliar imagen del producto"
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
            width={600}
            height={600}
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



          {/* Nombre */}
          <h1 className="font-display text-4xl sm:text-5xl text-white leading-tight mb-4">
            {producto.nombre.toUpperCase()}
          </h1>

          {/* Precio */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-brand-orange font-bold text-4xl">
              {formatoCOP(producto.precio)}
            </span>
            <span className="text-brand-muted text-sm">{CONFIG.store.currency}</span>
          </div>

          {/* Descripción */}
          <p className="text-gray-300 leading-relaxed mb-6 text-base">
            {producto.descripcion}
          </p>

          {/* ── SELECTOR DE VARIANTES ──────────────────────── */}
          <div className="mb-6">
            <h4 className="text-white text-sm font-semibold mb-3 tracking-wide">
              Seleccionar Variante: <span className="text-brand-orange font-normal">{selectedVariant}</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {variantesDisponibles.map(v => (
                <button
                  key={v}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${selectedVariant === v ? 'bg-brand-orange border-brand-orange text-white shadow-lg shadow-brand-orange/20' : 'bg-brand-dark-3 border-white/5 text-gray-400 hover:text-white hover:border-white/20'}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Botón principal */}
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={handleBotonCarrito}
              disabled={producto.stock === 0}
              className={`flex-1 text-lg py-4 rounded-xl font-bold transition-all duration-200 cursor-pointer 
                ${producto.stock === 0
                    ? "bg-brand-dark-card text-brand-muted cursor-not-allowed"
                    : "bg-brand-orange hover:bg-brand-orange-light text-white hover:scale-[1.02] active:scale-[0.98]"
                }`}
            >
              {producto.stock === 0 ? "Sin stock" : "Agregar al carrito"}
            </button>
            {inCartCount > 0 && (
               <Link to="/carrito" className="bg-brand-dark-3 text-white border border-white/10 hover:border-brand-orange/50 py-4 px-6 rounded-xl transition-colors font-bold flex items-center justify-center">
                 🛒
                 <span className="w-5 h-5 bg-brand-orange text-white text-[10px] rounded-full flex items-center justify-center absolute -top-1 -right-1 shadow-lg pointer-events-none translate-x-1 translate-y-1">
                   {inCartCount}
                 </span>
               </Link>
            )}
          </div>

          {/* ── Trust Badges ────────────────── */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-brand-muted mt-2 mb-2 px-1">
            <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg> Pago Seguro</span>
            <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-brand-orange"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg> Envíos Nacionales</span>
            <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-brand-neon"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg> Originales</span>
          </div>

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
                    {formatoCOP(p.precio)}
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
                  <p className="text-brand-orange font-bold text-sm mt-1">{formatoCOP(p.precio)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      {/* ── Sticky Botón Mobile ──────────────────────────────── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 pb-6 bg-brand-dark/90 backdrop-blur-xl border-t border-white/10 z-40 flex items-center gap-4 animate-slide-up shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-bold line-clamp-1">{producto.nombre}</p>
          <p className="text-brand-orange font-bold text-xs">{selectedVariant}</p>
        </div>
        <button
          onClick={handleBotonCarrito}
          disabled={producto.stock === 0}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex-shrink-0 ${producto.stock === 0 ? 'bg-brand-dark-3 text-brand-muted cursor-not-allowed' : 'bg-brand-orange hover:bg-brand-orange-light text-white shadow-lg shadow-brand-orange/30 active:scale-95'}`}
        >
          {producto.stock === 0 ? "Sin stock" : "Agregar"}
        </button>
      </div>
    </div>
  )
}
