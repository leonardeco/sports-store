import { describe, it, expect } from "vitest"
import { cartReducer, ACTIONS } from "./cartReducer"

const whey = { id: 1, nombre: "Whey Gold", precio: 175000, stock: 3, cartId: "1-Vainilla" }
const crea = { id: 2, nombre: "Creatina",  precio: 65000,  stock: 5, cartId: "2-Unica" }

const add = (s, p) => cartReducer(s, { type: ACTIONS.ADD_ITEM, payload: p })

describe("cartReducer", () => {
  it("agrega un item nuevo con cantidad 1", () => {
    const s = add([], whey)
    expect(s).toHaveLength(1)
    expect(s[0].cantidad).toBe(1)
    expect(s[0].cartId).toBe("1-Vainilla")
  })

  it("incrementa la cantidad si el cartId ya existe", () => {
    const s = add(add([], whey), whey)
    expect(s).toHaveLength(1)
    expect(s[0].cantidad).toBe(2)
  })

  it("trata variantes del mismo producto como items distintos", () => {
    const wheyChoco = { ...whey, cartId: "1-Chocolate" }
    const s = add(add([], whey), wheyChoco)
    expect(s).toHaveLength(2)
  })

  it("nunca supera el stock al incrementar", () => {
    let s = []
    for (let i = 0; i < 6; i++) s = add(s, whey) // stock = 3
    expect(s[0].cantidad).toBe(3)
  })

  it("UPDATE_QTY acota al stock disponible", () => {
    let s = add([], whey)
    s = cartReducer(s, { type: ACTIONS.UPDATE_QTY, payload: { cartId: "1-Vainilla", cantidad: 99 } })
    expect(s[0].cantidad).toBe(3)
  })

  it("UPDATE_QTY con cantidad < 1 elimina el item", () => {
    let s = add([], whey)
    s = cartReducer(s, { type: ACTIONS.UPDATE_QTY, payload: { cartId: "1-Vainilla", cantidad: 0 } })
    expect(s).toHaveLength(0)
  })

  it("REMOVE_ITEM elimina solo el cartId indicado", () => {
    let s = add(add([], whey), crea)
    s = cartReducer(s, { type: ACTIONS.REMOVE_ITEM, payload: "1-Vainilla" })
    expect(s).toHaveLength(1)
    expect(s[0].cartId).toBe("2-Unica")
  })

  it("CLEAR_CART vacía el carrito", () => {
    const s = cartReducer(add([], whey), { type: ACTIONS.CLEAR_CART })
    expect(s).toEqual([])
  })
})
