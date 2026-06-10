import { createContext, useContext, useReducer, useEffect, useState } from "react"
import productos from "../data/productos.json"

// ─── Contexto ────────────────────────────────────────────────────────────────
const CartContext = createContext(null)

// ─── Tipos de acción ─────────────────────────────────────────────────────────
const ACTIONS = {
  ADD_ITEM:    "ACTIONS/ADD_ITEM",
  REMOVE_ITEM: "ACTIONS/REMOVE_ITEM",
  UPDATE_QTY:  "ACTIONS/UPDATE_QTY",
  CLEAR_CART:  "ACTIONS/CLEAR_CART",
}

// ─── Reducer ─────────────────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const cartId = action.payload.cartId || action.payload.id.toString()
      const payloadToAdd = { ...action.payload, cartId }
      const stock = action.payload.stock ?? 99

      const existing = state.find(i => (i.cartId || i.id.toString()) === cartId)
      if (existing) {
        return state.map(i =>
          (i.cartId || i.id.toString()) === cartId
            ? { ...i, cantidad: Math.min(i.cantidad + 1, stock) }
            : i
        )
      }
      return [...state, { ...payloadToAdd, cantidad: 1 }]
    }

    case ACTIONS.REMOVE_ITEM:
      return state.filter(i => (i.cartId || i.id.toString()) !== action.payload.toString())

    case ACTIONS.UPDATE_QTY: {
      if (action.payload.cantidad < 1) {
        return state.filter(i => (i.cartId || i.id.toString()) !== action.payload.cartId.toString())
      }
      const existing = state.find(i => (i.cartId || i.id.toString()) === action.payload.cartId.toString())
      const stock = existing ? (existing.stock ?? 99) : 99
      return state.map(i =>
        (i.cartId || i.id.toString()) === action.payload.cartId.toString()
          ? { ...i, cantidad: Math.min(action.payload.cantidad, stock) }
          : i
      )
    }

    case ACTIONS.CLEAR_CART:
      return []

    default:
      return state
  }
}

// ─── Clave de localStorage ────────────────────────────────────────────────────
const STORAGE_KEY = "leofit_cart"

// ─── Provider ────────────────────────────────────────────────────────────────
export function CartProvider({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [items, dispatch] = useReducer(
    cartReducer,
    [],
    // Inicializar desde localStorage si existe
    () => {
      try {
        const storedStr = localStorage.getItem(STORAGE_KEY)
        if (!storedStr) return []
        const stored = JSON.parse(storedStr)
        if (!Array.isArray(stored)) return []

        return stored
          .map(item => {
            const id = item.id
            const cantidad = item.cantidad
            if (id === undefined || cantidad === undefined) return null

            const prod = productos.find(p => p.id === id)
            if (!prod) return null

            const stock = prod.stock ?? 99
            const finalCantidad = Math.min(Math.max(1, cantidad | 0), stock)

            const variante = item.variante || (prod.categoria === "Preentrenos" ? "Punch" : (["Proteínas", "Creatinas", "Otros Suplementos"].includes(prod.categoria) ? "Vainilla" : "Única"))
            const cartId = item.cartId || `${id}-${variante}`

            return {
              ...prod,
              variante,
              cartId,
              cantidad: finalCantidad
            }
          })
          .filter(Boolean)
      } catch {
        return []
      }
    }
  )

  // Persistir en localStorage cada vez que cambia el carrito
  useEffect(() => {
    const minimal = items.map(({ id, cantidad }) => ({ id, cantidad }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal))
  }, [items])

  // ── Acciones del carrito ──────────────────────────────────────────────────
  const addItem    = (product)         => dispatch({ type: ACTIONS.ADD_ITEM,    payload: product })
  const removeItem = (cartId)          => dispatch({ type: ACTIONS.REMOVE_ITEM, payload: cartId })
  const updateQty  = (cartId, cantidad)=> dispatch({ type: ACTIONS.UPDATE_QTY,  payload: { cartId, cantidad } })
  const clearCart  = ()                => dispatch({ type: ACTIONS.CLEAR_CART })

  // ── Valores derivados ─────────────────────────────────────────────────────
  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0)
  // Devuelve cantidad total de ese ID sin importar variante para la UI de Detalles
  const countInCart = (id) => items.filter(i => i.id === id).reduce((sum, i) => sum + i.cantidad, 0)

  const openCart   = () => setIsCartOpen(true)
  const closeCart  = () => setIsCartOpen(false)

  return (
    <CartContext.Provider
      value={{ 
        items, addItem, removeItem, updateQty, clearCart, 
        totalItems, totalPrice, countInCart,
        isCartOpen, openCart, closeCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// ─── Hook personalizado ───────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart debe usarse dentro de un CartProvider")
  return ctx
}
