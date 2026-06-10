import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { formatoCOP } from "../utils/moneda"

export default function CartDrawer() {
  const { isCartOpen, closeCart, items, totalItems, totalPrice, removeItem, updateQty } = useCart()

  if (!isCartOpen) return null

  return (
    <>
      {/* Overlay Oscuro */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />
      
      {/* Panel del Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-brand-dark-2 shadow-2xl z-[70] flex flex-col border-l border-white/5 animate-slide-up sm:animate-none">
        
        {/* Header Drawer */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-brand-dark-card">
          <h2 className="font-display text-3xl text-white tracking-wide">MI CARRITO ({totalItems})</h2>
          <button 
            onClick={closeCart}
            className="text-brand-muted hover:text-brand-orange transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body Drawer (Items) */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {items.length === 0 ? (
            <div className="text-center mt-10">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-brand-muted">Tu carrito está vacío.</p>
              <button onClick={closeCart} className="text-brand-orange underline mt-4">Volver al catálogo</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.cartId || item.id} className="flex gap-4 items-center bg-brand-dark-3 p-3 rounded-xl border border-white/5">
                <img src={item.imagen} alt={item.nombre} width={64} height={64} className="w-16 h-16 rounded-md object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-semibold line-clamp-1">{item.nombre}</h4>
                  <p className="text-brand-orange font-bold text-sm">{formatoCOP(item.precio)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => removeItem(item.cartId || item.id)} className="text-brand-muted hover:text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="flex items-center gap-2 text-xs">
                     <button onClick={() => updateQty(item.cartId || item.id, item.cantidad - 1)} className="w-6 h-6 bg-brand-dark-card text-white rounded flex items-center justify-center hover:bg-brand-orange">-</button>
                     <span className="text-white">{item.cantidad}</span>
                     <button onClick={() => updateQty(item.cartId || item.id, item.cantidad + 1)} className="w-6 h-6 bg-brand-dark-card text-white rounded flex items-center justify-center hover:bg-brand-orange">+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Drawer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-brand-dark-card">
            <div className="flex justify-between items-center mb-6">
              <span className="text-white font-bold text-lg">Total estimado:</span>
              <span className="text-brand-orange font-bold text-2xl">{formatoCOP(totalPrice)}</span>
            </div>
            
            <div className="flex flex-col gap-3">
              <Link 
                to="/carrito" 
                onClick={closeCart}
                className="w-full text-center bg-brand-orange text-white font-bold py-4 rounded-xl hover:bg-brand-orange-light transition-colors shadow-lg shadow-brand-orange/20"
              >
                IR AL CARRITO (FINALIZAR)
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
