import { describe, it, expect } from "vitest"
import { generarLinkWhatsApp } from "./whatsapp"
import { CONFIG } from "../config"

const itemsBase = [
  { id: 1, cartId: "1-Chocolate", nombre: "Gold Standard 5 lbs", variante: "Chocolate", precio: 185000, cantidad: 2, stock: 10 },
  { id: 2, cartId: "2-Unica",     nombre: "Creatina Platinum",    variante: "Única",     precio: 65000,  cantidad: 1, stock: 5  },
]
const totalBase = 185000 * 2 + 65000 * 1  // 435000

function decodificarLink(link) {
  const url = new URL(link)
  return decodeURIComponent(url.searchParams.get("text"))
}

// ── Test 1: estructura del link ───────────────────────────────────────────────
describe("generarLinkWhatsApp", () => {
  it("genera un link que empieza con https://wa.me/ y el número de CONFIG", () => {
    const link = generarLinkWhatsApp(itemsBase, totalBase, "Leo", "Transferencia", "Domicilio", "AB12")
    expect(link).toMatch(`https://wa.me/${CONFIG.whatsapp.number}`)
  })

  // ── Test 2: cada producto aparece con cantidad y subtotal ─────────────────
  it("incluye cada producto con su cantidad y subtotal en el mensaje", () => {
    const link = generarLinkWhatsApp(itemsBase, totalBase, "Leo", "", "", "AB12")
    const mensaje = decodificarLink(link)

    expect(mensaje).toContain("2x Gold Standard 5 lbs")
    expect(mensaje).toContain("1x Creatina Platinum")
    // Subtotales formateados en COP
    expect(mensaje).toContain("370.000")   // 185000 × 2
    expect(mensaje).toContain("65.000")    // 65000 × 1
  })

  // ── Test 3: el total formateado aparece en el mensaje ─────────────────────
  it("incluye el total formateado en COP al final del mensaje", () => {
    const link = generarLinkWhatsApp(itemsBase, totalBase, "Leo", "", "", "AB12")
    const mensaje = decodificarLink(link)

    // Total = 435.000
    expect(mensaje).toContain("435.000")
    expect(mensaje).toContain("TOTAL ESTIMADO")
  })

  // ── Test 4: caracteres especiales quedan correctamente codificados ────────
  it("codifica correctamente nombres con &, # y tildes", () => {
    const itemsEspeciales = [
      { id: 3, cartId: "3-Unica", nombre: "BCAA & Glutamina #Pro", variante: "Única", precio: 75000, cantidad: 1, stock: 3 },
      { id: 4, cartId: "4-Unica", nombre: "Proteína Súper Vainilla", variante: "Única", precio: 120000, cantidad: 1, stock: 8 },
    ]
    const link = generarLinkWhatsApp(itemsEspeciales, 195000, "María", "", "", "CD34")

    // La URL no debe tener caracteres sin codificar
    expect(link).not.toContain(" ")
    expect(link).not.toContain("&")
    expect(link).not.toContain("#")

    // Pero al decodificar deben aparecer correctamente
    const mensaje = decodificarLink(link)
    expect(mensaje).toContain("BCAA & Glutamina #Pro")
    expect(mensaje).toContain("Proteína Súper Vainilla")
    expect(mensaje).toContain("María")
  })
})
