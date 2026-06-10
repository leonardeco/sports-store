import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useState } from "react"
import { CONFIG } from "../config"
import productos from "../data/productos.json"

// Destacados para upselling
const destacados = productos.filter(p => p.destacado).slice(0, 4)

// ── Genera el link de WhatsApp con el resumen del pedido ──────────────────────
function generarLinkWhatsApp(items, total, nombre, pago, envio, orderId) {
  const lineas = items.map(
    item =>
      `- ${item.cantidad}x ${item.nombre} ${item.variante && item.variante !== 'Única' ? `[${item.variante}]` : ''} - ${CONFIG.store.currencySymbol}${(item.precio * item.cantidad).toLocaleString("es-AR")}`
  )

  const fecha = new Date().toLocaleDateString("es-AR")
  
  const mensaje = [
    `*NUEVA ORDEN: LEOFIT #ORD-${orderId}*`,
    `- Fecha: ${fecha}`,
    nombre ? `- Cliente: *${nombre}*` : `- Cliente: (Sin especificar)`,
    "------------------------",
    "*PRODUCTOS:*",
    ...lineas,
    "",
    `- Envío: ${envio || 'A coordinar'}`,
    `- Pago: ${pago || 'A coordinar'}`,
    "------------------------",
    `*TOTAL ESTIMADO: ${CONFIG.store.currencySymbol}${total.toLocaleString("es-AR")}*`,
  ].join("\n")

  return `https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(mensaje)}`
}

// ── Componente fila de item ───────────────────────────────────────────────────
function CartItem({ item }) {
  const { removeItem, updateQty } = useCart()

  return (
    <div className="flex items-center gap-4 bg-brand-dark-card rounded-xl p-4 animate-fade-in">
      {/* Imagen
          REEMPLAZAR: cambiá item.imagen por tu foto real */}
      <img
        src={item.imagen}
        alt={item.nombre}
        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-2 leading-snug">
          {item.nombre}
        </h3>
        <p className="text-brand-muted text-xs mt-0.5">{item.categoria}</p>
        <p className="text-brand-orange font-bold text-sm mt-1">
          {CONFIG.store.currencySymbol}{item.precio.toLocaleString("es-AR")} c/u
        </p>
      </div>

      {/* Control de cantidad */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQty(item.cartId || item.id, item.cantidad - 1)}
            className="w-8 h-8 rounded-lg bg-brand-dark-3 text-white hover:bg-brand-orange transition-colors flex items-center justify-center font-bold cursor-pointer"
            aria-label="Reducir cantidad"
          >
            −
          </button>
          <span className="text-white font-semibold w-6 text-center">{item.cantidad}</span>
          <button
            onClick={() => updateQty(item.cartId || item.id, item.cantidad + 1)}
            disabled={item.cantidad >= (item.stock ?? 99)}
            className={`w-8 h-8 rounded-lg bg-brand-dark-3 text-white transition-colors flex items-center justify-center font-bold
              ${item.cantidad >= (item.stock ?? 99)
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-brand-orange cursor-pointer"
              }`}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
        {item.cantidad >= (item.stock ?? 99) && (
          <span className="text-[10px] text-yellow-500 font-semibold uppercase tracking-wider">
            Max. disponible
          </span>
        )}
      </div>

      {/* Subtotal */}
      <div className="text-right flex-shrink-0">
        <p className="text-brand-orange font-bold text-sm sm:text-base">
          {CONFIG.store.currencySymbol}{(item.precio * item.cantidad).toLocaleString("es-AR")}
        </p>
      </div>

      {/* Eliminar */}
      <button
        onClick={() => removeItem(item.cartId || item.id)}
        className="text-brand-muted hover:text-red-400 transition-colors flex-shrink-0 cursor-pointer p-1"
        aria-label="Eliminar del carrito"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </button>
    </div>
  )
}

// ── Página principal del carrito ─────────────────────────────────────────────
export default function Carrito() {
  const { items, totalItems, totalPrice, clearCart } = useCart()
  const [nombreCliente, setNombreCliente] = useState("")
  const [metodoPago, setMetodoPago] = useState("")
  const [metodoEnvio, setMetodoEnvio] = useState("")
  const [orderId] = useState(() => Math.random().toString(36).substring(2, 6).toUpperCase())

  // ── Carrito vacío ─────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-16">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="font-display text-4xl text-white tracking-wide mb-3">
            TU CARRITO ESTÁ VACÍO
          </h2>
          <p className="text-brand-muted text-lg mb-8">
            Agregá productos desde el catálogo para armar tu pedido.
          </p>
          <Link to="/catalogo" className="btn-primary text-lg px-10 py-4 shadow-lg shadow-brand-orange/20">
            Ir al catálogo
          </Link>
        </div>
        
        {/* Upselling Básico */}
        <div>
           <h3 className="font-display text-3xl text-white mb-6">Quizás te interese...</h3>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
             {destacados.map(p => (
               <Link key={p.id} to={`/producto/${p.id}`} className="card group flex flex-col overflow-hidden">
                 <div className="aspect-square relative overflow-hidden"><img src={p.imagen} className="object-cover w-full h-full group-hover:scale-105 transition-transform"/></div>
                 <div className="p-3"><h4 className="text-sm font-semibold text-white line-clamp-1">{p.nombre}</h4><p className="text-brand-orange font-bold text-sm mt-1">{CONFIG.store.currencySymbol}{p.precio.toLocaleString("es-AR")}</p></div>
               </Link>
             ))}
           </div>
        </div>
      </div>
    )
  }

  const whatsappLink = generarLinkWhatsApp(items, totalPrice, nombreCliente, metodoPago, metodoEnvio, orderId)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="font-display text-5xl sm:text-6xl text-white tracking-wide">
          MI CARRITO
        </h1>
        <p className="text-brand-muted mt-1">
          {totalItems} {totalItems === 1 ? "producto" : "productos"}
        </p>
      </div>

      {/* ── Layout dos columnas ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Lista de items (2/3) ───────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map(item => (
            <CartItem key={item.id} item={item} />
          ))}

          {/* Vaciar carrito */}
          <button
            onClick={clearCart}
            className="text-red-400 hover:text-red-300 text-sm underline text-left mt-2 cursor-pointer w-fit"
          >
            Vaciar carrito
          </button>
        </div>

        {/* ── Resumen del pedido (1/3, sticky) ──────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-brand-dark-card rounded-2xl p-6 border border-white/5 lg:sticky lg:top-24">
            <h3 className="text-white font-bold text-lg mb-5 pb-4 border-b border-white/10">
              Resumen del pedido
            </h3>

            {/* Detalle de items */}
            <div className="flex flex-col gap-3 mb-5">
              {items.map(item => (
                <div key={item.cartId || item.id} className="flex justify-between text-sm">
                  <span className="text-brand-muted line-clamp-1 flex-1 mr-2">
                    {item.nombre} x{item.cantidad}
                  </span>
                  <span className="text-white font-medium flex-shrink-0">
                    {CONFIG.store.currencySymbol}{(item.precio * item.cantidad).toLocaleString("es-AR")}
                  </span>
                </div>
              ))}
            </div>

            {/* Envío */}
            <div className="flex justify-between text-sm mb-4 pb-4 border-b border-white/10">
              <span className="text-brand-muted">Envío</span>
              <span className="text-yellow-400 font-medium">A coordinar por WA</span>
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-white font-bold text-lg">Total</span>
              <span className="text-brand-orange font-bold text-2xl">
                {CONFIG.store.currencySymbol}{totalPrice.toLocaleString("es-AR")}
              </span>
            </div>

            <div className="mb-4 text-sm mt-4">
               <label className="text-brand-muted block mb-1 font-semibold">Tu Nombre</label>
               <input 
                 type="text" 
                 value={nombreCliente} 
                 onChange={e => setNombreCliente(e.target.value)} 
                 placeholder="Ej. Leonardo" 
                 className="w-full bg-brand-dark-3 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-orange/50 transition-colors mb-4"
               />
               
               <label className="text-brand-muted block mb-1 font-semibold">Método de Envío</label>
               <select 
                 value={metodoEnvio} 
                 onChange={e => setMetodoEnvio(e.target.value)}
                 className="w-full bg-brand-dark-3 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-orange/50 transition-colors mb-4 appearance-none"
               >
                 <option value="" disabled>Selecciona una opción</option>
                 <option value="Retiro por el Local">Retiro por el Local</option>
                 <option value="Envío a Domicilio">Envío a Domicilio</option>
               </select>

               <label className="text-brand-muted block mb-1 font-semibold">Forma de Pago</label>
               <select 
                 value={metodoPago} 
                 onChange={e => setMetodoPago(e.target.value)}
                 className="w-full bg-brand-dark-3 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-orange/50 transition-colors mb-2 appearance-none"
               >
                 <option value="" disabled>Selecciona una opción</option>
                 <option value="Transferencia / Alias">Transferencia / Alias</option>
                 <option value="Efectivo al entregar">Efectivo al entregar</option>
               </select>
            </div>

            {/* ── BOTÓN WHATSAPP ──────────────────────────────────
                Al hacer clic, se abre WhatsApp con el resumen del
                pedido ya escrito. Solo hay que enviar el mensaje.
                El número se configura en src/config.js
            */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 mt-2 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-green-600/20"
            >
              {/* Icono WhatsApp */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Completar pedido por Whatsap
            </a>

            <div className="flex items-center justify-center gap-2 mt-4 text-brand-muted text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              🔒 Checkout Seguro de LEOFIT vía WhatsApp
            </div>

            {/* Seguir comprando */}
            <Link
              to="/catalogo"
              className="block text-center text-brand-muted hover:text-brand-orange text-sm mt-4 transition-colors"
            >
              ← Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
