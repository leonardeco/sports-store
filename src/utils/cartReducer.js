// ─────────────────────────────────────────────────────────────────────────────
//  Reducer del carrito extraído a su propio módulo (SRP / testeable).
//  CartContext.jsx debe importar ACTIONS y cartReducer desde aquí:
//    import { ACTIONS, cartReducer } from "../utils/cartReducer"
//  Ubicación sugerida: src/utils/cartReducer.js
// ─────────────────────────────────────────────────────────────────────────────

export const ACTIONS = {
  ADD_ITEM:    "ACTIONS/ADD_ITEM",
  REMOVE_ITEM: "ACTIONS/REMOVE_ITEM",
  UPDATE_QTY:  "ACTIONS/UPDATE_QTY",
  CLEAR_CART:  "ACTIONS/CLEAR_CART",
}

const keyOf = (i) => (i.cartId || i.id.toString())

export function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const cartId = action.payload.cartId || action.payload.id.toString()
      const stock = action.payload.stock ?? 99
      const existing = state.find((i) => keyOf(i) === cartId)
      if (existing) {
        return state.map((i) =>
          keyOf(i) === cartId
            ? { ...i, cantidad: Math.min(i.cantidad + 1, stock) }
            : i
        )
      }
      return [...state, { ...action.payload, cartId, cantidad: 1 }]
    }

    case ACTIONS.REMOVE_ITEM:
      return state.filter((i) => keyOf(i) !== action.payload.toString())

    case ACTIONS.UPDATE_QTY: {
      const target = action.payload.cartId.toString()
      if (action.payload.cantidad < 1) {
        return state.filter((i) => keyOf(i) !== target)
      }
      const existing = state.find((i) => keyOf(i) === target)
      const stock = existing ? (existing.stock ?? 99) : 99
      return state.map((i) =>
        keyOf(i) === target
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
