import { createContext, useContext, useReducer, useEffect, useState } from "react"

// ─── Contexto ────────────────────────────────────────────────────────────────
const CartContext = createContext(null)

// ─── Tipos de acción ─────────────────────────────────────────────────────────
const ACTIONS = {
  ADD_ITEM:    "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  UPDATE_QTY:  "UPDATE_QTY",
  CLEAR_CART:  "CLEAR_CART",
}

// ─── Reducer ─────────────────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const existing = state.find(i => i.id === action.payload.id)
      if (existing) {
        return state.map(i =>
          i.id === action.payload.id
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        )
      }
      return [...state, { ...action.payload, cantidad: 1 }]
    }

    case ACTIONS.REMOVE_ITEM:
      return state.filter(i => i.id !== action.payload)

    case ACTIONS.UPDATE_QTY:
      if (action.payload.cantidad < 1) {
        return state.filter(i => i.id !== action.payload.id)
      }
      return state.map(i =>
        i.id === action.payload.id
          ? { ...i, cantidad: action.payload.cantidad }
          : i
      )

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
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
      } catch {
        return []
      }
    }
  )

  // Persistir en localStorage cada vez que cambia el carrito
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  // ── Acciones del carrito ──────────────────────────────────────────────────
  const addItem    = (product)         => dispatch({ type: ACTIONS.ADD_ITEM,    payload: product })
  const removeItem = (id)              => dispatch({ type: ACTIONS.REMOVE_ITEM, payload: id })
  const updateQty  = (id, cantidad)    => dispatch({ type: ACTIONS.UPDATE_QTY,  payload: { id, cantidad } })
  const clearCart  = ()                => dispatch({ type: ACTIONS.CLEAR_CART })

  // ── Valores derivados ─────────────────────────────────────────────────────
  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0)
  const isInCart   = (id) => items.some(i => i.id === id)

  const openCart   = () => setIsCartOpen(true)
  const closeCart  = () => setIsCartOpen(false)

  return (
    <CartContext.Provider
      value={{ 
        items, addItem, removeItem, updateQty, clearCart, 
        totalItems, totalPrice, isInCart,
        isCartOpen, openCart, closeCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// ─── Hook personalizado ───────────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart debe usarse dentro de un CartProvider")
  return ctx
}
